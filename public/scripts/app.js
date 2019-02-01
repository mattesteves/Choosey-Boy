$(document).ready(function eventhandlers(){

let templateVars={};

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
  if (emailOutput === "" || emailOutput === null) {
    $(".error").text("Error ! Not a valid input.");
  }else{
    $.post( "/new_poll",emailOutput);
  }

});



$('.pollshow_indoption').on('click', '.fas.fa-arrow-circle-up', function(){
  if ($(this).closest('div .pollshow_indoption').prev().length === 0){
    return
  }
  { $(this).closest('div .pollshow_indoption').slideUp('', function(){
  $(this).closest('div .pollshow_indoption').prev().insertAfter($(this).closest('div .pollshow_indoption'))});
$(this).closest('div .pollshow_indoption').slideDown('');}
});

$('.pollshow_indoption').on('click', '.fas.fa-arrow-circle-down', function(){
  if ($(this).closest('div .pollshow_indoption').next().length === 0){
    return
  }
  $(this).closest('div .pollshow_indoption').slideUp('', function(){
    $(this).closest('div .pollshow_indoption').next().insertBefore($(this).closest('div .pollshow_indoption'))});
  $(this).closest('div .pollshow_indoption').slideDown('');
  });


});
