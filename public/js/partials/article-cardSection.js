/*** I declare that this assignment is my own work in accordance with
 * Seneca Academic Policy. No part of this assignment has been copied
 * manually or electronically from any other source (including web sites)
 * or distributed to other students. *
 *
 *      Name: Hayaturehman Ahmadzai
 *      Student ID: hahmadzai3
 *      Creation Date: 2021-06-06
 */


$('#articles-left').click((e)=>{
    const carousel = $(e.target).closest('.articleCardContainer').find('.article-Carousel')
    carousel.scrollLeft(carousel.scrollLeft()-200)
})

$('#articles-right').click((e)=>{
    const carousel = $(e.target).closest('.articleCardContainer').find('.article-Carousel')
    carousel.scrollLeft(carousel.scrollLeft()+200)
})