'use strict';

/**
 * Load Module dependencies.
 */
const env = process.env;

const PORT        = env.PORT || 8090;
const HOST        = env.HOST_IP || 'localhost';

let config = {

  ENV: NODE_ENV,

  PORT: PORT,

  HOST: HOST,


  WATSON: {
    USERNAME: env.IBM_WATSON_USERNAME,
    PASSWORD: env.IBM_WATSON_PASSWORD
  }

};

module.exports = config;
