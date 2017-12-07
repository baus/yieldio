const path = require('path');

module.exports = {
    root: path.normalize(__dirname + '/../../..'),
    port: process.env.PORT || 3000,
    bondYields: {
        url: 'https://www.treasury.gov/resource-center/data-chart-center/interest-rates/Datasets/yield.xml'
    }, twitter: {
        yieldUpdateTweet: '10y #USTreasury #yields {0} by {1} bps to {2}%. The percentage change is {3}%. All durations at: http://yield.io/'
    }
};
