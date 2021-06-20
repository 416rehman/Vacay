/*** I declare that this assignment is my own work in accordance with
 * Seneca Academic Policy. No part of this assignment has been copied
 * manually or electronically from any other source (including web sites)
 * or distributed to other students. *
 *
 *      Name: Hayaturehman Ahmadzai
 *      Student ID: hahmadzai3
 *      Creation Date: 2021-06-05
 */

/**
 * Simple repetition loop. Does a task n times.
 *
 * @param n
 * @param block
 * @returns {string}
 */
const times = function(n, block) {
    let accum = '';
    for(let i = 0; i < Math.floor(n); ++i) {
        block.data.index = i;
        accum += block.fn(i);
    }
    return accum;
}

/**
 * Adds numbers
 *
 * @returns {number}
 */
const add = function() {
    let args = Array.prototype.slice.call(arguments);
    args.pop()
    let sum = 0;
    args.forEach(e=>sum+=e)
    return sum
}


/**
 * Returns the length of the keys in the object
 *
 *
 * @param obj
 * @returns {number|number}
 */
const objectLength = function(obj) {
    return obj ? Object.keys(obj).length : 0;
}


/**
 * Concatenates Strings
 *
 *
 * @returns {string}
 */
const concat = function() {
    let args = Array.prototype.slice.call(arguments);
    args.pop()
    return `${args.join('')}`
}

/**
 * Evaluates Loose Equality
 *
 * @returns {boolean}
 */
const eq = function() {
    let args = Array.prototype.slice.call(arguments);
    args.pop()

    let state = true;
    for (let i = 0; i < args.length; i++) {
        if (args[i + 1] !== undefined){
            if (args[i] != args[i + 1]) {
                state = false
                break;
            }
        }
    }
    return state
}

/**
 * Returns true if first argument is greater than the second
 * Evaluates 2 values only
 * @returns {boolean}
 */
const gt = function() {
    let args = Array.prototype.slice.call(arguments);
    args.pop()
    return args[0] > args[1]
}


module.exports = {
    times,
    objectLength,
    concat,
    add,
    eq
}
