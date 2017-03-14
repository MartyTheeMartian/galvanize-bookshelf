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

router.use('/token', (req, res, next) => {
  if (req.cookies.token) {
    jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, payload) => {
      if (err) {
        res.set('Content-Type', 'text/plain');
        res.status(401).send('Unauthorized');
      }
      else {
        next();
      }
    });
  }
  else {
    next();
  }
});

router.get('/token', (req, res, next) => {
  if (req.cookies.token) {
    res.send(true);
  }
  else {
    res.send(false);
  }
});

router.post('/token', (req, res, next) => {

  let user;

  if(!req.body.email) {
    res.set('Content-Type', 'text/plain');
    res.status(400).send('Email must not be blank');
  }
  else if (!req.body.password) {
    res.set('Content-Type', 'text/plain');
    res.status(400).send('Password must not be blank');
  }
  else {
    return knex('users')
      .where({
        email: req.body.email
      })
      .first()
      .then((userResult) => {
        user = userResult;
        return bcrypt.compare(req.body.password, user.hashed_password);
      })
      .then((match) => {
        if(match) {
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
        }
      })
      .catch((err) => {
        res.set('Content-Type', 'text/plain');
        res.status(400).send('Bad email or password');
      });
  }

});

router.delete('/token', (req, res, next) => {

  res.clearCookie('token', { path: '/token' });
  res.send(true);

});

module.exports = router;
