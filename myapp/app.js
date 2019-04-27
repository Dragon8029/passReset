var express       = require('express');
var mongoose      = require('mongoose');
var nodemailer    = require('nodemailer');
var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt        = require('bcrypt-nodejs');
var async         = require('async');
var crypto        = require('crypto');
var path          = require('path');
var favicon       = require('static-favicon');
var logger        = require('morgan');
var cookieParser  = require('cookie-parser');
var session       = require('express-session');
var bodyParser    = require('body-parser');

passport.use(new LocalStrategy(function(username, password, done){
  User.findOne({ username: username }, function(err, user) {
    if (err) return done(err);
    if(!user) return done(null, false, { message: 'Incorrect username.' });
    user.comparePassword(password, function(err, isMatch) {
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect password.'});
      }
    });
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

var userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true }, 
  password: { type: String, required: true }, 
  resetPasswordToken: String,
  resetPasswordExpires: Date  
});

userSchema.pre('save', function(next) {
  var user = this;
  var SALT_FACTOR = 5;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if(err) return next(err);

    bcrypt.hash(user.password, salt, null, function(err, hash){
      if(err) return next(err);
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

var User = mongoose.model('User', userSchema);

mongoose.connect('localhost', {useNewUrlParser: True });

var app = express();

// Middleware
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({ secret: 'session secret key', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', function(req, res) {
  res.render('index', { 
  title: 'Express',
  user: req.user
 });
});

app.get('/login', function(req, res) {
  res.render('login', {
    user: req.user
  });
});

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

