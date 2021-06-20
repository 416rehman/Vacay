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
    form.preserveData, async (req, res) => {


        //Validate Requirements
        if (req.emptyFields.length) return res.render('pages/new/location', {error: `Please fill in the fields: ${req.emptyFields}`, preserved: req.preservedData});
        if (req.rejectedFiles.length) return res.render('pages/new/location', {error: `Please choose an image file`, preserved: req.preservedData});
        if (req.rejectedImageURLs.length) return res.render('pages/new/location', {error: `Please enter a valid URL`, preserved: req.preservedData})

        //Evaluate Path for the file if its a link or uploaded
        const staticAssetPath = req.files ? `/uploads/locations/${req.body.location}.${req.files.image.extension}` : req.body.imageURL

        //Prepare Schema
        const location = new locationSchema({
            location: req.body.location,
            country: req.body.country,
            image: staticAssetPath
        })

        //If uploaded, save it on storage
        if (req.files)
            await req.files.image.mv(`E:\\Seneca\\WEB\\assignment\\1\\public\\uploads\\locations\\${req.body.location}.${req.files.image.extension}`, function (err) {
                if (err) {return res.render('pages/new/location', {error: err, preserved: req.preservedData});}
            })

        //Persist
        location.save().then(()=>{
            return res.render('pages/new/location', {status: `${location.location} ${location.country} Saved Successfully.`});
        }).catch((e)=>{
            return res.render('pages/new/location', {error: `${location.location} already exists.`, preserved: req.preservedData});
        })

        //Cache
        req.app.locals.locationsCache.push(location.toJSON())
})

module.exports = router