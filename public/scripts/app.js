$(document).ready(function() {
/* *******AJAX POST Request Event handler for email submit********* */

$("#form123").click( function(event) {

  event.preventDefault();
  const userEmail = $("#email123");
  console.log("user email 3: ", userEmail);
  if (userEmail.val() === "" || userEmail.val() === null) {
    $(".error").text("Error ! Not a valid input.");
  }else{
      $.ajax({
       method: "POST",
       url: "/new_poll",
       data: userEmail,
     }).then((data) => {
        window.location.href = data.url
      console.log(data)
     })
  }

});


});


let counter= 2;

$( '.btn.btn-outline-secondary.start.add-option' ).click(function() {
  event.preventDefault;
  counter = counter+1;
  $('.option-container').append(

    `
<div class="ind_option">
    <div class="input-group">
            <input type="text" class="form-control option_val" placeholder="" aria-label="" aria-describedby="basic-addon1">
            <div class="input-group-append">
              <button class="btn btn-success" type="button"><i class="fas fa-backspace">    </i></button>
            </div>
    </div>
</div>

`
  );
});

$('.option-container').on('click', 'button', function(){
  $(this).closest('div .ind_option').detach();
  $(this).closest('div .ind_option').remove();
  counter--
});

$('.btn.btn-outline-secondary.start.subpoll').click(function(){

  let emailOutput = $('.form-control.emailNewPoll').val();
  let pollQuestion = $('.form-control.newPollTitle').val();
  let optionOutput=[];

  $('.form-control.option_val').each(function(){
      optionOutput.push($(this).val());
    })
    console.log(pollQuestion);
    console.log(optionOutput);
    console.log('This is email', emailOutput)

});

