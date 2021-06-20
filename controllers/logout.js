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
const auth = require('./middleware/authentication')

//Log Out
router.get('/', auth.LoggedInOnly, function(req, res) {
    req.session.destroy(e => res.redirect('/'))
});

module.exports = router;
