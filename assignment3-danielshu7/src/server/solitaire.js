/* Copyright G. Hemingway, @2022 - All rights reserved */
"use strict";

import { v4 as uuidv4 } from 'uuid';

export const shuffleCards = (includeJokers = false) => {
  /* Return an array of 52 cards (if jokers is false, 54 otherwise). Carefully follow the instructions in the README */

  // HELPER FUNCTIONS //
  // uses randomly assigned sort keys (effectively shuffles) to perform Schwartzian transform
  const randomSort = (unshuffledArray) => {
    return unshuffledArray
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)
  }
  // maps an integer to its corresponding card
  const intToCard = (i) => {
    let card;
    // check jokers first
    if(i === 52) {
      card = {
        "suit": null,
        "value": "red joker"
      };
    }
    else if(i === 53) {
      card = {
        "suit": null,
        "value": "black joker"
      };
    }
    else {
      // handle all other cards
      const suitMap = {
        0: "clubs",
        1: "diamonds",
        2: "hearts",
        3: "spades",
      };
      const valueMap = {
        1: "ace",
        2: "2",
        3: "3",
        4: "4",
        5: "5",
        6: "6",
        7: "7",
        8: "8",
        9: "9",
        10: "10",
        11: "jack",
        12: "queen",
        13: "king",
      };
      const suitKey = Math.floor(i / 13);
      const valueKey = i % 13 + 1;

      card = {
        suit: suitMap[suitKey],
        value: valueMap[valueKey],
      };
    }
    return card;
  }

  // SHUFFLE //
  // generate array of integers, shuffle, and then map to cards
  const n = includeJokers ? 54 : 52;
  let unshuffledIntegerArray = Array.from(Array(n).keys());
  let shuffled = randomSort(unshuffledIntegerArray);
  let deck = shuffled.map(intToCard);
  return deck;
};

export const initialState = () => {
  /* Use the above function.  Generate and return an initial state for a game */
  let deck = shuffleCards();
  let state = {
    id: uuidv4(), // random id
  }

  // set up piles
  let curIndex = 0;
  for(let i = 1; i <= 7; ++i) {
    let key = "pile" + i;
    let cardsInPile = [];
    for(let j = 0; j < i; ++j) {
      let card = deck[curIndex];
      card.up = (j === i-1); // face-up card is last in list
      cardsInPile.push(card);
      ++curIndex;
    }
    state[key] = cardsInPile;
  }

  // initialize empty stacks
  state.stack1 = [];
  state.stack2 = [];
  state.stack3 = [];
  state.stack4 = [];

  // remaining cards go in draw
  state.draw = deck.slice(curIndex).map(card => {
    card.up = false;
    return card;
  });

  // initialize empty discard
  state.discard = [];

  return state;
};
