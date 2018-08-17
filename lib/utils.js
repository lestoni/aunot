'use strict';

/**
 * Load Module Dependencies.
 */
const debug = require('debug')('app:utils');

// Set Error Handler for the server
exports.onServerError = (PORT) => {
  return (error) => {
    debug('Server ConnectionError Triggered');

    if (error.syscall !== 'listen') {
      throw error;
    }

    let bind = (typeof PORT === 'string') ? `Pipe ${PORT}` : `Port ${PORT}`;

    // Handle Specific listen errors with friendly messages.
    switch(error.code) {
      case 'EACCES':
        console.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  }
}

// Set handler for 'listening' event
exports.onServerListening = (server, PORT) => {
  return () => {
    let addr = server.address();
    let bind = (typeof PORT === 'string') ? `Pipe ${PORT}` : `Port ${PORT}`;

    debug(`Listening on ${bind}`);
  }
}
