/* Copyright G. Hemingway, @2022 - All rights reserved */
"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CardState = require("./card_state.cjs");

/* Schema for an individual move of Klondike */
const Move = new Schema({
  /* Your schema here... */
  user: { type: String, required: true },
  card_before: { type: CardState },
  card_after: { type: CardState },
  duration: { type: Number, default: 0},
});

Move.pre("validate", function (next) {
  this.start = Date.now();
  this.user = this.user.replace(/<(?:.|\n)*?>/gm, ''); // sanitize
  next();
});

module.exports = mongoose.model("Move", Move);
