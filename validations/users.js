'use strict';

const joi = require('joi');

module.exports.post = {
  body: {
    email: joi.string()
      .label('Email')
      .required()
      .email()
      .trim(),

    password: joi.string()
      .label('Password')
      .required()
      .trim()
      .min(6)
  }
};
