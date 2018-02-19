const Ntwitter  = require('ntwitter');
const config = require('./config/config');
const util = require('./util');
const twitterConfig = require('./config/twitteraccesstoken.json');

exports.tweetYields = function (allYields) {
    const twitter = new Ntwitter(twitterConfig);
    let tweet = config.twitter.yieldUpdateTweet;
    const current10yYield = allYields[allYields.length - 1][9][0];
    const previous10yYield = allYields[allYields.length - 2][9][0];


    if (current10yYield > previous10yYield) {
        tweet = tweet.replace("{0}", "increased");
    } else {
        tweet = tweet.replace("{0}", "decreased");
    }
    tweet = tweet.replace("{1}", Math.floor(current10yYield * 100 - previous10yYield * 100).toString())
        .replace("{2}", current10yYield).toString()
        .replace("{3}", util.percentageChange(previous10yYield, current10yYield).toFixed(2));
    twitter.updateStatus(tweet, err => {
        if (!err) {
            console.log("updated twitter");
        } else {
            console.log(err);
        }
    });
};


