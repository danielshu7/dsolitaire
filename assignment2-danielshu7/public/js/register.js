/* Copyright G. Hemingway @2022 - All rights reserved */
"use strict";

function registerHandler(ev) {
  ev.preventDefault();

  // form elements
  let user = $("#username").val();
  let fName = $("#first_name").val();
  let lName = $("#last_name").val();
  let city = $("#city").val();
  let email = $("#primary_email").val();
  let pass = $("#password").val();

  // clear existing error messages
  /*let colEl = $("#formCol")[0];
  while (colEl.lastChild.nodeName !== "FORM") {
    // clear previous error messages
    console.log(colEl.childNodes);
    colEl.removeChild(colEl.lastChild);
  }*/

  // data validation
  if(!user.match(/^[a-z0-9]{6,16}$/i)) {
    makeErrorMsg("Error: username must contain 6-16 alphanumeric characters");
  }
  else if(pass.length < 8) {
    makeErrorMsg("Error: password must be at least length 8")
  }
  else if(!pass.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^]).{8,}$/)) {
    makeErrorMsg("Error: password must contain a lower-case, an upper-case, " +
      "a number, and a symbol (!, @, #, $, % or ^)");
  }
  /*if(!pass.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^]).{8,}$/)) {
    makeErrorMsg("password must contain a lower-case, an upper-case, " +
      "a number and a symbol (!, @, #, $, % or ^) and be at least length 8");
  }*/
  else if(!email.match(/^\S+@\S+\.\S+$/)) {
    makeErrorMsg("Error: email must contain an '@' followed by an '.'")
  }

  // ajax request
  else {
    $.ajax({
      url: "/v1/user",
      method: "post",
      contentType:"application/json; charset=utf-8",
      data: JSON.stringify({
        username: user,
        password: pass,
        first_name: fName,
        last_name: lName,
        city: city,
        primary_email: email,
      }),
      success: data => {
        let url = "/profile.html?username=" + data.username;
        $("body").fadeOut("slow", () => window.location.assign(url));
      },
      error: response => {
        if(response.status === 400) {
          makeErrorMsg("Error: " + response.responseJSON.error);
        }
        else {
          makeErrorMsg("An unknown error has occurred.");
        }
      }
    });
  }
}

function makeErrorMsg(msgText) {
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
  msg.text(msgText);
}