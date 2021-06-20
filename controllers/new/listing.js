/*** I declare that this assignment is my own work in accordance with
 * Seneca Academic Policy. No part of this assignment has been copied
 * manually or electronically from any other source (including web sites)
 * or distributed to other students. *
 *
 *      Name: Hayaturehman Ahmadzai
 *      Student ID: hahmadzai3
 *      Creation Date: 2021-06-08
 */
const router = require('express').Router()
const listingSchema = require('../../models/listing.js')
const fileUpload = require('express-fileupload')
const form = require('../middleware/forms.js')
const randomstring = require("randomstring")

//VIEW FOR NEW LISTING
router.get('/', (req, res) => {
    res.render('pages/new/listing', {locations: req.app.locals.locationsCache, types: req.app.locals.typesCache})
})

//POST NEW LISTING
router.post('/',
    form.preserveData,
    form.checkEmptyFields(['type','title', 'details', 'location', 'price', 'address', 'bedrooms', 'bathrooms', ['image', 'imageURL']]),
    form.validateImageURLs(['imageURL'], ','),
    form.validateNumbers(['price', 'bedrooms', 'bathrooms']),
    form.limitFileTypes(['image/jpeg', 'image/png', 'image/jpg']),
    form.populateExtensions, async (req,res)=>{

        const options = {
            preserved: req.preservedData,
            locations: req.app.locals.locationsCache,
            types: req.app.locals.typesCache
        }

        //Validate Requirements
        if (req.emptyFields.length) return res.render('pages/new/listing', {error: `Please fill in the fields: ${req.emptyFields}`, preserved: req.preservedData, ...options});
        if (req.rejectedFiles.length) return res.render('pages/new/listing', {error: `Please choose an image file`, preserved: req.preservedData, ...options});
        if (req.rejectedImageURLs.length) return res.render('pages/new/listing', {error: `Please enter a valid Image URL`, preserved: req.preservedData, ...options})
        if (req.rejectedNumbers.length) return res.render('pages/new/listing', {error: `Please provide a valid number: ${req.rejectedNumbers}`, preserved: req.preservedData, ...options})
        if (req.extractedImageURLs > 5 || req.files?.images?.length > 5)  return res.render('pages/new/listing', {error: `You can upload 5 images max: ${req.rejectedNumbers}`, preserved: req.preservedData, ...options})

        let images = []
        if (req.files) {
            for (const img of req.files.image) {
                const staticAssetPath = `/uploads/listings/${randomstring.generate({length: 10, capitalization: 'lowercase'})}.${img.extension}`
                images.push(staticAssetPath)

                await img.mv(`E:\\Seneca\\WEB\\assignment\\1\\public${staticAssetPath.replace(/\//g,'\\')}`, function (err) {
                    if (err) return res.render('pages/new/listing', {error: err.message, preserved: req.preservedData});
            })
        }}
        else if (req.extractedImageURLs) {
            req.extractedImageURLs.forEach(img=>{
                images.push(img)
            })
        }

        let newListing = new listingSchema({
            bedrooms: req.body.bedrooms,
            bathrooms: req.body.bathrooms,
            title: req.body.title,
            details: req.body.details,
            location: req.body.location,
            type: req.body.type,
            address: req.body.address,
            price: req.body.price,
            amenities: req.body.amenities,
            bedrooms: req.body.bedrooms,
            bathrooms: req.body.bathrooms,
            images: images,
            author: req.session.passport.user
        })
        newListing.clean()

        await newListing.save().catch(e=>res.render('pages/new/listing', {error: e, ...options}))

        res.render('pages/new/listing', {status: `Successfully saved listing`})
})

module.exports = router

