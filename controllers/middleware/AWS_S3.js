/*** I declare that this assignment is my own work in accordance with
 * Seneca Academic Policy. No part of this assignment has been copied
 * manually or electronically from any other source (including web sites)
 * or distributed to other students. *
 *
 *      Name: Hayaturehman Ahmadzai
 *      Student ID: hahmadzai3
 *      Creation Date: 2021-06-20
 */
const AWS = require('aws-sdk')
AWS.config.update({
    accessKeyId: process.env.S3_ACCESS_KEY, // Access key ID
    secretAccesskey: process.env.S3_SECRET_KEY, // Secret access key
    region: "us-east-1" //Region
})

/**
 * Uploads provided image from req.files to provided S3 Bucket
 *
 *
 * @param image - req.files.image (If array, pass one image at a time)
 * @param fileName - filename to save as. Provide extension too.
 * @param bucket - Bucket name to upload to.
 */
 const uploadToS3 = function (image, fileName, bucket) {
    if (image?.data) {
        const s3 = new AWS.S3()
        const imageContent = Buffer.from(image.data)
        const params = {
            Bucket: bucket,
            Key: fileName, // File name you want to save as in S3
            ContentType: image.mimetype,
            Body: imageContent
        }
        // Uploading files to the bucket
        s3.upload(params, function (err, data) {
            return !err;
        });
    }
}

module.exports = {
     uploadToS3
}