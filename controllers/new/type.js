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

//VIEW FOR NEW TYPE
router.get('/', (req, res) => {
    res.render('pages/new/type')
})

// POST NEW TYPE
router.post('/',
    form.checkEmptyFields(["name"]),
    form.limitFileTypes(['image/png', 'image/jpeg']),
    form.populateExtensions,
    form.validateImageURLs(['imageURL']),
    form.preserveData, async (req, res) => {

    if (req.emptyFields.length) return res.render('pages/new/type', {error: `Please fill in the fields: ${req.emptyFields}`, preserved: req.preservedData});
    if (req.rejectedFiles.length) return res.render('pages/new/type', {error: `Please choose an image file`, preserved: req.preservedData});
    if (req.rejectedImageURLs.length) return res.render('pages/new/type', {error: `Please enter a valid URL`, preserved: req.preservedData})

    const staticAssetPath = req.files ? `/uploads/types/${req.body.name}.${req.files.image.extension}` : req.body.imageURL
    const propertyType = new typeSchema({
        name: req.body.name,
        image: staticAssetPath
    })
    propertyType.clean()

    if (req.files)
        await req.files.image.mv(`E:\\Seneca\\WEB\\assignment\\1\\public\\uploads\\types\\${req.body.name}.${req.files.image.extension}`, function (err) {
            if (err) {return res.render('pages/new/type', {error: err, preserved: req.preservedData});}
        })

    propertyType.save().then(()=>{
        return res.render('pages/new/type', {status: `${propertyType.name} Saved Successfully.`});
    }).catch((e)=>{
        return res.render('pages/new/type', {error: `${propertyType.name} already exists.`, preserved: req.preservedData});
    })

    req.app.locals.typesCache.push(propertyType.toJSON())
})

module.exports = router