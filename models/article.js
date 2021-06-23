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
const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');
const clean = require('./plugins/clean.js')
const findPaginated = require('./plugins/findPaginated.js')
const exists = require('./plugins/exists.js')
const findLowest = require('./plugins/findLowest.js')
const size = require('./plugins/size.js')

const articleSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    excerpt: String,
    date: {
        type: Date,
        default: Date.now
    },
    image: String
})

articleSchema.plugin(mongoose_fuzzy_searching, { fields: ['content', 'excerpt', 'title'] });
articleSchema.plugin(findPaginated)
articleSchema.plugin(findLowest)
articleSchema.plugin(exists)
articleSchema.plugin(clean)
articleSchema.plugin(size)
module.exports = mongoose.model("article", articleSchema)