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
  let optionOutput=[];

  $('.form-control.option_val').each(function(){
      optionOutput.push($(this).val());
    })
    console.log(optionOutput);
    console.log('This is email', emailOutput)

});