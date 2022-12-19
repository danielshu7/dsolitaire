/* Copyright G. Hemingway, @2022 - All rights reserved */
"use strict";

const Joi = require("joi");
const { filterGameForProfile } = require("../../solitare.cjs");
const sharedPromise = import("../../../shared/index.js");

module.exports = (app) => {
  /**
   * Create a new user
   *
   * @param {req.body.username} Display name of the new user
   * @param {req.body.first_name} First name of the user - optional
   * @param {req.body.last_name} Last name of the user - optional
   * @param {req.body.city} City user lives in - optional
   * @param {req.body.primary_email} Email address of the user
   * @param {req.body.password} Password for the user
   * @return {201, {username,primary_email}} Return username and others
   */
  app.post("/v1/user", async (req, res) => {
    const { validPassword, validUsername } = await sharedPromise;
    // Schema for user info validation
    const schema = Joi.object({
      username: Joi.string().lowercase().alphanum().min(3).required(),
      password: Joi.string().min(8).required(),
      first_name: Joi.string(),
      last_name: Joi.string(),
      primary_email: Joi.string().email().required(),
      city: Joi.string(),
      games: Joi.array(),
    });
    try {
      let data = await schema.validateAsync(req.body);
      const additionalUsernameError = validUsername(data.username);
      if(additionalUsernameError !== undefined) {
        return res.status(400).send(additionalUsernameError);
      }
      const additionalPasswordError = validPassword(data.password);
      if(additionalPasswordError !== undefined) {
        return res.status(400).send(additionalPasswordError);
      }
      try {
        const user = new app.models.User(data);
        await user.save();
        res.status(201).send({ username: user.username, primary_email: user.primary_email });
      } catch (err) {
        console.log(err);
        if(err.keyPattern.username) {
          res.status(400).send({ error: "username already in use" });
        }
        else {
          res.status(400).send({ error: "email address already in use" });
        }
      }
    } catch (err) {
      console.log(err);
      res.status(400).send({ error: err.details[0].message });
    }
  });

  /**
   * See if user exists
   *
   * @param {req.params.username} Username of the user to query for
   * @return {200 || 404}
   */
  app.head("/v1/user/:username", async (req, res) => {
    const username = req.params.username.toLowerCase();
    let user = await app.models.User.findOne({ username: username });
    if (!user) {
      res.status(404).send();
    }
    else {
      res.status(200).send();
    }
  });

  /**
   * Fetch user information
   *
   * @param {req.params.username} Username of the user to query for
   * @return {200, {username, primary_email, first_name, last_name, city, games[...]}}
   */
  app.get("/v1/user/:username", async (req, res) => {
    const username = req.params.username.toLowerCase();
    let user = await app.models.User.findOne({ username: username });
    if (!user) {
      res.status(404).send({ error: "unknown user: foobar" });
    }
    else {
      res.status(200).send({
        username: user.username,
        primary_email: user.primary_email,
        first_name: user.first_name,
        last_name: user.last_name,
        city: user.city,
        games: user.games,
      });
    }
  });

  /**
   * Update a user's profile information
   *
   * @param {req.body.first_name} First name of the user - optional
   * @param {req.body.last_name} Last name of the user - optional
   * @param {req.body.city} City user lives in - optional
   * @return {204, no body content} Return status only
   */
  app.put("/v1/user", (req, res) => {
    // first check if logged in
    let user = req.session.user;
    if(!user) {
      return res.status(401).send({ error: "unauthorized" });
    }

    // then check if requested updates are valid
    const validUpdates = ['first_name', 'last_name', 'city'];
    for(let key in req.body) {
      if(!validUpdates.includes(key)) {
        return res.status(204).send();
      }
    }

    // make updates
    for(let key in req.body) {
      user[key] = req.body[key];
    }
    res.status(204).send();
  });
};
