'use strict';

const serverless = require ('serverless-http');

const app = require('./lib/server/server');

exports.handler = serverless(app);
