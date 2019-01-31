$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done((users) => {
    for(user of users) {
      $("<div>").text(user.name).appendTo($("body"));
    }
  });;
});


let counter= 2;

$( '.btn.btn-outline-secondary.start.add-option' ).click(function() {
  event.preventDefault;
  counter = counter+1;
  $('.option-container').append(

    `
<div class="ind_option">
Option ${counter}:<br>
    <input class="form-control form-control-lg new_option" type="text" placeholder="Waffles">
    <i class="fas fa-backspace"></i>  <br>
</div>
`
  );
});

$('.fas.fa-backspace').click(function(){
  $(this).closest('div').remove(); 
});