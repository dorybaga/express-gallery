/*jshint esversion: 6*/

const express = require('express');
const exphbs = require('express-handlebars');
const bp = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const RedisStore = require('connect-redis')(session);
const LocalStrategy = require('passport-local').Strategy;
// const bcrypt = require('bcrypt');

const PORT = process.env.PORT || 3000;
const CONFIG = require('./config/config.json');

const db = require('./models');
const User = db.User;
const galleryRoute = require('./routes/galleryRoutes.js');
const loginRoute = require('./routes/loginRoutes.js');

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

const saltRound = 10;

app.use(session({

  store: new RedisStore(),
  secret: CONFIG.SESSION_SECRET,
  cookie: {
    maxAge: 1000000
  },
  saveUninitialized: true

}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log('checking username', username);
    console.log('checking password', password);
    User.findOne({
       where : {
          username : username
        }
      }).then((user) => {
      console.log('This is the user', user);
      if (user.password === password) {
        console.log('username and password successful');
        return done(null, user);
      } else {
       console.log('password was incorrect');
       return done(null, false, { message: 'incorrect password' });
      }}).catch((err) => {
       console.log('username not found');
       console.log(err);
      return done(null, false, { message: 'incorrect username' });
    });
  }));

passport.serializeUser(function(user, done) {
  console.log('serializing the user into session');
  done(null, user.id);
});

passport.deserializeUser(function(userId, done) {
  console.log('adding user information into the req object');
  User.findOne({
    where :{
      id: userId
    }
  }).then((user) => {
    return done(null, {
      id: user.id,
      username: user.username
    });
  }).catch((err) => {
    done(err, user);
  });
});

app.use(methodOverride('X-HTTP-Method-Override'));
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

app.use('/login', loginRoute);
app.use('/gallery', galleryRoute);

const server = app.listen(PORT, () => {
  db.sequelize.sync();
  console.log(`server running on ${PORT}`);
});
