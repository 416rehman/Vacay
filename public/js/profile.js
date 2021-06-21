/*** I declare that this assignment is my own work in accordance with
 * Seneca Academic Policy. No part of this assignment has been copied
 * manually or electronically from any other source (including web sites)
 * or distributed to other students. *
 *
 *      Name: Hayaturehman Ahmadzai
 *      Student ID: hahmadzai3
 *      Creation Date: 2021-06-20
 */

function toggleEdit() {
    let name = $('#userInfo > #name')
    if (name.attr('contenteditable') === 'true')
        name.attr('contenteditable', 'false')
    else name.attr('contenteditable', 'true');
    name.toggleClass('editable')

    let bio = $('#userInfo > #bio');
    if (bio.attr('contenteditable') === 'true')
        bio.attr('contenteditable', 'false')
    else bio.attr('contenteditable', 'true');
    bio.toggleClass('editable')

    $('#editedData > #avatarLbl').toggle()
    $('#editedData > #submit').toggle()
}


$('#edit').click((e)=>{
    toggleEdit();
})

$('#editedData').submit(()=>{
    $('#editedData > #name').attr('value', $('#userInfo > #name').text())
    $('#editedData > #bio').attr('value', $('#userInfo > #bio').text())
    toggleEdit();
})