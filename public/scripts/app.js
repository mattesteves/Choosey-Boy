$(document).ready(function eventhandlers(){

let templateVars={};

let counter= 2;
$('.error').hide();

$( '.btn.btn-outline-secondary.start.add-option' ).click(function() {
  event.preventDefault;
    counter = counter+1;
    console.log(counter);
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
  if (counter === 10){
    console.log("no");
    $('.btn.btn-outline-secondary.start.add-option').slideUp()
  }
});

$('.option-container').on('click', 'button', function(){
  $(this).closest('div .ind_option').detach();
  $(this).closest('div .ind_option').remove();
  counter-- ;
  console.log(counter);
  $('.btn.btn-outline-secondary.start.add-option').slideDown();

});

$('.btn.btn-outline-secondary.start.subpoll').click(function(){

  let emailOutput = $('.form-control.emailNewPoll').val();
  let pollQuestion = $('.form-control.newPollTitle').val();
  if (pollQuestion === "" || pollQuestion === null) {
    $(".error_ms").text("Your poll needs a question");
    $(".error").slideDown();
    return }

  let optionOutput = [];
  let votes = [];
  let error= false;
$('.form-control.option_val').each(function(){
    if ($(this).val() ==="" || $(this).val() === null){
    error= true;
    return
    }
    optionOutput.push($(this).val());
  })
  if (error === true){
    $(".error_ms").text("You can't submit an empty answer!");
    $(".error").slideDown(); 
    return   
  }

  if (emailOutput === "" || emailOutput === null) {
    $(".error_ms").text("Please submit an email address.");
    $(".error").slideDown();
    return
  }

   $.ajax({
      method: "POST",
      url: "/new_poll",
      data: {
        email: emailOutput,
        pollValue: pollQuestion,
        options: optionOutput
      }
    }).then((data) => {
       window.location.href = data.url
    })
  

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

  $('#pollshow_submit').click( function (){
    let votes =[]
  $('.option_text').each(function(){
    votes.push($(this).text() )
    console.log($(this).text())
  });
  console.log(votes)

     $.ajax({
      method: "POST",
      url: window.location.href,
      data: {
        votes: votes
      }
    })

  return votes
  });
  


});



  
