/* Copyright G. Hemingway @2022 - All rights reserved */
"use strict";

// get user info
let urlParams = new URLSearchParams(window.location.search);
let username = urlParams.get("username");
$.ajax({
  url: "/v1/user/" + username,
  method: "get",
  success: data => {
    // set user info
    let userInfoCol = $("#userInfo");
    userInfoCol.append($(`<p>${data.username}</p>`));
    userInfoCol.append($(`<p>${data.first_name}</p>`));
    userInfoCol.append($(`<p>${data.last_name}</p>`));
    userInfoCol.append($(`<p>${data.city}</p>`));
    userInfoCol.append($(`<p>${data.primary_email}</p>`));

    // set game info
    let tbody = $("tbody");
    data.games.forEach(game => {
      let tr = $("<tr></tr>");
      let status = game.active ? "Active" : "Complete";
      let url = game.active ? `/game.html?id=${game.id}` : `/results.html?id=${game.id}`;
      tr.append($(`<th><a href="${url}">${status}</a></th>`));

      let startDate = new Date(game.start);
      let date = startDate.toLocaleDateString();
      let time = startDate.toLocaleTimeString();
      tr.append($(`<th>${date}, ${time}</th>`));

      tr.append($(`<th>${game.moves}</th>`));
      tr.append($(`<th>${game.score}</th>`));
      tr.append($(`<th>${game.type}</th>`));
      tbody.append(tr);
    });
  },
});