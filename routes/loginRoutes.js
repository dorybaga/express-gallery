/*jshint esversion: 6*/
const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');

const galleryRoute = require('../routes/galleryRoutes.js');

const db = require('../models');
const User = db.User;
const saltRound = 10;


router.route('/')
  .get((req, res) => {
    res.render('login');
  })
  .post(passport.authenticate('local', {
    successRedirect: '/gallery',
    failRedirect: '/login'
  }));

router.route('/new')
  .get((req, res) => {
    res.render('new-login');
  })
  .post((req, res) => {
    console.log('NEW USERNAME: ', req.body.username);
    console.log('NEW PASSWORD: ', req.body.password);
    bcrypt.genSalt(saltRound)
    .then(salt => {
      bcrypt.hash(req.body.password, salt)
      .then(hash => {
        console.log('HASHHHHHH', hash);

        User.create({
          username: req.body.username,
          password: hash
        }).then(() => {
          console.log(('INSERTED NEW USER!!'));
          res.redirect('/gallery');
        }).catch(err => {
          console.log(err);
        });
      });
    }).catch(err => {
      console.log(err);
    });
  });

module.exports = router;