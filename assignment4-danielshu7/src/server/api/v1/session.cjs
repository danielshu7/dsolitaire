/* Copyright G. Hemingway, @2022 - All rights reserved */
"use strict";

const Joi = require("joi");

module.exports = (app) => {
  /**
   * Log a user in
   *
   * @param {req.body.username} Username of user trying to log in
   * @param {req.body.password} Password of user trying to log in
   * @return { 200, {username, primary_email} }
   */
  app.post("/v1/session", async (req, res) => {
    /*......*/
    const schema = Joi.object({
      username: Joi.string().lowercase().alphanum().min(3).required(),
      password: Joi.string().min(8).required(),
    });
    try {
      let data = await schema.validateAsync(req.body);
      let user = await app.models.User.findOne({ username: data.username });
      if (!user) {
        return res.status(401).send({ error: `unauthorized` });
      }
      if (await user.authenticate(data.password)) {
        req.session.regenerate(() => {
          req.session.user = user;
          return res.status(200).send({ username: user.username, primary_email: user.primary_email });
        });
      } else {
        return res.status(401).send({ error: "unauthorized" });
      }
    } catch (err) {
      console.log(err);
      res.status(400).send({ error: err.details[0].message });
    }
  });

  /**
   * Log a user out
   *
   * @return { 204 if was logged in, 200 if no user in session }
   */
  app.delete("/v1/session", async (req, res) => {
    if(req.session.user) {
      req.session.regenerate(() => {
        req.session.user = null;
        res.status(204).send();
      });
    }
    else {
      res.status(200).send();
    }
  });
};
