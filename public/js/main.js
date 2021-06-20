/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
$('.hamburger').click(()=>{
    $("header > nav").toggleClass("responsive")
    $(".hamburger > i").toggleClass("fa-bars fa-times")
})

$('.currentOption').on('click', (e)=>{
    let btn;
    if ($(e.target).is(":button"))btn = $(e.target)
    else btn = $(e.target).closest('.currentOption')
    btn.siblings(".optionsContainer").toggle();
    e.stopPropagation()
})

$('.optionsContainer > .options > button').click((e)=>{
    let currentOption = $(e.target).closest('.multiOption').find('.currentOption > i')

    currentOption.attr(`class`, $(e.target).closest("button").find("i").attr('class'))
    currentOption.parent('.currentOption').attr(`value`, $(e.target).closest("button").attr('value'))

    const allOptions = $(e.target).closest('.options').find('button')

    allOptions.each(function() {
        if (!$(this).is(':visible'))
            $(this).show()
    });
    $(e.target).closest("button").hide();
})

//Hide the optionsContainer
$(document).on('click', function (e) {
    if ($(e.target).closest(".optionsContainer").length === 0) {
        $(".optionsContainer").hide();
    }
});

$('.search-input').on("invalid", function(e) {
    e.preventDefault();
});