'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE
const knex = require('../knex');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { camelizeKeys, decamelizeKeys } = require('humps');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
let tokenId;

router.use('/favorites', (req, res, next) => {
  jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, payload) => {
    if (err) {
      res.set('Content-Type', 'text/plain');
      res.status(401).send('Unauthorized');
    }
    else {
      tokenId = payload.userId;
      next();
    }
  });
});

router.get('/favorites', (req, res, next) => {
  knex('favorites')
    .join('books', 'favorites.id', '=', 'books.id')
    .then((favorites) => {
      res.send(camelizeKeys(favorites));
    })
    .catch((err) => {
      next();
    });
});

router.get('/favorites/check/', (req, res, next) => {
  knex('favorites')
    .where('id', req.query['bookId'])
    .first()
    .then((favorite) => {
      if (!favorite){
        res.send(false);
      }
      else {
        res.send(true);
      }
    })
    .catch((err) => {
      res.set('Content-Type', 'text/plain');
      res.status(400).send('Book ID must be an integer');
    });
});

router.post('/favorites', (req, res, next) => {

  let bookInt = req.body.bookId % 1 === 0;

  if(!bookInt) {
    res.set('Content-Type', 'text/plain');
    res.status(400).send('Book ID must be an integer');
  }
  else {
    knex('favorites')
      .insert({
        book_id: req.body.bookId,
        user_id: tokenId
      },'*')
      .then((favorite) => {
        res.send(camelizeKeys(favorite[0]));
      })
      .catch((err) => {
        res.set('Content-Type', 'text/plain');
        res.status(404).send('Book not found');
      });
  }

});

router.delete('/favorites', (req, res, next) => {

  let bookInt = req.body.bookId % 1 === 0;

  if(!bookInt) {
    res.set('Content-Type', 'text/plain');
    res.status(400).send('Book ID must be an integer');
  }
  else {
    knex('favorites')
      .where('book_id', req.body.bookId)
      .first()
      .then((favorite) => {
        if(favorite) {
          let fav = favorite;
          knex('favorites')
            .where('book_id', req.body.bookId)
            .del()
          return fav;
        }
      })
      .then((fav) => {
        delete fav.id;
        res.send(camelizeKeys(fav));
      })
      .catch((err) => {
        res.set('Content-Type', 'text/plain');
        res.status(404).send('Favorite not found');
      });
  }

});

module.exports = router;
