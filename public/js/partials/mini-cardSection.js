/*** I declare that this assignment is my own work in accordance with
 * Seneca Academic Policy. No part of this assignment has been copied
 * manually or electronically from any other source (including web sites)
 * or distributed to other students. *
 *
 *      Name: Hayaturehman Ahmadzai
 *      Student ID: hahmadzai3
 *      Creation Date: 2021-06-06
 */


$('.carousel-Controls > #left').click((e)=>{
    const carousel = $(e.target).closest('.mini-cardSection').find('.mini-cardCarousel')
    carousel.scrollLeft(carousel.scrollLeft()-200)
})

$('.carousel-Controls > #right').click((e)=>{
    const carousel = $(e.target).closest('.mini-cardSection').find('.mini-cardCarousel')
    carousel.scrollLeft(carousel.scrollLeft()+200)
})