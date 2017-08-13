/*jshint esversion: 6*/

const express = require('express');
const exphbs = require('express-handlebars');
const bp = require('body-parser');
const PORT = process.env.PORT || 3000;
const db = require('./models');
const imgRoute = require('./routes/routes.js');
const methodOverride = require('method-override');


const app = express();
const hbs = exphbs.create({
  extname: '.hbs',
  defaultLayout: 'main'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.use(express.static('public'));
app.use(bp.urlencoded());
app.use(bp.json());


app.use(methodOverride('X-HTTP-Method-Override'));
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

app.use('/gallery', imgRoute);

const server = app.listen(PORT, () => {
  db.sequelize.sync();
  console.log(`server running on ${PORT}`);
});
