'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE
const knex = require('../knex');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { camelizeKeys, decamelizeKeys } = require('humps');
const bcrypt = require('bcrypt-as-promised');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

router.use(cookieParser());

router.post('/users', (req, res, next) => {

  const password = req.body.password;

  if(!req.body.email) {
    res.set('Content-Type', 'text/plain');
    res.status(400).send('Email must not be blank');
  }
  else if (!password || password.length < 8) {
    res.set('Content-Type', 'text/plain');
    res.status(400).send('Password must be at least 8 characters long');
  }
  else {

    knex('users')
      .where('email', req.body.email)
      .first()
      .then((user) => {
        if(user) {
          res.set('Content-Type', 'text/plain');
          res.status(400).send('Email already exists');
        }
        else {
          bcrypt.hash(password, 12)
            .then((hashed_password) => {
              return knex('users')
                .insert({
                  first_name: req.body.firstName,
                  last_name: req.body.lastName,
                  email: req.body.email,
                  hashed_password: hashed_password
                }, '*')
            })
            .then((users) => {
              const user = users[0];

              const claim = { userId: user.id };
              const token = jwt.sign(claim, process.env.JWT_KEY, {
                expiresIn: '7 days'
              });
              res.cookie('token', token, {
                httpOnly: true,
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                secure: router.get('env') === 'test'
              });

              delete user.hashed_password;
              res.send(camelizeKeys(user));
            })
            .catch((err) => {
              res.set('Content-Type', 'text/plain');
              res.status(400).send('Invalid Email or password');
            });
        }
      });
  }

});


module.exports = router;
