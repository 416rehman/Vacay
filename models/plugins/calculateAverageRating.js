/*** I declare that this assignment is my own work in accordance with
 * Seneca Academic Policy. No part of this assignment has been copied
 * manually or electronically from any other source (including web sites)
 * or distributed to other students. *
 *
 *      Name: Hayaturehman Ahmadzai
 *      Student ID: hahmadzai3
 *      Creation Date: 2021-06-15
 */

/**MUTATOR Function: Requires a listings object with a results subobject containing ratings
 *
 * Required Object Structure: listings.ratings
 *
 * @param {Object} listing
 */
const calculateRating = function (listing)
{
    let sum = 0, averageSum = 0, count = 0;
    if (listing.ratings)
        for (const [key, value] of Object.entries(listing.ratings)) {
            count++
            const average = count * value
            averageSum += average
            sum += value;
        }

    listing.average = (averageSum/sum).toFixed(1) || 1;
}

module.exports = {
    calculateRating
}