/* Copyright G. Hemingway, @2022 - All rights reserved */
"use strict";

export const validPassword = (password) => {
  if (!password.match(/[0-9]/i)) {
    return { error: "Password must contain a number" };
  } else if (!password.match(/[a-z]/)) {
    return { error: "Password must contain a lowercase letter" };
  } else if (!password.match(/\@|\!|\#|\$|\%|\^/i)) {
    return { error: "Password must contain @, !, #, $, % or ^" };
  } else if (!password.match(/[A-Z]/)) {
    return { error: "Password must contain an uppercase letter" };
  }
  return undefined;
};

export const validUsername = (username) => {
  const reservedWords = ['password'];
  if (reservedWords.includes(username)) {
    return { error: "invalid username" };
  }
  return undefined;
};

export const validGame = (game) => {
  const knownGames = ['klondike','pyramid','canfield','golf','yukon','hearts'];
  if (!knownGames.includes(game)) {
    return { error: "failure creating game" };
  }
  return undefined;
}
