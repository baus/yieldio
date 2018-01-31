// Set the region
const data = require('./lib/data.js');
const twitter = require('./lib/twitter');

exports.handler = () => {
    data.onYieldsUpdated((err, yieldHistory) => {
        twitter.tweetYields(yieldHistory);
    });

    data.updateYields();
};

