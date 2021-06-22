/*** I declare that this assignment is my own work in accordance with
 * Seneca Academic Policy. No part of this assignment has been copied
 * manually or electronically from any other source (including web sites)
 * or distributed to other students. *
 *
 *      Name: Hayaturehman Ahmadzai
 *      Student ID: hahmadzai3
 *      Creation Date: 2021-06-11
 */
const isImageURL = require('is-image-url')
const randomstring = require("randomstring");

/**
 * Checks if any fields in the fieldArray are not filled.
 * Empty fields are stored in req.emptyFields.
 *
 * Conditional requirements can be passed in a subarray.
 *
 * i.e checkEmptyFields(['abc', ['def', 'ghi']])
 * if either 'def' or 'ghi' is provided, both are considered non-empty.
 * @param {Array} fieldArray
 */
const checkEmptyFields = function (fieldArray){
    return function (req, res, next) {
        let requiredFields = fieldArray.flat()  //if the array is not stored locally here, the fieldArray pops and pushes are persistent
        req.emptyFields = []

        //Check for the required fields in req.body
        for (const [key, value] of Object.entries(req.body)){
            if (requiredFields.includes(key)) {
                requiredFields.splice(requiredFields.indexOf(key), 1)
                if (!value.length) req.emptyFields.push(key)
            }
        }

        //Check in req.files for the remaining fields that couldnt be found in req.body
        requiredFields.forEach(f=> {
            if (req.files){
                if (!req.files[f]) req.emptyFields.push(f)
            } else req.emptyFields.push(f)
        })

        //Handle Conditional Requirement (If one of the items in the subarrays is provided, we remove them from "emptyFields")
        //i.e checkEmptyFields(['abc', ['def', 'ghi']])
        //if either 'def' or 'ghi' is provided, both are considered non-empty.
        fieldArray.forEach(obj=>{
            if(Array.isArray(obj)) {
                let isProvided

                for (let i = 0; i < obj.length; i++){
                    if (!req.emptyFields.includes(obj[i])){
                        isProvided = true
                        break;
                    }
                }

                if (isProvided)
                    obj.forEach(el=>{
                        if (req.emptyFields.includes(el))req.emptyFields.splice(req.emptyFields.indexOf(el), 1)
                    })
            }
        })
        next()
    }
}

/**
 * Checks if any files in req.files do not have the same mimetype as in targetMimes array.
 * Invalid files are stored in req.rejectedFiles
 *
 * if no mimetypes are specified, defaults to ['image/jpeg', 'image/png', 'image/jpg']
 * if required flag is passed, req.rejectedFiles will NOT be empty if no files were uploaded.
 *
 * @param {Array}targetMimes
 */
const limitFileTypes = function (targetMimes = ['image/jpeg', 'image/png', 'image/jpg']){
    return function (req, res, next) {
        req.rejectedFiles = []
        const files = []
        if (req?.files) {
            Object.entries(req.files).forEach(obj=>{
                obj.forEach(upload=>{
                    if (upload.constructor === Array){
                        upload.forEach(file=>{
                            //Multiple files per field
                            if (!(targetMimes.includes(file.mimetype))){
                                req.rejectedFiles.push({name: file.name, mimetype: file.mimetype})
                            }
                        })
                    }
                    else if (upload.mimetype && !targetMimes.includes(upload.mimetype)) {
                        req.rejectedFiles.push({name: upload.name, mimetype: upload.mimetype})
                    }
                })
            })
        }
        next();
    }
}

/**
 * Populates req.files with a new file extension property
 * Results are stored in req.files.extension
 *
 */
const populateExtensions = function (req,res,next){
    // if (req?.files) {
    //     for (let file of Object.entries(req.files)) {
    //         if (file[1].mimetype){

    //         }
    //     }
    // }
    if (req?.files) {
        Object.entries(req.files).forEach(obj=>{
            obj.forEach(upload=>{
                if (upload.constructor === Array){
                    upload.forEach(file=>{
                        //Multiple files per field
                        const imageType = file.mimetype.split('/')
                        file.extension = imageType[imageType.length - 1]
                    })
                }
                else if (upload.mimetype) {
                    //Multiple files per field
                    const imageType = upload.mimetype.split('/')
                    upload.extension = imageType[imageType.length - 1]
                }
            })
        })
    }

    next();
}


/**
 * Validates the links in the provided field names to make sure they are actual images.
 * If a splitter is provided, the links will be split up and evaluated individially.
 * I.E if a text input contains multiple links seperated by a ',' they will be seperated and evaluated individually.
 *
 * Empty fields are not evaluated.
 *
 * Invalid URLs are stored in req.rejectedImageURLs
 * Comma separated URLs are extracted and stored in req.extractedImageURLs
 * @param {Array} fieldArray
 * @param {String} splitter
 */
const validateImageURLs = function (fieldArray, splitter){
    return function (req,res,next){

        req.rejectedImageURLs = []
        req.extractedImageURLs = []
        if (req.body)
            for (const [key, value] of Object.entries(req.body))
                if ((fieldArray.includes(key) && value.length)) {
                    const links = req.body[`${key}`].split(splitter)
                    links.forEach(l=>{
                        if(isImageURL(l)) req.extractedImageURLs.push(l)
                        else if (l.length) req.rejectedImageURLs.push({[key]: value})
                    })
                }

        next();
    }
}

/**
 * Validates the provided fields if they are numbers.
 * Invalid fields are stored in req.rejectedNumbers
 * @param {Array} fieldArray
 */
const validateNumbers = function (fieldArray){
    return function (req,res,next){
        req.rejectedNumbers = []
        if (req.body)
            for (const [key, value] of Object.entries(req.body))
                if (fieldArray.includes(key) && value.length && (isNaN(value) || value < 0.1))
                    req.rejectedNumbers.push(key)

        next();
    }
}


/**
 * Validates the provided fields if they do NOT have any special chars.
 *
 * if specified fiels are empty, they will be rejected
 *
 * Invalid fields are stored in req.rejectedSpecialCharFields
 *
 *
 * @param {Array} fieldArray
 */
const validateNoSpecialCharacters = function (fieldArray) {
    const reg = new RegExp(/^[-._a-z0-9]+$/i)
    return function (req,res,next){
        req.rejectedSpecialCharFields = []
        if (req.body)
            for (const [key, value] of Object.entries(req.body))
                if (fieldArray.includes(key) && value.length) {
                    if (!reg.test(value)) req.rejectedSpecialCharFields.push(key)
                }
        next();
    }
}

/**
 * Validates the provided fields if they are emails.
 * Invalid fields are stored in req.rejectedEmailFields
 *
 *
 * @param {Array} fieldArray
 */
const validateEmail = function (fieldArray) {
    //Regexp from https://emailregex.com/
    const reg = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    return function (req,res,next){
        req.rejectedEmailFields = []
        if (req.body)
            for (const [key, value] of Object.entries(req.body))
                if (fieldArray.includes(key) && value.length)
                    if (reg.test(value) !== true)
                        req.rejectedEmailFields.push(key)
        next();
    }
}

/**
 * Imposes MAX length limits on the provided fields.
 *
 * Rejected fields are stored in req.overflowFields
 * @param {Array} fieldArray Array containing the field names to impost length limits on
 * @param {Array} limitsArray Array containing the max lengths for the provided fields (Must be in the same index)
 */
const validateMaxLength = function (fieldArray, limitsArray) {
    return function (req, res, next) {
        req.overflowFields = []
        if (req.body)
            for (const [key, value] of Object.entries(req.body))
                if (fieldArray.includes(key))
                    if (value.length > limitsArray[fieldArray.indexOf(key)])
                        req.overflowFields.push({field: key, maxLength: limitsArray[fieldArray.indexOf(key)]});
        next()
    }
}

/**
 * Imposes MAX length limits on the provided fields.
 *
 * Rejected fields are stored in req.insufficientLengthFields
 */
const validateMinLength = function (fieldArray, limitsArray) {
    return function (req, res, next) {
        req.insufficientLengthFields = []
        if (req.body)
            for (const [key, value] of Object.entries(req.body))
                if (fieldArray.includes(key))
                    if (value.length < limitsArray[fieldArray.indexOf(key)])
                        req.insufficientLengthFields.push({field: key, minLength: limitsArray[fieldArray.indexOf(key)]});
        next()
    }
}

/**
 * MUST USE PopulateExtension middleware before this.
 *
 *
 * Generates a unique filename for uploaded files
 * Creates a S3url property in the file object with provided bucketname
 *
 * @param BucketName
 * @returns {function(*=, *, *): void}
 */
const generateS3URLsForUploads = function (BucketName) {
    return function (req,res,next) {
        if (req.files)
            Object.entries(req.files).forEach(obj=>{
                for (let upload of obj) {
                    if (upload.constructor === Array){
                        for (let file of upload) {
                            file.filename = `${req.session.passport.user}_${randomstring.generate({length: 8, capitalization: 'lowercase'})}.${file.extension}`
                            file.S3url= (`https://${BucketName}.s3.amazonaws.com/${file.filename}`)
                        }
                    }
                    else if (upload.mimetype) {
                        upload.filename = `${req.session.passport.user}_${randomstring.generate({length: 8, capitalization: 'lowercase'})}.${upload.extension}`
                        upload.S3url= (`https://${BucketName}.s3.amazonaws.com/${upload.filename}`)
                    }
                }
            })
        next()
    }
}

module.exports = {
    checkEmptyFields,
    limitFileTypes,
    populateExtensions,
    validateImageURLs,
    validateNumbers,
    validateNoSpecialCharacters,
    validateEmail,
    validateMaxLength,
    validateMinLength,
    generateS3URLsForUploads
}