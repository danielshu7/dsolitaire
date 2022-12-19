/* Copyright G. Hemingway, @2022 - All rights reserved */
"use strict";

const mongoose = require("mongoose");
const Joi = require("joi");
const { initialState, shuffleCards } = require("../../solitare.cjs");
const sharedPromise = import("../../../shared/index.js");

module.exports = (app) => {
  /**
   * Create a new game
   *
   * @param {req.body.game} Type of game to be played
   * @param {req.body.color} Color of cards
   * @param {req.body.draw} Number of cards to draw
   * @return {201 with { id: ID of new game }}
   */
  app.post("/v1/game", async (req, res) => {
    // first check if logged in
    console.log(res.session);
    if(!req.session.user) {
      return res.status(401).send({ error: "unauthorized" });
    }

    const { validGame } = await sharedPromise;
    const schema = Joi.object({
      game: Joi.string().lowercase().required(),
      draw: Joi.string().required(),
      color: Joi.string().required(),
    });
    try {
      // validate
      let data = await schema.validateAsync(req.body);
      const additionalGameError = validGame(data.game);
      if(additionalGameError !== undefined) {
        return res.status(400).send(additionalGameError);
      }
      // save data
      data.owner = req.session.user._id;
      const game = new app.models.Game(data);
      await game.save();
      res.status(201).send({ id: game._id });
    }
    catch (err) {
      res.status(400).send({ error: err.details[0].message });
    }
  });

  /**
   * Fetch game information
   *
   * @param (req.params.id} Id of game to fetch
   * @return {200} Game information
   */
  app.get("/v1/game/:id", async (req, res) => {
    const gameID = req.params.id.toLowerCase();
    // first check if id is a valid ObjectID
    if(!mongoose.Types.ObjectId.isValid(gameID)) {
      return res.status(404).send({ error: `unknown game: ${gameID}` });
    }

    // try to get game by ObjectID
    let game = await app.models.Game.findById(gameID);
    if (!game) { // then check if the game exists
      res.status(404).send({ error: `unknown game: ${gameID}` });
    }
    else { // if everything is fine, return game info
      res.status(200).send({
        owner: game.owner,
        id: game._id,
        color: game.color,
        draw: game.draw,
        cur_state: game.cur_state,
        num_moves: game.num_moves,
        moves: game.moves,
        score: game.score,
        start_date: game.start_date,
        status: game.status,
      });
    }
  });

  // Provide end-point to request shuffled deck of cards and initial state - for testing
  app.get("/v1/cards/shuffle", (req, res) => {
    res.send(shuffleCards(false));
  });
  app.get("/v1/cards/initial", (req, res) => {
    res.send(initialState());
  });
};
