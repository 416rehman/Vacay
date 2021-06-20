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
const clean = require('./plugins/clean.js')
const findPaginated = require('./plugins/findPaginated.js')
const exists = require('./plugins/exists.js')
const findLowest = require('./plugins/findLowest.js')
const size = require('./plugins/size.js')

const typeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String
    }
})

typeSchema.plugin(findPaginated)
typeSchema.plugin(findLowest)
typeSchema.plugin(exists)
typeSchema.plugin(clean)
typeSchema.plugin(size)
module.exports = mongoose.model("type", typeSchema)