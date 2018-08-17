'use strict';

/**
 * Load Module Dependencies
 */

module.exports = function errorHandler() {
  return async (ctx, next) => {
    try {
      await next();

    } catch (err) {
      let ex = {
        status: err.status,
        user_message: err.user_message,
        message: err.message,
        validation_errors: err.validation_errors,
        type: err.type
      };

      ctx.status = ex.status;
      ctx.body = ex;
      
      ctx.app.emit('error', err, this);
    }
  };
};
