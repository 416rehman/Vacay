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
     * Returns paginated object containing articles, page, and pages
     *
     * @param {Number} perPage
     * @param {Number} page
     * @param {Object} filter optional
     * @param {String} sort optional
     * @param {String} populate optional
     * @param {String} populate2 optional
     * @param {String} populate3 optional
     */
    schema.statics.findPaginated = async function (perPage, page, filter = {}, sort = '', populate, populate2, populate3) {
        return new Promise((async (resolve, reject) => {
            const count = await this.countDocuments(filter)
            await this.find(filter).limit(perPage).skip(perPage * (page <= 1 ? 0 : page - 1)).sort(sort).populate(populate).populate(populate2).populate(populate3).lean().exec(function (error, results) {
                if (error) reject(error)
                try {
                    results.forEach(a => {
                        if (a.date) a.date = a.date.toLocaleString()
                    })

                    resolve({
                        results: results,
                        page: page,
                        pages: Math.ceil(count / perPage),
                        count: count
                    });
                }
                catch (e) {
                    console.log(e)
                    reject(e)
                }

            })
        }))
    }
}