const https = require('https');
const fs = require('fs');
const config = require('./config/config');
const DOMParser = require('xmldom').DOMParser;

const ALL_YIELDS_FILE = __dirname + '/../data/allyieldsarray.json';
let yieldsUpdatedCallback;

exports.YieldSpread = [];
exports.onYieldsUpdated = function (callback) {
    yieldsUpdatedCallback = callback;
};

/** this should be moved into a utility module **/
function percentageChange(oldValue, newValue) {
    if (oldValue === 0.0) {
        return NaN;
    }
    return ((newValue - oldValue) / oldValue) * 100.0;
}

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
            [parseFloat(latestDateElement.getElementsByTagName(element.tagName)[0].childNodes[0].data)]
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
        return false;
    }

    if (latestYields.length !== previousYields.length) {
        console.log('latest and previous yields have different number of yields');
        console.log('allYields.length: ' + allYields.length);
        console.log('latestYields.length: ' + latestYields.length);
        console.log('previousYields.length: ' + previousYields.length);
        return false;
    }
    latestYields.forEach((latestYield, i) => {
        latestYield[1] = latestYield[0] - previousYields[i][0];
        latestYield[2] = percentageChange(previousYields[i][0], latestYield[0]);
    });

    allYields.push(latestYields);
    return true;
}

function loadYields(callback) {
    fs.readFile(ALL_YIELDS_FILE, (err, data) => {
        if (err) {
            callback(err);
        } else {
            callback(null, JSON.parse(data));
        }
    });
}


function fetchAndUpdateYields(allYields, callback) {
    let yieldXML = "";
    const req = https.get(config.bondYields.url, function (res) {
        res.setEncoding('utf8');
        res.on('data', chunk => yieldXML += chunk);
        res.on('end', () => {
            if (appendLatestYieldsToAllYields(parseYields(yieldXML), allYields)) {
                // TODO: copy the old file to a temp file in case
                //       there is an error writing the new file.
                fs.writeFile(ALL_YIELDS_FILE, JSON.stringify(allYields), function (err) {
                    if (err) {
                        callback(err);
                    }
                    callback(undefined, exports.YieldSpread);
                });
            }
        });
    });
    req.on('error', err => {
        callback(err);
    });
}


loadYields((err, data) => {
    if (err) {
        console.log(err);
    } else {
        console.log("loaded all yields");
        exports.YieldSpread = data;
        setInterval(fetchAndUpdateYields, 1000 * 60 * 5, exports.YieldSpread, yieldsUpdatedCallback);
    }
});


exports.loadYields = loadYields;
