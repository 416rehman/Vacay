/*** I declare that this assignment is my own work in accordance with
 * Seneca Academic Policy. No part of this assignment has been copied
 * manually or electronically from any other source (including web sites)
 * or distributed to other students. *
 *
 *      Name: Hayaturehman Ahmadzai
 *      Student ID: hahmadzai3
 *      Creation Date: 2021-06-08
 */
const listingModel = require('../models/listing.js')
const express = require('express');
const router = express.Router();
const {calculateRating} = require('../models/plugins/calculateAverageRating.js')
router.get('/:listingID', async (req,res)=>{
    try {
        let listing = await listingModel.findOne({_id: `${req.params.listingID}`}).populate('author').populate('location').populate('type').lean()
        calculateRating(listing)
        listing.date = listing.date.toLocaleString()
        res.render('pages/listings/details', listing)
    }
    catch (e){
        res.render('pages/404', {error: e})
    }
})

router.get('/', async (req,res)=>{
    const filters = {}
    if(req.query.type) filters.type = req.query.type
    if (req.query.location) filters.location = req.query.location
    if (req.query.author) filters.author = req.query.author

    const perPage = 10, page = Math.max(1, req.query.page) || 1
    try {
        const listings = await listingModel.findPaginated(perPage, page,filters,'-date','author','location', 'type');
        for (let listing of listings.results){
            calculateRating(listing)
        }
        return res.render('pages/listings/listings', listings)
    }
    catch (e) {
        res.render('pages/404', {error: e.message})
    }
})

module.exports = router