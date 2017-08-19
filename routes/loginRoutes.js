/*jshint esversion: 6*/
const express = require('express');
const router = express.Router();
const passport = require('passport');
const galleryRoute = require('../routes/galleryRoutes.js');

const db = require('../models');
const User = db.User;


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
    User.create({
      username: req.body.username,
      password: req.body.password
    })
    .then(() => {
      console.log('INSERTED NEW USER!');
      res.redirect('/gallery');
    })
    .catch(err => {
      console.log(err);
    });
  });

module.exports = router;