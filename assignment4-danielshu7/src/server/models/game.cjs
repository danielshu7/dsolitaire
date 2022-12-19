/* Copyright G. Hemingway, @2022 - All rights reserved */
"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CardState = require("./card_state.cjs");

/* Schema for overall game - not completely Klondike specific */
const Game = new Schema({
  owner: { type: Schema.ObjectId, ref: "User", required: true },
  /* Your code goes here... */
  game: { type: String, required: true },
  color: { type: String, required: true },
  draw: { type: String, default: "" },
  cur_state: { type: Array, default: [] },
  num_moves: { type: Number, default: 0 },
  moves: { type: Array, default: [] },
  score: { type: Number, default: 0 },
  start_date: { type: Date },
  status: { type: String, default: "" },
});

Game.pre("validate", function (next) {
  /* Put your validation here ... */
  this.start_date = Date.now();
  // Sanitize strings
  for(let key in this) {
    if(key.type === String) {
      this[key] = this[key].replace(/<(?:.|\n)*?>/gm, '');
    }
  }
  next();
});

module.exports = mongoose.model("Game", Game);
