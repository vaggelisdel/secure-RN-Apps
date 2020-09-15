var express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
const bcrypt = require('bcrypt');
const saltRounds = 10;
var User = require("./../models/user");
var App = require("./../models/app");

router.get('/login', skipRoutes, function (req, res, next) {
  res.render('login', {title: 'Σύνδεση', msg: req.flash('credentialsError')});
});

router.post('/login', function (req, res, next) {
  User.findOne({email: req.body.email}, function (err, user) {
    if (err) throw err;
    if (user) {
      bcrypt.compare(req.body.password, user.password, async function (err, result) {
        if (result === true) {
          req.session.authUser = true;
          req.session.UserEmail = user.email;
          req.session.UserID = user._id;
          res.redirect("/");  //Success Login
        } else {
          req.flash('credentialsError', 'Λάθος στοιχεία. Προσπαθήστε πάλι!');
          res.redirect("/credentials/login");    //Wrong Credentials
        }
      });
    } else {
      req.flash('credentialsError', 'Ο χρήστης δεν βρέθηκε.');
      res.redirect("/credentials/login");    //User not found
    }
  });
});

router.get('/logout', function (req, res, next) {
  res.redirect("/credentials/login");
  req.session.destroy();
});

function skipRoutes(req, res, next) {

  if (req.session.authUser) {
    res.redirect('/');
  } else {
    next();
  }
}

module.exports = router;
