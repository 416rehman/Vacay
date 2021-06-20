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
const userSchema = require('../models/user.js')
const form = require('./middleware/forms.js')
const auth = require('./middleware/authentication')
const fileUpload = require('express-fileupload')
const sgMail = require('@sendgrid/mail')

// BASIC LIMITS

// Field          MIN     MAX
// 'username'     4       15
// 'name'         2       64
// 'email'        6       320
// 'password'     8       128


router.get('/',auth.LoggedOutOnly, function(req, res) {
    res.render('pages/user/signup');
});


router.post('/',
    auth.LoggedOutOnly,
    form.checkEmptyFields(['username', 'name', 'email', 'password']),
    form.validateNoSpecialCharacters(['username']),
    form.validateEmail(['email']),
    form.validateMaxLength(['username', 'name', 'email', 'password'], [15, 64, 320, 128]),
    form.validateMinLength(['username', 'name', 'email', 'password'], [4, 2, 6, 8]), async (req, res) => {

        if(req.emptyFields.length) return res.render('pages/user/signup', {error: `Please fill the following fields: ${req.emptyFields}`})
        if(req.rejectedSpecialCharFields.length) return res.render('pages/user/signup', {error: `Usernames can only contain the following special characters: - _ .`, preserved:req.body})
        if(req.rejectedEmailFields.length) return res.render('pages/user/signup', {error: `Please enter a valid email`, preserved:req.body})
        if (req.overflowFields?.length) return res.render('pages/user/signup', {error: `Max limit for ${req.overflowFields[0].key} is ${req.overflowFields[0].maxLength}.`, preserved: req.body});
        if (req.insufficientLengthFields?.length) return res.render('pages/user/signup', {error: `Min limit for ${req.insufficientLengthFields[0].key} is ${req.insufficientLengthFields[0].minLength}.`, preserved: req.body});

        const exists = await userSchema.exists({$or: [{email: req.body.email}, {username: req.body.username}]})
        if (exists) return res.render('pages/user/signup', {error: `A user with the provided info already exists`});

        const newUser = new userSchema({
                username: req.body.username,
                email: req.body.email,
                name: req.body.name,
        });
        newUser.setPassword(req.body.password);

        sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        const msg = {
                to: req.body.email, // Change to your recipient
                from: 'vacay@ahmadz.ai', // Change to your verified sender
                subject: 'Welcome to Vacay',
                text: 'Your account has been successfully created!',
        }
        sgMail.send(msg).then(() => console.log('Email sent'))
                    .catch((error) => console.error(error))

        //Add user to mongoDB then login using passport
        newUser.save().then(e=>{
                if (e) return res.render('pages/404' , {error: e})
                req.login(user, e=>{
                        if (e) return res.render('pages/404' , {error: e})
                        res.redirect(`/@${req.body.username}`)
                })
        }).catch(e=>res.render('pages/404' , {error: e}))
});

module.exports = router;
