'use strict';
/**
 * Load Module Dependencies
 */
const DEFAULT_ERROR = {
  status: 500,
  message: 'Unknown issue',
  user_message: "Oh! Snap! Something Just Broke! Hold on, our benevolent team is checking it out!",
  type: "SERVER_ERROR"
}

/**
 * CustomError Type Definition
 */

exports.CustomError = class CustomError extends Error {
  constructor(info) {
    super(info.message ? info.message : DEFAULT_ERROR.message);

    this.type               = info.type ? info.type : DEFAULT_ERROR.type;
    this.status             = info.status ? info.status : DEFAULT_ERROR.status;
    this.user_message       = info.user_message ? info.user_message : DEFAULT_ERROR.user_message;
    this.validation_errors  = info.validation_errors ? info.validation_errors : [];

  }
}

exports.assertCurrency = (value, currency) => {
  if(!value) {
    let err = new Error(`${currency} is not supported`);
    err.status = 400;
    err.user_message = err.user_message;
    err.message = err.message;

    throw err;
  }

}
