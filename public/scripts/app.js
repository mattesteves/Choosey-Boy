$('.error').hide();

$(document).ready(function eventhandlers(){

let templateVars={};

let counter= 2;

// Adding a new option on new_poll.ejs

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
    <input class="form-control form-control-lg" type="text" placeholder="Description">
</div>

`
  );
  $('.option_val').focus();
  if (counter === 10){
    $('.btn.btn-outline-secondary.start.add-option').slideUp();
    }
});

//Removing an option on new_poll.ejs

$('.option-container').on('click', 'button', function(){
  $(this).closest('div .ind_option').slideUp('slow');
  $(this).closest('div .ind_option').detach();
  $(this).closest('div .ind_option').remove();
  counter-- ;
  console.log(counter);
  $('.btn.btn-outline-secondary.start.add-option').slideDown();

});

// Submitting a poll on new_poll.ejs

$('.btn.btn-outline-secondary.start.subpoll').click(function(){

 function fade(){
     $(".error").fadeOut()
  };

  let emailOutput = $('.form-control.emailNewPoll').val();
  let pollQuestion = $('.form-control.newPollTitle').val();

  if (pollQuestion === "" || pollQuestion === null) {
    $(".error_ms").text("Your poll needs a question");
    $(".error").fadeIn();
    $('.form-control.newPollTitle').focus();
    setTimeout(fade, 3000 );
    return }

  let optionOutput = [];
  let votes = [];
  let descriptionOut= [];
  let error= false;

$('.form-control.option_val').each(function(){
    if ($(this).val() ==="" || $(this).val() === null){
    $(".error_ms").text("You can't submit an empty answer!");
    $(this).focus();
    error= true;
    return
    }

  for(options in optionOutput){
    if ($(this).val()===optionOutput[options]){
      $(".error_ms").text("No duplicate answers please!");
      error = true;
    }

    }
    optionOutput.push($(this).val());


    descriptionOut.push($(this).parent().next('input').val());
  });


  if (error === true){
    $(".error").fadeIn();
    setTimeout(fade, 3000 );
    return
  }

  if (emailOutput === "" || emailOutput === null) {
    $(".error_ms").text("Please submit an email address.");
    $(".error").fadeIn();
    $('.form-control.emailNewPoll').focus();
    setTimeout(fade, 3000 );
    return
  }

   $.ajax({
      method: "POST",
      url: "/new_poll",
      data: {
        email: emailOutput,
        pollValue: pollQuestion,
        options: optionOutput,
        descriptions: descriptionOut
      }
    }).then((data) => {
       window.location.href = data.url
    })


});


// Voting an option up on poll_show.ejs

$('.pollshow_indoption').on('click', '.fas.fa-arrow-circle-up', function(){
  if ($(this).closest('div .pollshow_indoption').prev().length === 0){
    return
  }
  { $(this).closest('div .pollshow_indoption').slideUp('', function(){
  $(this).closest('div .pollshow_indoption').prev().insertAfter($(this).closest('div .pollshow_indoption'))});
$(this).closest('div .pollshow_indoption').slideDown('');}
});

// Voting an option down on poll_show.ejs

$('.pollshow_indoption').on('click', '.fas.fa-arrow-circle-down', function(){
  if ($(this).closest('div .pollshow_indoption').next().length === 0){
    return
  }
  $(this).closest('div .pollshow_indoption').slideUp('', function(){
    $(this).closest('div .pollshow_indoption').next().insertBefore($(this).closest('div .pollshow_indoption'))});
  $(this).closest('div .pollshow_indoption').slideDown('');
  });

//Submitting votes on poll_show.ejs

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



}); // End of Document.ready




