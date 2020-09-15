var express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
var App = require("./../models/app");

router.get('/', isAuthenticated, async function (req, res, next) {
    const totalApps = await App.find({}).countDocuments().exec();
    res.render('dashboard', {layout: 'Layouts/layout.hbs', title: 'My Apps', totalApps: totalApps});
});

router.get('/addApp', isAuthenticated, async function (req, res, next) {
    res.render('addApp', {layout: 'Layouts/layout.hbs', title: 'Create App'});
});

router.post('/addApp', function (req, res, next) {
    console.log(req.body.appName);
    console.log(req.body.userId);
    var newApp = new App({
        name: req.body.appName,
        userId: req.body.userId,
    });
    newApp.save(function (err) {
        if (err) throw err;
        res.redirect('/allApps')
    });
});

router.get('/allApps', isAuthenticated, async function (req, res, next) {
    var apps = await App.find({userId: req.session.UserID}).exec()
    res.render('allApps', {layout: 'Layouts/layout.hbs', title: 'All Apps', allApps: apps});
});

router.get('/enableApp/:id', isAuthenticated, function (req, res, next) {
    var id = req.params.id;
    App.findOne({_id: new ObjectId(id)}, function (err, dm) {
        var query = {_id: new ObjectId(id)};
        var update = {
            $set: {
                active: true,
                message: ""
            }
        };
        App.updateMany(query, update, function (err, result) {
            if (err) {
                console.log("update document error");
            } else {
                res.redirect('/allApps');
            }
        });
    });
});
router.get('/disableApp/:id/:message', isAuthenticated, function (req, res, next) {
    var id = req.params.id;
    var message = req.params.message;
    console.log(id, message);
    App.findOne({_id: new ObjectId(id)}, function (err, dm) {
        var query = {_id: new ObjectId(id)};
        var update = {
            $set: {
                active: false,
                message: message
            }
        };
        App.updateMany(query, update, function (err, result) {
            if (err) {
                console.log("update document error");
            } else {
                res.redirect('/allApps');
            }
        });
    });
});

router.get('/securityAccess/:app', protect, function (req, res, next) {
    var app = req.params.app;
    App.findOne({name: app}, function (err, data) {
        if (data.active) {
            res.status(200).send({});
        } else {
            res.status(403).send({msg: data.message});
        }
    });
});

function isAuthenticated(req, res, next) {
    if (req.session.authUser) {
        next();
    } else {
        res.redirect('/credentials/login');
    }
}
function protect(req, res, next) {
    if (req.headers.apikey === "b5e4a03c-25d1-4d79-b089-2bcf8e7e08d8") {
        next();
    } else {
        res.status(401).send();  //unauthorized
    }
}

module.exports = router;
