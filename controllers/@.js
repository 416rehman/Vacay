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
const userModel = require('../models/user.js')
const {calculateRating} = require('../models/plugins/calculateAverageRating.js')
const auth = require('./middleware/authentication')
const form = require('./middleware/forms')
const {uploadToS3} = require("./middleware/AWS_S3");

//Profile
router.get('/@:username?',async function(req,res){
    try {
        let response = {}
        if (req.params.username) response.user = await userModel.findOne({username: req.params.username}).lean()
        else if (req.isAuthenticated()) response.user = await userModel.findById(req.session.passport.user).lean()

        //If specified posts type is articles, fetch articles, else fetch listings by default
        const perPage = 10, page = Math.max(1, req.query.page) || 1
        if (req.query.posts == 'articles') response.articles = await require('../models/article.js').findPaginated(perPage,page,{author: response.user._id}, '-date')
        else {
            response.listings = await require('../models/listing.js').findPaginated(perPage,page,{author: response.user._id}, '-date', 'type', 'location')
            for (let obj of response.listings.results)
                obj.rating = calculateRating(obj)
        }

        return res.render('pages/user/profile', response)
    } catch (e) {
        return res.render('pages/404')
    }
})

// BASIC LIMITS

// Field          MIN     MAX
// 'username'     4       15
// 'name'         2       64
// 'bio'                  256

router.post('/@',auth.LoggedInOnly,
    form.validateMinLength(['name'],[2]),
    form.validateMaxLength(['name', 'bio'],[64, 256]),
    form.populateExtensions,
    form.generateS3URLsForUploads(process.env.USER_AVATAR_UPLOAD_BUCKET,),
    form.limitFileTypes(['image/jpeg', 'image/png', 'image/jpg'])
    , async function (req,res){
    console.log(req.body)
    if (req.insufficientLengthFields.length) return res.render('pages/404', {error: `Name must be longer than 2 chars`})
    if (req.overflowFields.length) return res.render('pages/404', {error: `Max lengths - Name: 64 chars, Bio: 256 chars`})
    if (req.rejectedFiles.length) return res.render('pages/404', {error: `Please choose an image file`})

        try {
            console.log(req.session.passport.user)
            await userModel.findByIdAndUpdate(req.session.passport.user, {
                name: req.body.name,
                bio: req.body.bio,
                avatar: req.files?.avatar?.S3url
            })
            console.log(req.files)
            if (req.files?.avatar) uploadToS3(req.files.avatar, req.files.avatar.filename, process.env.USER_AVATAR_UPLOAD_BUCKET)
            return res.redirect('/@')
        }
    catch (e) {
        console.log(e)
        return res.render('pages/404', {error: e})
    }
})

module.exports = router
