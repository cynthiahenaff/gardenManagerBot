#!/usr/bin/env node

'use strict';

require('@babel/register')({
  extensions: ['.js'],
});

module.exports = require('./server');
