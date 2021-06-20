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
//https://github.com/VassilisPallas/mongoose-fuzzy-searching
const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');
const clean = require('./plugins/clean.js')
const findPaginated = require('./plugins/findPaginated.js')
const exists = require('./plugins/exists.js')
const findLowest = require('./plugins/findLowest.js')
const size = require('./plugins/size.js')

const listingSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',   //https://mongoosejs.com/docs/populate.html
    },
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'type',
    },
    title: {
        type: String,
        required: true,
    },
    details: {
        type: String,
        required: true,
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'location',
    },
    address: {
        type: String,
        required: true
    },
    ratings: {
        _1stars: {type: Number, default: 1},
        _2stars: {type: Number, default: 1},
        _3stars: {type: Number, default: 1},
        _4stars: {type: Number, default: 1},
        _5stars: {type: Number, default: 1},
    },
    images: [{type: String}],
    thumbnail: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    currentPrice: {
        type: Number
    },
    amenities:
        [{type: String}],
    bedrooms: {
        type: Number,
        default: 1
    },
    bathrooms: {
        type: Number,
        default: 1
    },
    date: {
        type: Date,
        default: Date.now
    }
})

listingSchema.plugin(findPaginated)
listingSchema.plugin(findLowest)
listingSchema.plugin(exists)
listingSchema.plugin(clean)
listingSchema.plugin(size)
//For performance reasons, "details" is excluded from indexing for fuzzy searching.
listingSchema.plugin(mongoose_fuzzy_searching, { fields: ['title', 'address'] });
module.exports = mongoose.model("listing", listingSchema)