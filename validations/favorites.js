'use strict';

const joi = require('joi');

module.exports.post = {
  body: {
    bookId: joi.number()
      .label('Book Id')
      .required()
      .integer()
  }
};
