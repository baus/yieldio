const Ntwitter  = require('ntwitter');
const config = require('./config/config');
const fs = require('fs');
const util = require('./util');
const TWITTER_ACCESS_TOKEN_FILE = __dirname + '/../lib/config/twitteraccesstoken.json';
let twitterConfig = {};


function loadTwitterAccessToken () {
    fs.readFile(TWITTER_ACCESS_TOKEN_FILE, function (err, data) {
        if (err) {
            console.log("failed to open twitter access token file: " + err);
        } else {
            twitterConfig = JSON.parse(data);
            console.log("loaded twitter access token");
        }
    });
};

exports.tweetYields = function (allYields) {
    const twitter = new Ntwitter({
        consumer_key: twitterConfig.consumerKey,
        consumer_secret: twitterConfig.consumerSecret,
        access_token_key: twitterConfig.accessTokenKey,
        access_token_secret: twitterConfig.accessTokenSecret
    });
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

loadTwitterAccessToken();

