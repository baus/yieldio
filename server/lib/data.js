const https = require('https');
const config = require('./config/config');
const DOMParser = require('xmldom').DOMParser;
const AWS = require('aws-sdk');
const util = require('./util');
AWS.config.update({region: 'us-west-2'});
const cloudfront = new AWS.CloudFront();
const s3 = new AWS.S3();

let yieldsUpdatedCallback;

exports.YieldSpread = [];
exports.onYieldsUpdated = function (callback) {
    yieldsUpdatedCallback = callback;
};


function parseYields(yieldXML) {
    const YIELD_ELEMENTS = [{duration: 1, tagName: "BC_1MONTH"}, {duration: 3, tagName: "BC_3MONTH"},
        {duration: 6, tagName: "BC_6MONTH"}, {duration: 12, tagName: "BC_1YEAR"},
        {duration: 24, tagName: "BC_2YEAR"}, {duration: 36, tagName: "BC_3YEAR"},
        {duration: 60, tagName: "BC_5YEAR"}, {duration: 84, tagName: "BC_7YEAR"},
        {duration: 120, tagName: "BC_10YEAR"}, {duration: 240, tagName: "BC_20YEAR"},
        {duration: 360, tagName: "BC_30YEAR"}];

    const doc = new DOMParser().parseFromString(yieldXML, 'text/xml');
    if (!doc) {
        return null;
    }
    const newDateArray = doc.getElementsByTagName("G_NEW_DATE");
    const latestDateElement = newDateArray[newDateArray.length - 1];
    const splitDate = latestDateElement.getElementsByTagName("NEW_DATE")[0].childNodes[0].data.split('-');
    const date = new Date(Date.UTC(parseInt(splitDate[2], 10), parseInt(splitDate[0], 10) - 1, parseInt(splitDate[1], 10)));
    const yields = [];

    yields.push(date.getTime());
    YIELD_ELEMENTS.forEach(element =>
        yields.push(
            [Math.round(parseFloat(latestDateElement.getElementsByTagName(element.tagName)[0].childNodes[0].data) * 100) / 100]
        )
    );

    return yields;
}

function appendLatestYieldsToAllYields(latestYields, allYields) {
    //
    // * Calculate the absolute and percentage differences between previous and current yields.
    // * Add values to a new object and store in allYields variable.

    // This will find the most recent yields which are currently available.
    const previousYields = allYields[allYields.length - 1];

    if (latestYields[0] <= allYields[allYields.length - 1][0]) {
        console.log('Checked for updated yields, but didn\'t find any');
        return false;
    }

    if (latestYields.length !== previousYields.length) {
        console.log('latest and previous yields have different number of yields');
        console.log('allYields.length: ' + allYields.length);
        console.log('latestYields.length: ' + latestYields.length);
        console.log('previousYields.length: ' + previousYields.length);
        return false;
    }
    console.log('Updating yields with the latest');
    latestYields.forEach((latestYield, i) => {
        latestYield[1] = Math.round((latestYield[0] - previousYields[i][0]) * 100) / 100.0;
        const percentChange = util.percentageChange(previousYields[i][0], latestYield[0]);
        latestYield[2] = isNaN(percentChange) ? null : Math.round(percentChange * 100) / 100.0;
    });

    allYields.push(latestYields);
    return true;
}

function loadYields(callback) {
    const params = {
        Bucket: 'yield.io',
        Key: 'api/allYields.json'
    };
    s3.getObject(params, (err, data) => {
        if (err) {
            callback(err);
        }
        else {
            callback(null, JSON.parse(data.Body.toString('utf-8')));
        }
    });
}

function fetchAndUpdateYields(allYields, callback) {
    let yieldXML = "";
    const req = https.get(config.bondYields.url, (res) => {
        res.setEncoding('utf8');
        res.on('data', chunk => yieldXML += chunk);
        res.on('end', () => {
                if (appendLatestYieldsToAllYields(parseYields(yieldXML), allYields)) {
                    // TODO: copy the old file to a temp file in case
                    //       there is an error writing the new file.
                    const params = {
                        Bucket: 'yield.io',
                        Key: 'api/allYields.json',
                        Body: JSON.stringify(allYields),
                        ACL: 'public-read'
                    };


                    s3.upload(params, (err) => {
                        if (err) {
                            console.log(err);
                            return callback(err);
                        } else {

                            // Invalidate Cloudfront after updating S3
                            const params = {
                                DistributionId: 'E3OMDZWH4SO160',
                                InvalidationBatch: {
                                    CallerReference: '' + new Date().getTime(),
                                    Paths: {
                                        Quantity: 1,
                                        Items: ['/*']
                                    }
                                }
                            };
                            // Invalidate
                            cloudfront.createInvalidation(params, (err, data) => {
                                if(err) {
                                    console.log('Failed to invalidate CloudFront: ' + err);
                                    return callback(err);

                                } else {
                                    return callback(undefined, exports.YieldSpread);
                                }
                            });
                        }
                    });
                }
            }
        );
    });
    req.on('error', err => {
        callback(err);
    });
}


exports.updateYields = () => loadYields((err, data) => {
    if (err) {
        console.log(err);
    } else {
        console.log('loaded all yields');
        exports.YieldSpread = data;
        fetchAndUpdateYields(exports.YieldSpread, yieldsUpdatedCallback);
    }
});

