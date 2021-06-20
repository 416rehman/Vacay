/*** I declare that this assignment is my own work in accordance with
 * Seneca Academic Policy. No part of this assignment has been copied
 * manually or electronically from any other source (including web sites)
 * or distributed to other students. *
 *
 *      Name: Hayaturehman Ahmadzai
 *      Student ID: hahmadzai3
 *      Creation Date: 2021-06-19
 */
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')



function setupPassport(passport) {

    const authenticateUser = async (email, password, done) => {
        try {
            const user = await User.findOne({email})
            if (user == null) return done(null, false, { message: `Wrong Email or Password`})
            else if (user.validPassword(password)) return done (null, user)
            else return done(null, false, {message: `Wrong Email or Password`})
        } catch (e) {
            return done(e)
        }
    }

    passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUser))

    passport.serializeUser((user, done) => done(null, user._id))
    passport.deserializeUser((id, done) => {
        done(null, User.findById(id))
    })
}

module.exports = setupPassport