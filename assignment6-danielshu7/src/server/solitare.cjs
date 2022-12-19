/* Copyright G. Hemingway, @2022 - All rights reserved */
"use strict";

const shuffleCards = (includeJokers = false) => {
  /* Return an array of 52 cards (if jokers is false, 54 otherwise). Carefully follow the instructions in the README */
  let cards = [];
  ["spades", "clubs", "hearts", "diamonds"].forEach((suit) => {
    ["ace", 2, 3, 4, 5, 6, 7, 8, 9, 10, "jack", "queen", "king"].forEach(
      (value) => {
        cards.push({ suit: suit, value: value });
      }
    );
  });
  // Add in jokers here
  if (includeJokers) {
    /*...*/
  }
  // Now shuffle
  let deck = [];
  while (cards.length > 0) {
    // Find a random number between 0 and cards.length - 1
    const index = Math.floor(Math.random() * cards.length);
    deck.push(cards[index]);
    cards.splice(index, 1);
  }
  return deck;
};

const initialState = () => {
  /* Use the above function.  Generate and return an initial state for a game */
  let state = {
    pile1: [],
    pile2: [],
    pile3: [],
    pile4: [],
    pile5: [],
    pile6: [],
    pile7: [],
    stack1: [],
    stack2: [],
    stack3: [],
    stack4: [],
    draw: [],
    discard: [],
  };

  // Get the shuffled deck and distribute it to the players
  const deck = shuffleCards(false);
  // Setup the piles
  for (let i = 1; i <= 7; ++i) {
    let card = deck.splice(0, 1)[0];
    card.up = true;
    state[`pile${i}`].push(card);
    for (let j = i + 1; j <= 7; ++j) {
      card = deck.splice(0, 1)[0];
      card.up = false;
      state[`pile${j}`].push(card);
    }
  }
  // Finally, get the draw right
  state.draw = deck.map((card) => {
    card.up = false;
    return card;
  });
  return state;
};

const filterGameForProfile = (game) => ({
  active: game.active,
  score: game.score,
  won: game.won,
  id: game._id,
  game: "klondike",
  start: game.start,
  moves: game.moves,
  winner: game.winner,
});

const filterMoveForResults = (move) => ({
  ...move,
});

const validateMove = (currentState, requestedMove) => {
  let cards = requestedMove.cards;
  const src = requestedMove.src;
  const dst = requestedMove.dst;

  if(cards[0] === undefined) {
    if(src === "draw") {
      return { error: "no cards remaining in draw and discard" };
    }
    else {
      return { error: "moved too fast, please try again" };
    }
  }

  const getPileType = (pile) => {
    if(pile === "discard") return "discard";
    else if(pile === "draw") return "draw";
    else return pile.substring(0, pile.length - 1);
  };
  const srcType = getPileType(src);
  const dstType = getPileType(dst);

  // get suit, value, index of first card to move
  const srcSuit = cards[0].suit;
  const srcValue = cards[0].value;
  const checkCard = (card) =>
    card.suit === srcSuit &&
    card.value === srcValue;
  const index = currentState[src].findIndex(checkCard);

  // get suit, value of card in dst if exists
  let dstSuit, dstValue;
  const dstLength = currentState[dst].length;
  if(dstLength > 0) {
    dstSuit = currentState[dst][dstLength-1].suit;
    dstValue = currentState[dst][dstLength-1].value;
  }

  // value map
  const valueMap = {
    "ace": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    "jack": 11,
    "queen": 12,
    "king": 13,
  }

  // check illegal moves by dst
  if(dstType === "draw") {
    if(srcType !== "draw") {
      return { error: "cannot move to draw pile" };
    }
  }
  else if(dstType === "discard") {
    if(srcType !== "draw") {
      return { error: "cannot move from tableau pile or foundation stack to discard pile" };
    }
  }
  else if(dstType === "pile") {
    const redSuits = new Set(["diamonds","hearts"]);
    const blackSuits = new Set(["clubs","spades"]);
    // check if dst is empty
    if(dstSuit) {
      if(redSuits.has(srcSuit) && redSuits.has(dstSuit) ||
        blackSuits.has(srcSuit) && blackSuits.has(dstSuit)
      ) {
        return { error: "cards in tableau piles must alternate colors" };
      }
      else if(valueMap[dstValue] !== valueMap[srcValue] + 1) {
        return { error: "cards in tableau piles must descend by 1" };
      }
    }
    else if(srcValue !== "king") {
      return { error: "only kings can be moved onto empty tableau piles" };
    }
  }
  else if(dstType === "stack") {
    if(index !== currentState[src].length - 1) {
      return { error: "can only move the bottommost card of a pile onto a foundation stack" };
    }

    // check if dst is empty
    if(dstSuit) {
      if(dstSuit !== srcSuit) {
        return { error: "cards in foundation stacks must be of the same suit" };
      }
      else if(valueMap[dstValue] !== valueMap[srcValue] - 1) {
        return { error: "cards in foundation stacks must ascend by 1" };
      }
    }
    else if(srcValue !== "ace") {
      return { error: "only aces can be moved onto empty foundation stacks" };
    }
  }
  else {
    return { error: `destination pile ${dstType} does not exist` };
  }

  // make the move
  const up = dstType !== "draw";
  cards = cards.map(card => {
    return {
      ...card,
      up: up,
    };
  });
  if(dstType === "discard" || dstType === "draw") {
    cards = cards.reverse();
  }
  let newState = {
    ...currentState,
    [src]: currentState[src].slice(0,index),
    [dst]: currentState[dst].concat(cards),
  };
  if(dstType === "draw") {
    newState.discard = [];
  }
  if(index > 0 && srcType === "pile") {
    newState[src].splice(-1, 1,
      {
        ...newState[src][index-1],
        up: true,
      }
    );
  }
  return newState;
};

module.exports = {
  shuffleCards: shuffleCards,
  initialState: initialState,
  filterGameForProfile: filterGameForProfile,
  filterMoveForResults: filterMoveForResults,
  validateMove: validateMove,
};
