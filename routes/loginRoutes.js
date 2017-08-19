/*jshint esversion: 6*/
const express = require('express');
const router = express.Router();
const passport = require('passport');
const galleryRoute = require('../routes/galleryRoutes.js');


router.route('/')
  .get((req, res) => {
    res.render('login');
  })
  .post(passport.authenticate('local', {
    successRedirect: '/gallery',
    failRedirect: '/login'
  }));

module.exports = router;