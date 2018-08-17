'use strict';

/**
 * Load Module Dependencies
 */
const path     = require('path');

const Koa         = require('koa');
const validator   = require('koa-validate');
const serve       = require('koa-static');
const logger      = require('koa-logger');
const bodyParser  = require('koa-body');

const errorHandler = require('./lib/error-handler');
const router       = require('./routes');

let app = new Koa();

/**
 * Application Settings
 */

// Enable Proxy Trust
if(app.env === 'production') {
  app.proxy = true;
}

/**
 * Setup Middleware.
 */

validator(app);

// Set Error Handler
app.use(errorHandler());

// Serve Documentation files
app.use(serve(path.join(__dirname, '/public')));

// Enable Console logging(only in development)
if(app.env === 'development') {
  app.use(logger());
}

// Enable Body parser
app.use(bodyParser());

//--Routes--//
app.use(router.routes());

// Export app for testing
module.exports = app;
