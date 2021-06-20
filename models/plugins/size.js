/*** I declare that this assignment is my own work in accordance with
 * Seneca Academic Policy. No part of this assignment has been copied
 * manually or electronically from any other source (including web sites)
 * or distributed to other students. *
 *
 *      Name: Hayaturehman Ahmadzai
 *      Student ID: hahmadzai3
 *      Creation Date: 2021-06-15
 */

module.exports = function count(schema, options) {
    /**
     * Returns the count of documents in a collection
     *
     * @param query
     * @returns {Promise<boolean>}
     */
    schema.statics.size = async function (query) {
        return await this.countDocuments(query).select("_id").lean();
    };
}