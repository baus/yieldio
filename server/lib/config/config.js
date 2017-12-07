// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = Object.assign(require('./env/all.js'), require('./env/' + process.env.NODE_ENV + '.js') || {});