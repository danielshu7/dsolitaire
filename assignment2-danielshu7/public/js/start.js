/* Copyright G. Hemingway @2022 - All rights reserved */
"use strict";

function startHandler(ev) {
  ev.preventDefault();
  $.ajax({
    url: "/v1/game",
    method: "post",
    contentType:"application/json; charset=utf-8",
    data: JSON.stringify({
      game: $('input[name="game"]:checked').val(),
      color: $("#color").val().toLowerCase(),
      draw: $("#draw").val().substring(5),
    }),
    success: data => {
      let url = "/game.html?id=" + data.id;
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
        msg.text("Error: " + response.responseJSON.error);
      }
      else {
        msg.text("An unknown error has occurred.");
      }
    }
  });
}