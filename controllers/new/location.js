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
const locationSchema = require('../../models/location.js')
const fileUpload = require('express-fileupload')
const form = require('../middleware/forms.js')
const {uploadToS3} = require("../middleware/AWS_S3");


//VIEW FOR NEW LOCATION
router.get('/', (req, res) => {
    res.render('pages/new/location')
})

//POST NEW LOCATION (form is my own custom server-side form validation middleware I did for this project)
router.post('/',
    form.checkEmptyFields(["country", "location", ['imageURL', 'image']]),
    form.limitFileTypes(['image/png', 'image/jpeg']),
    form.populateExtensions,
    form.validateImageURLs(['imageURL']),
    form.generateS3URLsForUploads(process.env.LOCATION_IMAGE_UPLOAD_BUCKET), async (req, res) => {


        //Validate Requirements
        if (req.emptyFields.length) return res.render('pages/new/location', {error: `Please fill in the fields: ${req.emptyFields}`, preserved: req.body});
        if (req.rejectedFiles.length) return res.render('pages/new/location', {error: `Please choose an image file`, preserved: req.body});
        if (req.rejectedImageURLs.length) return res.render('pages/new/location', {error: `Please enter a valid URL`, preserved: req.body})

        //Prepare Schema
        const location = new locationSchema({
            location: req.body.location,
            country: req.body.country,
            image: req.files?.image?.data ? req.files.image.S3url : req.body?.imageURL
        })

        //Persist
        location.save().then(()=>{
            if (req.files?.image) uploadToS3(req.files.image, req.files.image.filename, process.env.LOCATION_IMAGE_UPLOAD_BUCKET)
            return res.render('pages/new/location', {status: `${location.location} ${location.country} Saved Successfully.`});
        }).catch((e)=>{
            return res.render('pages/new/location', {error: `${location.location} already exists.`, preserved: req.body});
        })

        //Cache
        req.app.locals.locationsCache.push(location.toJSON())
})

module.exports = router