/* Copyright G. Hemingway @2022 - All rights reserved */
"use strict";

const onLoad = () => {
  // Start listening to form submission
  let buttons = document.getElementsByClassName("btn");
  buttons[0].addEventListener("click", onLogin, false);
  // Focus on the username field
  document.getElementById("username").focus();
};

const onLogin = (event) => {
  event.preventDefault();
  const data = {
    username: document.getElementById("username").value,
    password: document.getElementById("password").value,
  };
  $.ajax({
    url: "/v1/session",
    method: "post",
    data: JSON.stringify(data),
    contentType: "application/json",
    success: (data) => {
      window.location = `/profile.html?username=${data.username}`;
    },
    error: (err) => {
      let errorEl = document.getElementById("errorMsg");
      errorEl.innerHTML = `Error: ${err.responseJSON.error}`;
    },
  });
};
