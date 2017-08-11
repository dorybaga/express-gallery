/*jshint esversion: 6*/

const express = require('express');
const exphbs = require('express-handlebars');
const router = express.Router();
const bp = require('body-parser');
const PORT = process.env.PORT || 3000;
const db = require('./models');

const app = express();
const hbs = exphbs.create({
  extname: '.hbs',
  defaultLayout: 'main'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.use(bp.urlencoded());


router.route('/gallery')
  .get((req, res) => {
  console.log('GET req recieved');
  Gallery.findAll()
  .then((gallery) => {
    console.log("this is the gallery: ", gallery);
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




const server = app.listen(PORT, () => {
  db.sequelize.sync();
  console.log(`server running on ${PORT}`);
});