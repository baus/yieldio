const config = require('./config');

module.exports = function(app) {
    app.set('views', config.root + '/static/views');
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');
};
