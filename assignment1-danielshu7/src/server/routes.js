/* Copyright G. Hemingway @2022 - All rights reserved */
"use strict";

export default async (app) => {
  // Handle register submission
  app.post("/register", (req, res) => {
    if (!req.body.username)
      res.status(400).send({ error: "username field required" });
    else if (!req.body.first_name)
      res.status(400).send({ error: "first_name field required" });
    else if (!req.body.last_name)
      res.status(400).send({ error: "last_name field required" });
    else if (!req.body.city)
      res.status(400).send({ error: "city field required" });
    else if (!req.body.primary_email)
      res.status(400).send({ error: "primary_email field required" });
    else if (!req.body.password)
      res.status(400).send({ error: "password field required" });
    else
      res.send(
        `<p id="regSuccess">Successfully registered: ${req.body.username}. Go to <a href="/login.html">login</a>.</p>`
      );
  });

  // Handle login requests
  app.post("/login", (req, res) => {
    if (!req.body.username)
      res.status(400).send({ error: "username field required" });
    else if (!req.body.password)
      res.status(400).send({ error: "password field required" });
    else
      res.send(
        `<p id="loginSuccess">Logged in as user ${req.body.username}. Go to your profile: <a href="/profile.html?username=${req.body.username}">here</a>.</p>`
      );
  });

  // Handle game creation submissions
  app.post("/start", (req, res) => {
    if (!req.body.game) res.status(400).send({ error: "game field required" });
    else if (!req.body.draw)
      res.status(400).send({ error: "draw field required" });
    else if (!req.body.color)
      res.status(400).send({ error: "color field required" });
    else
      res.send(
        `<p id="startSuccess">New game started! <a href="/game.html">Play!</a>?</p>`
      );
  });
};
