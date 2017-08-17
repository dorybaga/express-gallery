/*jshint esversion: 6*/
const express = require('express');
const router = express.Router();
const db = require('../models');
const Gallery = db.Gallery;

router.route('/')
  .get((req, res) => {
  Gallery.findAll()
  .then((photos) => {
    console.log('WELCOME TO THE GALLERY.');
    res.render('index', {gallery: photos});
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
    console.log('A NEW IMAGE WAS ADDED TO THE GALLERY!');
    res.redirect('/gallery');
  })
  .catch((err) => {
    console.log(err);
  });
});

router.route('/new')
  .get((req, res) => {
    res.render('new');
  });

router.route('/:id/edit')
  .get((req, res) => {
  Gallery.findById(parseInt(req.params.id))
  .then((photo) => {
    console.log('VIEWING PHOTO WITH ID#:', photo.id);
    var data = {
      id: photo.id,
      author: photo.author,
      link: photo.link,
      description: photo.description
    };
    res.render('edit', data);
  })
  .catch((err) => {
    console.log(err);
  });
})
  .put((req, res) => {
    console.log(req.body);
    Gallery.update({
      author: req.body.author,
      link: req.body.link,
      description: req.body.description
    },{
      where: {
        id: req.params.id
      }
    })
    .then((data) => {
      console.log(`PHOTO WITH ID# ${req.params.id} WAS EDITED`);
      res.redirect('/gallery');
    })
    .catch((err) => {
      console.log(err);
    });
  })
  .delete((req, res) => {
    Gallery.destroy({
      where: {
        id: req.params.id
      }
    })
    . then((data) => {
      console.log(`PHOTO WITH ID# ${req.params.id} WAS DELETED FROM DATABASE`);
      res.redirect('/gallery');
    })
    .catch((err) => {
      console.log(err);
    });
  });

router.route('/:id')
  .get((req, res) => {
    Gallery.findById(parseInt(req.params.id))
    .then((photo) => {
      console.log('VIEWING PHOTO WITH ID#:', photo.id);
      var data = {
        id: photo.id,
        author: photo.author,
        link: photo.link,
        description: photo.description
      };
      res.render('details', data);
    })
    .catch((err) => {
      console.log(err);
    });
  });

module.exports = router;