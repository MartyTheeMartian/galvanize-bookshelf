'use strict';

const express = require('express');


// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE
const knex = require('../knex');
const bodyParser = require('body-parser');
const { camelizeKeys, decamelizeKeys } = require('humps');

router.get('/books', (req, res, next) => {
  knex('books')
    .orderBy('title')
    .then((books) => {
      res.send(camelizeKeys(books));
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/books/:id', (req, res, next) => {
  knex('books')
    .where('id', req.params.id)
    .first()
    .then((book) => {
      if (!book) {
        next();
      }
      res.send(camelizeKeys(book));
    })
    .catch((err) => {
      next();
    });
});

router.post('/books', (req, res, next) => {
  if(!req.body.title) {
    res.set('Content-Type', 'text/plain');
    res.status(400).send('Title must not be blank');
  }
  else if (!req.body.author) {
    res.set('Content-Type', 'text/plain');
    res.status(400).send('Author must not be blank');
  }
  else if (!req.body.genre) {
    res.set('Content-Type', 'text/plain');
    res.status(400).send('Genre must not be blank');
  }
  else if (!req.body.description) {
    res.set('Content-Type', 'text/plain');
    res.status(400).send('Description must not be blank');
  }
  else if (!req.body.coverUrl) {
    res.set('Content-Type', 'text/plain');
    res.status(400).send('Cover URL must not be blank');
  }
  else {
    knex('books')
      .insert({
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        description: req.body.description,
        cover_url: req.body.coverUrl
      },'*')
      .then((book) => {
        res.send(camelizeKeys(book[0]));
      })
      .catch((err) => {
        next(err);
      });
  }

});

router.patch('/books/:id', (req, res, next) => {
  knex('books')
    .where('id', req.params.id)
    .then((book) => {
      return knex('books')
        .update({
          title: req.body.title,
          author: req.body.author,
          genre: req.body.genre,
          description: req.body.description,
          cover_url: req.body.coverUrl
        }, '*')
        .where('id', req.params.id);
    })
    .then((books) => {
      res.send(camelizeKeys(books[0]));
    })
    .catch((err) => {
      next();
    });
});

router.delete('/books/:id', (req, res, next) => {
  let book;

  knex('books')
    .where('id', req.params.id)
    .first()
    .then((row) => {
      book = row;
      return knex('books')
        .del()
        .where('id', req.params.id);
    })
    .then(() => {
      delete book.id;
      res.send(camelizeKeys(book));
    })
    .catch((err) => {
      next();
    });
});

router.use('/books', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.status(404).send('Not Found');
});

module.exports = router;
