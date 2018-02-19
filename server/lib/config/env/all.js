const path = require('path');

module.exports = {
    root: path.normalize(__dirname + '/../../..'),
    bondYields: {
        url: 'https://www.treasury.gov/resource-center/data-chart-center/interest-rates/Datasets/yield.xml'
    }, twitter: {
        yieldUpdateTweet: '10y #USTreasury #yields {0} by {1} bps (or {3}%) to {2}%. All durations at: http://yield.io/'
    }
};