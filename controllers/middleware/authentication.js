/*** I declare that this assignment is my own work in accordance with
 * Seneca Academic Policy. No part of this assignment has been copied
 * manually or electronically from any other source (including web sites)
 * or distributed to other students. *
 *
 *      Name: Hayaturehman Ahmadzai
 *      Student ID: hahmadzai3
 *      Creation Date: 2021-06-19
 */

/**
 * Only logged out users can access this
 * @param req
 * @param res
 * @param next
 * @constructor
 */
 const LoggedOutOnly = function (req, res, next) {
     if (req.isAuthenticated()) {
         return res.render('pages/404')
     }
     next()
}

/**
 * Only loggedIn users can access this
 *
 * @param req
 * @param res
 * @param next
 * @constructor
 */
const LoggedInOnly = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    return res.redirect('/login')
}

/**
 * If user is logged in, it will set res.locals.loggedIn to true
 * which is used by the handlebars main layout to show different
 * layouts depending on login state.
 *
 *
 * @param req
 * @param res
 * @param next
 * @constructor
 */
const DynamicLayout = function (req, res, next) {
    console.log(req.body)
    if (req.isAuthenticated()) res.locals.loggedIn = req.session.passport.user;

    next()
}

module.exports = {
    LoggedOutOnly,
    LoggedInOnly,
    DynamicLayout
}