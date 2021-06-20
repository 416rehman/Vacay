/*** I declare that this assignment is my own work in accordance with
 * Seneca Academic Policy. No part of this assignment has been copied
 * manually or electronically from any other source (including web sites)
 * or distributed to other students. *
 *
 *      Name: Hayaturehman Ahmadzai
 *      Student ID: hahmadzai3
 *      Creation Date: 2021-06-08
 */
// TODO
const router = require('express').Router()
const listingModel = require('../models/user.js')
const userModel = require('../models/user.js')
const articleModel = require('../models/user.js')

router.get('/', (req,res)=>{
    res.redirect('/')
})
router.get('/:query/:scope?', (req,res)=>{
    res.render('search', {params: req.params.query, type: req.params.scope})
})

router.get('/', (req,res)=>{

    if (prerequisite) {
        return res.render('pages/search', {params: req.body})
    }
    else {
        res.status(400).render('pages/404', {customMessage: 'Bad Query'})
    }
})

module.exports = router