/* Copyright G. Hemingway @2022 - All rights reserved */
"use strict";

let gameType = "klondyke";

const onLoad = () => {
  let buttons = document.getElementsByClassName("btn");
  buttons[0].addEventListener("click", onStart, false);
  // Handle making draw active/inactive based on game selected
  $("input[type='radio']").click(() => {
    gameType = $("input[name='game']:checked").val();
    $("#draw").prop("disabled", gameType === "hearts");
  });
};

const onStart = (event) => {
  event.preventDefault();
  gameType = $("input[name='game']:checked").val();
  const data = {
    game: gameType,
    draw: "1",
    color: "red",
  };
  $.ajax({
    url: "/v1/game",
    method: "post",
    data: JSON.stringify(data),
    contentType: "application/json",
    success: (data) => {
      window.location = `/game.html?id=${data.id}`;
    },
    error: (err) => {
      let errorEl = document.getElementById("errorMsg");
      errorEl.innerHTML = `Error: ${err.responseJSON.error}`;
    },
  });
};
