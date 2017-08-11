/*jshint esversion: 6*/
const express = require('express');
const router = express.Router();
const db = require('../models');
const Gallery = db.Gallery;

router.route('/gallery')
  .get((req, res) => {
  console.log('GET req recieved');
  Gallery.findAll()
  .then((gallery) => {
    console.log('Welcome to the gallery.');
    res.render('index', {gallery: gallery});
  })
  .catch((err) => {
    console.log(err);
  });
})
  .post((req, res) => {
    Gallery.create({
      author: req.body.author,
      link: req.body.link,
      description: req.body.description
  })
  .then((data) => {
    console.log(data);
    console.log('New image added to gallery!');
    res.end();
  })
  .catch((err) => {
    console.log(err);
  });
});

// router.route('/gallery/:id')
//   // should render img with specified id ** GET
//   .get((req, res) => {

//   })

//   // should have link to edit ** PUT
//   .put((req, res) => {

//   })

//   // should have link to delete ** DELETE
//   .delete((req, res) => {

//   });




module.exports = router;