'use strict';

const data = require('./data');
const express = require('express');

module.exports = function(app) {
    app.use(express.static('server/static'));
    app.get('/api/allyields.json', (req, res) => res.json(data.YieldSpread));
    /*app.get('/', (req, res) => res.sendfile('react'));*/
};
