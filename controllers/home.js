/*** I declare that this assignment is my own work in accordance with
 * Seneca Academic Policy. No part of this assignment has been copied
 * manually or electronically from any other source (including web sites)
 * or distributed to other students. *
 *
 *      Name: Hayaturehman Ahmadzai
 *      Student ID: hahmadzai3
 *      Creation Date: 2021-06-08
 */

const router = require('express').Router();
const listingSchema = require('../models/listing.js')
const articleSchema = require('../models/article.js')

router.get('/', async (req,res)=>{
    const propertyTypes = req.app.locals.typesCache
    const popularLocations = req.app.locals.locationsCache.slice(0, 6)
    const articles = await articleSchema.find().populate('author').limit(10).lean()
    let featuredListings = await listingSchema.find()
                            .populate('location')
                            .populate('type')
                            .sort({average: -1})
                            .limit(5).lean()

    articles.forEach(a => a.date = a.date.toLocaleString())

    for (let t of propertyTypes) {
        const count = await listingSchema.size({type: t._id})
        t.text = `${count} ${t.name}`
    }

    for (let l of popularLocations) {
        l.title = `${l.location}, ${l.country}`
        const count = await listingSchema.size({location: l._id})
        if(count) l.subtitle = `${count} Properties`
        const cheapest = await listingSchema.findCheapest({location: l._id})
        if (cheapest) l.tags = [{label: 'From', content: `$${cheapest.price}`}]
    }

    res.render('pages/home', {
        // featuredLocations: featuredLocations,
        currency: "C$",
        propertyTypes: propertyTypes,
        locationTypes: popularLocations,
        articles: articles,
        featuredListings
        })
})

module.exports = router