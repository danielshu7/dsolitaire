/* Copyright G. Hemingway @2022 - All rights reserved */
"use strict";

const getUrlVars = () => {
  let vars = [],
    hash;
  let hashes = window.location.href
    .slice(window.location.href.indexOf("?") + 1)
    .split("&");
  for (let i = 0; i < hashes.length; i++) {
    hash = hashes[i].split("=");
    vars[hash[0]] = hash[1];
  }
  return vars;
};

const onLoad = () => {
  let vars = getUrlVars();
  if (vars.id) {
    $.ajax({
      url: `/v1/game/${vars.id}`,
      method: "get",
      success: (data) => {
        // Setup the page
        $("#duration").html(`${data.duration} seconds`);
        $("#moves").html(data.moves.length);
        $("#points").html(data.score);
        $("#remaining").html(data.cards_remaining);
        $("#active").html(`${data.active}`);
        let $moves = $("tbody");
        data.moves.forEach((move, index) => {
          $moves.append(`<tr>
                            <th>${move.id ? move.id : index + 1}</th>
                            <th>${move.duration} seconds</th>
                            <th>${move.player}</th>
                            <th>${move.move}</th>
                        </tr>`);
        });
      },
      error: (err) => {
        let errorEl = document.getElementById("errorMsg");
        errorEl.innerHTML = `Error: ${err.responseJSON.error}`;
      },
    });
  }
};
