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
     * Deletes all blank fields
     *
     * i.e name='' will be deleted since name is empty
     */
    schema.methods.clean = function () {
        for (let [key, value] of Object.entries(this._doc))
            if (key !== '_id')
                if (value === "") delete this._doc[key]
    };
}