/*** I declare that this assignment is my own work in accordance with
 * Seneca Academic Policy. No part of this assignment has been copied
 * manually or electronically from any other source (including web sites)
 * or distributed to other students. *
 *
 *      Name: Hayaturehman Ahmadzai
 *      Student ID: hahmadzai3
 *      Creation Date: 2021-06-08
 */


const express = require('express');
const router = express.Router();
const form = require('./middleware/forms.js')
const auth = require('./middleware/authentication.js')
const fileUpload = require('express-fileupload')
const User = require('../models/user.js')
// BASIC LIMITS

// Field          MIN     MAX
// 'username'     4       15
// 'name'         2       64
// 'email'        6       320
// 'password'     8       128

module.exports = function(passport) {
    let router = express.Router();

    router.get('/', auth.LoggedOutOnly,function(req, res) {
        res.render('pages/user/login');
    });

    router.post('/',
        auth.LoggedOutOnly,
        fileUpload(),
        form.preserveData,
        form.checkEmptyFields(['email', 'password']),
        form.validateEmail(['email']),
        form.validateMaxLength(['email', 'password'], [320, 128]),
        form.validateMinLength(['email', 'password'], [6, 4]),
        function(req, res, next) {

            if (req.emptyFields?.length) return res.render('pages/user/login', {error: `Please fill the following fields: ${req.emptyFields}`,preserved: req.preservedData})
            if (req.rejectedEmailFields?.length) return res.render('pages/user/login', {error: `Please enter a valid email`, preserved: req.preservedData});
            if (req.overflowFields?.length) return res.render('pages/user/login', {error: `Max limit for ${req.overflowFields[0].key} is ${req.overflowFields[0].maxLength}.`, preserved: req.preservedData});
            if (req.insufficientLengthFields?.length) return res.render('pages/user/login', {error: `Min limit for ${req.insufficientLengthFields[0].key} is ${req.insufficientLengthFields[0].minLength}.`, preserved: req.preservedData});

            passport.authenticate('local', function(err, user, info) {
                if (err) return res.render('pages/user/login', {error: info?.message || `Login Failed`, preserved: req.preservedData});
                if (!user) return res.render('pages/user/login', {error: info?.message || `Login Failed`, preserved: req.preservedData});

                req.logIn(user, function(err) {
                    if (err) return res.render('pages/user/login', {error: info?.message || `Login Failed`, preserved: req.preservedData});
                    return res.redirect('/@' + user.username);
                });
            })(req, res, next);
        });

    return router;

    //
    // User.findOne({email: req.body.email}, (e, user) => {
    //     if (user === null)
    //
    //     if (user.validPassword(req.body.password)) return res.render('pages/user/login', {status: `Login successful`, preserved: req.preservedData})
    //     else res.render('pages/user/login', {error: `Wrong Email or Password`, preserved: req.preservedData})
    // })
}




