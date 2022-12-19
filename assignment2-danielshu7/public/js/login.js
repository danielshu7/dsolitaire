/* Copyright G. Hemingway @2022 - All rights reserved */
"use strict";

function loginHandler(ev) {
  ev.preventDefault();
  $.ajax({
    url: "/v1/session",
    method: "post",
    contentType:"application/json; charset=utf-8",
    data: JSON.stringify({
      username: $("#username").val(),
      password: $("#password").val(),
    }),
    success: data => {
      let url = "/profile.html?username=" + data.username;
      $("body").fadeOut("slow", () => window.location.assign(url));
    },
    error: response => {
      let col = $("#formCol");
      let row = $("#errorRow");
      let msg;
      if(row.length === 0) {
        // no err message exists yet, so create one
        row = $(`<div class="row error-row pb-1 mt-2" id="errorRow"></div>`);
        msg = $("<p class='mb-0' id='errorMsg'></p>");
        row.append(msg);
        col.append(row);
      }
      else {
        msg = row.find("#errorMsg");
      }

      if(response.status === 400) {
        msg.text("Error: Please enter a username and password.");
      }
      else if(response.status === 401) {
        msg.text("Error: Username and password do not match.");
      }
      else {
        msg.text("An unknown error has occurred.");
      }
    }
  });
}