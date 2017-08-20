/*jshint esversion: 6*/

const express = require('express');
const exphbs = require('express-handlebars');
const bp = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const RedisStore = require('connect-redis')(session);
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

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
  function (username, password, done) {
            // ^ client side username and password
    console.log('client-side-username', username);
    console.log('client-side-password', password);
    User.findOne({
      where: {
        username: username
      }
    }).then ((user) => {
      console.log('User exists in DB');
      // password === comes from the client POST request (user input)
      // user.password === hash

      bcrypt.compare(password, user.password)
        .then(result => {
          if(result){
            console.log('username and password correct!');
            return done(null, user);
          } else {
            console.log('password does not match');
            return done(null, false, { message: 'incorrect password' });
          }
        }).catch(err => {
          console.log(err);
        });

      // move on to the password
    }).catch((err) => {
      console.log('Username not found');
      console.log(err);
      return done(null, false, {message: 'Incorrect Username'});
    });
  }
));

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
