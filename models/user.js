/*** I declare that this assignment is my own work in accordance with
 * Seneca Academic Policy. No part of this assignment has been copied
 * manually or electronically from any other source (including web sites)
 * or distributed to other students. *
 *
 *      Name: Hayaturehman Ahmadzai
 *      Student ID: hahmadzai3
 *      Creation Date: 2021-06-10
 */

const mongoose = require('mongoose')
const crypto = require('crypto')
const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');
const clean = require('./plugins/clean.js')
const findPaginated = require('./plugins/findPaginated.js')
const exists = require('./plugins/exists.js')
const findLowest = require('./plugins/findLowest.js')
const size = require('./plugins/size.js')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    bEmailVerified: {
      type: Boolean,
      required: true,
      default: false
    },
    name: String,
    password: {
        type: String,
        required: true
    },
    salt: String,
    date: {
        type: Date,
        default: Date.now
    },
    avatar: String,
    bio: String,
})

userSchema.methods.setPassword = function(password) {
    //https://www.geeksforgeeks.org/node-js-password-hashing-crypto-module/
    // Creating a unique salt for a particular user
    this.salt = crypto.randomBytes(16).toString('hex');

    // Hashing user's salt and password with 1000 iterations,
    // 64 length and sha512 digest
    this.password = crypto.pbkdf2Sync(password, this.salt,
        1000, 64, `sha512`).toString(`hex`);
};

userSchema.methods.validPassword = function(password) {
    //Compare the hashed password with this hash
    const _password = crypto.pbkdf2Sync(password,
        this.salt, 1000, 64, `sha512`).toString(`hex`);
    return this.password === _password;
};

userSchema.plugin(mongoose_fuzzy_searching, { fields: ['username', 'name'] });
userSchema.plugin(findPaginated)
userSchema.plugin(findLowest)
userSchema.plugin(exists)
userSchema.plugin(clean)
userSchema.plugin(size)
module.exports = mongoose.model("users", userSchema)