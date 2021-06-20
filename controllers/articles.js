/*** I declare that this assignment is my own work in accordance with
 * Seneca Academic Policy. No part of this assignment has been copied
 * manually or electronically from any other source (including web sites)
 * or distributed to other students. *
 *
 *      Name: Hayaturehman Ahmadzai
 *      Student ID: hahmadzai3
 *      Creation Date: 2021-06-08
 */

const express = require('express');
const router = express.Router();
const articlesSchema = require('../models/article')

router.get('/:articleID', async (req,res)=>{
    try{
        const article = await articlesSchema.findOne({_id: req.params.articleID}).populate('author').lean()
        article.date = article.date.toLocaleString()
        res.render('pages/articles/article', article)
    } catch (e) {
        res.render('pages/404', {error: e})
    }

})

router.get('/', async (req,res)=>{
    const perPage = 10, page = Math.max(1, req.query.page) || 1
    try {
        const articles = await articlesSchema.findPaginated(perPage, page,{},'-date', 'author');
        return res.render('pages/articles/articles', articles)
    }
    catch (e) {
        res.render('pages/404')
    }

})

module.exports = router