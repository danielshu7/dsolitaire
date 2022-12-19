/* Copyright G. Hemingway @2022 - All rights reserved */
"use strict";

// get id info
let urlParams = new URLSearchParams(window.location.search);
let id = urlParams.get("id");
$.ajax({
  url: "/v1/game/" + id,
  method: "get",
  success: data => {
    // set game stats
    let gameStatsCol = $("#gameStats");
    gameStatsCol.append($(`<p>${data.duration}s</p>`));
    gameStatsCol.append($(`<p>${data.moves.length}</p>`));
    gameStatsCol.append($(`<p>${data.score}</p>`));
    gameStatsCol.append($(`<p>${data.cards_remaining}</p>`));
    gameStatsCol.append($(`<p>False</p>`));
    gameStatsCol.append($("<p></p>"));

    // set game history
    let tbody = $("tbody");
    data.moves.forEach((turn,i) => {
      let tr = $("<tr></tr>");
      let id = i+1;
      tr.append($(`<th>${id}</th>`));
      tr.append($(`<th>${turn.duration} seconds</th>`));
      tr.append($(`<th>${turn.player}</th>`));
      tr.append($(`<th>${turn.move}</th>`));
      tbody.append(tr);
    });
  },
});