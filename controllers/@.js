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

//Profile
router.get('/@:username?',async function(req,res){
    try {
        let response = {}
        if (req.params.username) response.user = await userModel.findOne({username: req.params.username}).lean()
        else if (req.isAuthenticated()) response.user = await userModel.findById(req.session.passport.user).lean()

        //If specified posts type is articles, fetch articles, else fetch listings by default
        const perPage = 10, page = Math.max(1, req.query.page) || 1
        if (req.query.posts == 'articles') response.articles = await require('../models/article.js').findPaginated(perPage,page,{author: response.user._id}, '-date')
        else response.listings = await require('../models/listing.js').findPaginated(perPage,page,{author: response.user._id}, '-date', 'type', 'location')

        return res.render('pages/user/profile', response)
    } catch (e) {
        return res.render('pages/404')
    }
})
module.exports = router
