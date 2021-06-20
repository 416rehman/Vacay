/*** I declare that this assignment is my own work in accordance with
 * Seneca Academic Policy. No part of this assignment has been copied
 * manually or electronically from any other source (including web sites)
 * or distributed to other students. *
 *
 *      Name: Hayaturehman Ahmadzai
 *      Student ID: hahmadzai3
 *      Creation Date: 2021-06-15
 */
module.exports = function exists(schema, options) {
    /**
     * Returns the document with lowest X from collection, with an optional query.
     * @param X
     * @param query
     * @returns {Promise<*>}
     */
    schema.statics.findCheapest = async function (X, query) {
        return await this.findOne(query).sort(`${X}`).lean()
    };
}