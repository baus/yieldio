const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const compression = require('compression');
const config = require('./server/lib/config/config');
const data = require('./server/lib/data');
const twitter = require('./server/lib/twitter');
const app = express();

// Express settings
require('./server/lib/config/express')(app);


if ('development' === config.env) {
    const webpackConfig = require('./webpack.config.js');
    const compiler = webpack(webpackConfig);

    // Tell express to use the webpack-dev-middleware and use the webpack.config.js
    // configuration file as a base.
    app.use(webpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath
    }));
}

// Compress all responses
app.use(compression());

// Routing
require('./server/lib/routes')(app);


data.onYieldsUpdated((err, yieldHistory) => {
    if ('production' === config.env) {
        twitter.tweetYields(yieldHistory);
    }
});

// Start server
app.listen(config.port, () => console.log('Server listening on port %d in %s mode', config.port, config.env));

// Expose app
exports = module.exports = app;
