/* Copyright G. Hemingway, @2022 - All rights reserved */
"use strict";

const Joi = require("joi");
const {
  initialState,
  shuffleCards,
  filterGameForProfile,
  filterMoveForResults,
  validateMove,
} = require("../../solitare.cjs");

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
    if (!req.session.user)
      return res.status(401).send({ error: "unauthorized" });

    // Schema for user info validation
    const schema = Joi.object({
      game: Joi.string().lowercase().required(),
      color: Joi.string().lowercase().required(),
      draw: Joi.any(),
    });
    // Validate user input
    try {
      const data = await schema.validateAsync(req.body, { stripUnknown: true });
      // Set up the new game
      let newGame = {
        owner: req.session.user._id,
        active: true,
        cards_remaining: 52,
        color: data.color,
        game: data.game,
        score: 0,
        start: Date.now(),
        winner: "",
        state: [],
      };
      switch (data.draw) {
        case "Draw 1":
          newGame.drawCount = 1;
          break;
        case "Draw 3":
          newGame.drawCount = 3;
          break;
        default:
          newGame.drawCount = 1;
      }
      console.log(newGame);
      // Generate a new initial game state
      newGame.state = initialState();
      let game = new app.models.Game(newGame);
      try {
        await game.save();
        const query = { $push: { games: game._id } };
        // Save game to user's document too
        await app.models.User.findByIdAndUpdate(req.session.user._id, query);
        res.status(201).send({ id: game._id });
      } catch (err) {
        console.log(`Game.create save failure: ${err}`);
        res.status(400).send({ error: "failure creating game" });
        // TODO: Much more error management needs to happen here
      }
    } catch (err) {
      console.log(err);
      const message = err.details[0].message;
      console.log(`Game.create validation failure: ${message}`);
      res.status(400).send({ error: message });
    }
  });

  /**
   * Fetch game information
   *
   * @param (req.params.id} Id of game to fetch
   * @return {200} Game information
   */
  app.get("/v1/game/:id", async (req, res) => {
    try {
      let game = await app.models.Game.findById(req.params.id);
      if (!game) {
        res.status(404).send({ error: `unknown game: ${req.params.id}` });
      } else {
        const state = game.state.toJSON();
        let results = filterGameForProfile(game);
        results.start = Date.parse(results.start);
        results.cards_remaining =
          52 -
          (state.stack1.length +
            state.stack2.length +
            state.stack3.length +
            state.stack4.length);
        // Do we need to grab the moves
        if (req.query.moves === "") {
          const moves = await app.models.Move.find({ game: req.params.id });
          state.moves = moves.map((move) => filterMoveForResults(move));
        }
        res.status(200).send(Object.assign({ drawCount: game.drawCount }, results, state));
      }
    } catch (err) {
      console.log(`Game.get failure: ${err}`);
      res.status(404).send({ error: `unknown game: ${req.params.id}` });
    }
  });

  // Provide end-point to request shuffled deck of cards and initial state - for testing
  app.get("/v1/cards/shuffle", (req, res) => {
    res.send(shuffleCards(false));
  });
  app.get("/v1/cards/initial", (req, res) => {
    res.send(initialState());
  });

  /**
   * Get new game state after requested move
   *
   * @param (req.params.id} Id of game to fetch
   * @param {req.body.requestedMove} requested move in game
   *
   * @return {200} Game state
   * @return {400} Illegal move error message
   */
  app.put("/v1/game/:id", async (req, res) => {
    // validate requestedMove
    const CardStateSchema = Joi.object({
      suit: Joi.string().required(),
      value: Joi.string().required(),
    })
    const MoveSchema = Joi.object({
      cards: Joi.array().items(CardStateSchema).required(),
      src: Joi.string().required(),
      dst: Joi.string().required(),
    });
    try {
      const requestedMove = await MoveSchema.validateAsync(req.body.requestedMove);
      try {
        let game = await app.models.Game.findById(req.params.id);
        if (!game) {
          res.status(404).send({ error: `unknown game: ${req.params.id}` });
        }
        else if(!req.session.user) {
          res.status(401).send({ error: "not logged in" });
        }
        else if(req.session.user._id !== game.owner.toString()) {
          res.status(401).send({ error: "not logged in as owner" });
        }
        else {
          // validate the requested move
          const origState = game.state;
          let validated = await validateMove(origState.toJSON(),requestedMove);
          let status;
          if(!validated.error) {
            // update game state
            game.state = validated
            try { // try to save
              await game.save();
            } catch (err) {
              console.log(`Game.create save failure: ${err}`);
              return res.status(400).send({ error: "failure updating game" });
            }

            // save move
            let newMove = {
              user: req.session.user._id,
              game: game._id,
              cards: requestedMove.cards,
              src: requestedMove.src,
              dst: requestedMove.dst,
              date: Date.now(),
            };
            let move = new app.models.Move(newMove);
            try {
              await move.save();
            } catch (err) {
              console.log(`Move.create save failure: ${err}`);
              // revert any state changes
              game.state = origState;
              try { // try to save
                await game.save();
              } catch (err) {
                console.log(`Game.create save failure: ${err}`);
                return res.status(400).send({ error: "failure updating game" });
              }
              return res.status(400).send({ error: "failure creating move" });
            }

            // set status
            status = 201
          }
          else {
            status = 400;
          }
          res.status(status).send(validated);
        }
      } catch (err) {
        console.log(`${err}`);
        res.status(404).send({ error: `error getting game or user` });
      }
    }
    catch (err) {
      console.log(err);
      const message = err.details[0].message;
      console.log(`Session.login validation failure: ${message}`);
      res.status(400).send({ error: message });
    }

  });
};
