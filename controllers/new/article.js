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
const articleSchema = require('../../models/article.js')
const fileUpload = require('express-fileupload')
const form = require('../middleware/forms.js')
const randomstring = require('randomstring')
const {uploadToS3} = require("../middleware/AWS_S3");

//VIEW FOR NEW ARTICLE
router.get('/', (req, res) => {
    res.render('pages/new/article')
})
//POST NEW ARTICLE
router.post('/',
    form.checkEmptyFields(["title", "content"]),
    form.limitFileTypes(['image/png', 'image/jpeg']),
    form.validateImageURLs(['imageURL']),
    form.populateExtensions,
    form.generateS3URLsForUploads(process.env.ARTICLE_IMAGE_UPLOAD_BUCKET), async (req, res) => {

    if (req.emptyFields.length) return res.render('pages/new/article', {error: `Please fill in the fields: ${req.emptyFields}`, preserved: req.body});
    if (req.rejectedFiles.length) return res.render('pages/new/article', {error: `Please choose an image file`, preserved: req.body});
    if (req.rejectedImageURLs.length) return res.render('pages/new/article', {error: `Please enter a valid image URL`, preserved: req.body})

        let newArticle = new articleSchema({
        author: req.session.passport.user,
        title: req.body.title,
        content: req.body.content,
        excerpt: req.body.excerpt,
        image: req.files?.image?.data ? req.files.image.S3url : req.body?.imageURL
    })
    newArticle.clean()

    await newArticle.save().then(()=>{
        if (req.files?.image) uploadToS3(req.files.image, req.files.image.filename, process.env.ARTICLE_IMAGE_UPLOAD_BUCKET)
    }).catch(e=>res.render('pages/new/article', {error: e.message, preserved: req.body}))

    return res.redirect('/articles/'+newArticle._id)
})

module.exports = router