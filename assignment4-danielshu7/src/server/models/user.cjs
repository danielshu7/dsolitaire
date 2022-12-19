/* Copyright G. Hemingway, @2022 - All rights reserved */
"use strict";

const crypto = require("crypto");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const makeSalt = () => Math.round(new Date().valueOf() * Math.random()) + "";

const encryptPassword = (salt, password) =>
  crypto.createHmac("sha512", salt).update(password).digest("hex");

const User = new Schema({
  username: { type: String, required: true, index: { unique: true } },
  first_name: { type: String, default: "" },
  last_name: { type: String, default: "" },
  primary_email: { type: String, required: true, unique: true},
  city: { type: String, default: "" },
  games: { type: Array, default: [] },
  hash: { type: String, required: true },
  salt: { type: String, required: true },
});

User.virtual("password").set(function (password) {
  this.salt = makeSalt();
  this.hash = encryptPassword(this.salt, password);
});

User.method("authenticate", function (plainText) {
  return encryptPassword(this.salt, plainText) === this.hash;
});

module.exports = mongoose.model("User", User);
