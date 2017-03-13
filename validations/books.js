'use strict';

const joi = require('joi');

module.exports.post = {
  body: {
    title: joi.string()
      .label('Title')
      .required()
      .trim(),

    author: joi.string()
      .label('Author')
      .required()
      .trim(),

    genre: joi.string()
      .label('Genre')
      .required()
      .trim(),

    description: joi.string()
      .label('Description')
      .required()
      .trim(),

    coverUrl: joi.string()
      .label('Cover URL')
      .required()
      .trim()
  }
};
