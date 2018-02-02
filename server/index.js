const data = require('./lib/data.js');
const twitter = require('./lib/twitter');

/**
 * This is a AWS Lambda function which is run as a Scheduled Event.
 *
 * It reads existing yields from a S3 bucket, and then compares them with the latest yields fro the Treasury.
 * If the yields have been updated, the JSON file is appended and re-saved to S3. When new yields are found,
 * a twitter feed is updated.
 */
exports.handler = () => {
    data.onYieldsUpdated((err, yieldHistory) => {
        twitter.tweetYields(yieldHistory);
    });

    data.updateYields();
};

