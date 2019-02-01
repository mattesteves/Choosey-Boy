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

// $.post( "/new_poll",userEmail).then((data) => {
//         console.log(data)
//         window.location.href = data.redirect;
//        });
