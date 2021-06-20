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
     * Returns true if queried document exists
     *
     * @param query
     * @returns {Promise<boolean>}
     */
    schema.statics.any = async function (query) {
        const result = await this.findOne(query).select("_id").lean();
        return !!result;
    };
}