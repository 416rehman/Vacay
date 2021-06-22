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
const {uploadToS3} = require("../middleware/AWS_S3");

//VIEW FOR NEW LISTING
router.get('/', (req, res) => {
    res.render('pages/new/listing', {locations: req.app.locals.locationsCache, types: req.app.locals.typesCache})
})

//POST NEW LISTING
router.post('/',
    form.checkEmptyFields(['type','title', 'details', 'location', 'price', 'address', 'bedrooms', 'bathrooms', ['image', 'imageURL']]),
    form.validateImageURLs(['imageURL'], ','),
    form.validateNumbers(['price', 'bedrooms', 'bathrooms']),
    form.limitFileTypes(['image/jpeg', 'image/png', 'image/jpg']),
    form.validateMinLength(['title', 'details', 'address'],[5, 10, 64]),
    form.validateMaxLength(['title', 'details', 'address'],[64, 2048, 64]),
    form.populateExtensions, form.generateS3URLsForUploads(process.env.LISTING_IMAGE_UPLOAD_BUCKET), async (req,res)=>{

        const options = {
            preserved: req.body,
            locations: req.app.locals.locationsCache,
            types: req.app.locals.typesCache
        }

        //Validate Requirements
        if (req.emptyFields.length) return res.render('pages/new/listing', {error: `Please fill in the fields: ${req.emptyFields}`, ...options});
        if (req.rejectedFiles.length) return res.render('pages/new/listing', {error: `Please choose an image file`, ...options});
        if (req.rejectedImageURLs.length) return res.render('pages/new/listing', {error: `Please enter a valid Image URL`, ...options})
        if (req.rejectedNumbers.length) return res.render('pages/new/listing', {error: `Please provide a valid number: ${req.rejectedNumbers.flat}`, ...options})
        if (req.extractedImageURLs > 5 || req.files?.image?.length > 5)  return res.render('pages/new/listing', {error: `You can upload 5 images max ${req.rejectedNumbers}`, ...options})
        if (req.overflowFields.length) return res.render('pages/new/listing', {error: `Max Char Limit reached.  ${req.overflowFields.map(f=> " " + f.field + " : " + f.maxLength)}`,...options})
        if (req.insufficientLengthFields.length) return res.render('pages/new/listing', {error: `Fields under minimum length. ${req.insufficientLengthFields.map(f=> " " + f.field + " : " + f.minLength)}`,...options})

        let images = []
        //Uploads
        if (req.files?.image)
            if (req.files.image.constructor === Array)
                req.files.image.forEach(img=>images.push(img.S3url))
            else images.push(req.files.image.S3url)

        //URLs
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
            images: images,
            author: req.session.passport.user
        })
        newListing.clean()

        await newListing.save().then(()=>{
            if (req.files?.image){
                if (req.files.image.constructor === Array)
                    for (let i = 0; i < req.files.image.length; i++){
                        let img = req.files.image[i];
                        uploadToS3(img, img.filename, process.env.LISTING_IMAGE_UPLOAD_BUCKET)
                    }
                else uploadToS3(req.files.image, req.files.image.filename, process.env.LISTING_IMAGE_UPLOAD_BUCKET)
            }
        }).catch(e=>res.render('pages/new/listing', {error: e, ...options}))

        res.redirect('/listings/'+newListing._id)
})

module.exports = router

