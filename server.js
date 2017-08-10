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

app.get('/', (req, res) => {
  console.log('show gallery of imgs');
  res.render('/'); // <---- takes obj as 2nd arg, { what goes here??? }

});

router.route('/gallery/:id')
  // should render img with specified id ** GET
  .get((req, res) => {

  })

  // should have link to edit ** PUT
  .put((req, res) => {

  })

  // should have link to delete ** DELETE
  .delete((req, res) => {

  });

const server = app.listen(PORT, () => {
  db.sequelize.sync();
  console.log(`server running on ${PORT}`);
});