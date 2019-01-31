"use strict";
$(document).ready(function() {


$('.btn btn-success emailbutton').on('submit', function(event) {

  event.preventDefault();
  const email = $(".form-control");

  if (email.val() === "" || email.val() === null) {

  }else{
    $(".error").text("Error ! Not a valid input.");
};



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




};
