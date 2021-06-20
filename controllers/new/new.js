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

//Nested Router for Articles
router.use('/article', require('./article'))

//Nested Router for Listings
router.use('/listing', require('./listing'))

//Nested Router for Locations
router.use('/location', require('./location'))

//Nested Router for Types
router.use('/type', require('./type'))

//Nested Router for Main page of NEW
router.use('/', (req, res) => {
    res.render('pages/new/new')
})



module.exports = router