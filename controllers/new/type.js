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
const typeSchema = require('../../models/type.js')
const fileUpload = require('express-fileupload')
const form = require('../middleware/forms.js')
const randomstring = require('randomstring')
const {uploadToS3} = require("../middleware/AWS_S3");

//VIEW FOR NEW TYPE
router.get('/', (req, res) => {
    res.render('pages/new/type')
})

// POST NEW TYPE
router.post('/',
    form.checkEmptyFields(["name"]),
    form.limitFileTypes(['image/png', 'image/jpeg']),
    form.populateExtensions,
    form.validateImageURLs(['imageURL']), form.generateS3URLsForUploads(process.env.PROPERTY_IMAGE_UPLOAD_BUCKET), async (req, res) => {

    if (req.emptyFields.length) return res.render('pages/new/type', {error: `Please fill in the fields: ${req.emptyFields}`, preserved: req.body});
    if (req.rejectedFiles.length) return res.render('pages/new/type', {error: `Please choose an image file`, preserved: req.body});
    if (req.rejectedImageURLs.length) return res.render('pages/new/type', {error: `Please enter a valid URL`, preserved: req.body})

    let uploadPath = req.files?.image?.data ? req.files.image.S3url : req.body?.imageURL;

        const propertyType = new typeSchema({
        name: req.body.name,
        image: uploadPath
    })
    propertyType.clean()

    propertyType.save().then(()=>{
        if (req.files?.image.data) uploadToS3(req.files.image, req.files.image.filename, process.env.PROPERTY_IMAGE_UPLOAD_BUCKET);
        return res.render('pages/new/type', {status: `${propertyType.name} Saved Successfully.`});
    }).catch((e)=>{
        console.log(e)
        return res.render('pages/new/type', {error: `${propertyType.name} already exists.`, preserved: req.body});
    })

    req.app.locals.typesCache.push(propertyType.toJSON())
})

module.exports = router