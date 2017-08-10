/*jshint esversion: 6*/

const express = require('express');
const exphbs = require('express-handlebars');
const router = express.Router();
const bp = require('body-parser');
const PORT = process.env.PORT || 3000;
const db = require('./models');

const app = express();


const server = app.listen(PORT, () => {
  db.sequelize.sync();
  console.log(`server running on ${PORT}`);
});