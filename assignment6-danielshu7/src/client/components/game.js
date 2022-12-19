/* Copyright G. Hemingway, @2022 - All rights reserved */
"use strict";

import React, { useState, useEffect, useRef, Fragment } from "react";
import {useNavigate, useParams} from "react-router-dom";
import styled from "styled-components";
import { Pile } from "./pile.js";
import {ModalNotify} from "./shared.js";

const CardRow = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: flex-start;
  margin-bottom: 2em;
`;

const CardRowGap = styled.div`
  flex-grow: 2;
`;

const GameBase = styled.div`
  grid-row: 2;
  grid-column: sb / main;
`;

const GameContainer = styled.div`
  width: 70%;
  transform: translateX(20%);
`;

const AutoCompleteButton = styled.button`
  width: 10%;
  aspect-ratio: 1;
  background: #e7e43e;
  border: none;
  border-radius: 5px;
  line-height: 2em;
  font-size: 1em;
  font-weight: bold;
  position: absolute;
  transform: translate(20%, 15%);
`;

const EndGameButton = styled.button`
  width: 10%;
  aspect-ratio: 1;
  background: #e73e3e;
  border: none;
  border-radius: 5px;
  line-height: 2em;
  font-size: 1em;
  font-weight: bold;
  position: absolute;
  transform: translate(20%, 130%);
`;

export const Game = (props) => {
  let navigate = useNavigate();
  const { id } = useParams();
  let [state, setState] = useState({
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
  });
  let [drawCount, setDrawCount] = useState(undefined);
  let [selected, setSelected] = useState({
    selectedIndex: null,
    selectedPile: null,
  });
  let [pileToStackMoveExists, setPTSME] = useState(false);
  let [endOfGameDetected, setEOGD] = useState(false);
  let [notify, setNotify] = useState("");

  useEffect(() => {
    const getGameState = async () => {
      const response = await fetch(`/v1/game/${id}`);
      const data = await response.json();
      setState({
        pile1: data.pile1,
        pile2: data.pile2,
        pile3: data.pile3,
        pile4: data.pile4,
        pile5: data.pile5,
        pile6: data.pile6,
        pile7: data.pile7,
        stack1: data.stack1,
        stack2: data.stack2,
        stack3: data.stack3,
        stack4: data.stack4,
        draw: data.draw,
        discard: data.discard,
      });
      setDrawCount(data.drawCount);
    };
    getGameState();
  }, [id]);

  useEffect(() => {
    setPTSME(getLegalPileToStackMove(state) !== null);

    setEOGD(
        getLegalPileToStackMove(state) === null &&
        !checkLegalDrawOrDiscardMove(state) &&
        !checkLegalWholePileMove(state)
    );
  }, [state]);

  useEffect(() => {
    if(endOfGameDetected) {
      setNotify("No more moves detected. You may want to end the game.");
    }
    else {
      setNotify("");
    }
  }, [endOfGameDetected])

  // unselect previously selected cards
  const unselectPrev = () => {
    state[selected.selectedPile].slice(selected.selectedIndex)
      .map(card => card.suit + ":" + card.value) // map to id
      .forEach(imgID => document.getElementById(imgID).classList.remove("selected-card"));
    setSelected({
      selectedIndex: null,
      selectedPile: null,
    });
  };

  // handle key press
  const handleKeyPress = (ev) => {
    // only check for 'ESC' key
    if(ev.key === "Escape") {
      if(selected.selectedPile !== null) {
        unselectPrev(); // unselect previously selected
      }
    }
  }

  const keyPressRef = useRef(handleKeyPress);
  useEffect(() => { keyPressRef.current = handleKeyPress; }); // update each render
  useEffect(() => {
    const keyPressHandler = e => keyPressRef.current(e); // then use most recent cb value
    window.addEventListener("keyup", keyPressHandler);
    return () => {
      window.removeEventListener("keyup", keyPressHandler);
    };
  }, []);

  // helper function for generating requestedMove
  const standardRequestedMove = (srcIndex, srcPile, dstPile, curState = state) => {
    return {
      cards: curState[srcPile]
        .slice(srcIndex)
        .map(({ up, ...rest }) => rest),
        src: srcPile,
      dst: dstPile,
    };
  };

  // send move to server & update accordingly
  // returns new state if successful update, null otherwise
  const sendMoveToServer = async (requestedMove) => {
    console.log(requestedMove);

    // on server side, check move & return new state or error object
    let res = await fetch(`/v1/game/${id}`,{
      method: "PUT",
      body: JSON.stringify({ requestedMove: requestedMove }),
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
    });
    const data = await res.json();
    if (res.ok) {
      setState(data)
      return data;
    } else {
      console.log(data.error)
      return null;
    }
  };

  // handles clicking a card
  const onCardClick = async (ev,pile) => {
    if(!selected.selectedIndex && pile === "draw") {
      // if clicked "draw" pile and nothing selected previously, then draw
      const requestedMove = standardRequestedMove(Math.max(state.draw.length-drawCount,0),"draw","discard");
      await sendMoveToServer(requestedMove);
    }
    else {
      // get target suit, value, and index (in its pile)
      const target = ev.target;
      const [suit,value] = target.id.split(':');
      const checkCard = (card) =>
        card.suit === suit &&
        card.value === value &&
        card.up !== false;
      const index = state[pile].findIndex(checkCard); // -1 if card is facing down

      if(selected.selectedIndex === null && index !== -1) {
        // if face up & nothing selected, select target (get index & pile)
        setSelected({
          selectedIndex: index,
          selectedPile: pile,
        });

        // add selected-card class to target & attached cards
        state[pile].slice(index)
          .map(card => card.suit + ":" + card.value) // map to id
          .forEach(imgID => document.getElementById(imgID).classList.add("selected-card"));
      }
      else if(selected.selectedIndex !== null) {
        // check if selected card is face up & in a different pile
        if(index !== -1 && pile !== selected.selectedPile) {
          const requestedMove = standardRequestedMove(selected.selectedIndex,selected.selectedPile,pile);
          await sendMoveToServer(requestedMove);
        } // otherwise, do nothing more
        unselectPrev(); // unselect previously selected
      }
    }
  };
  //console.log(state)

  // handles clicking empty pile
  const onEmptyPileClick = async (ev, pile) => {
    if(ev.target.childElementCount === 1) {
      if(pile === "draw") {
        // empty draw, so trigger deck restock
        const requestedMove = {
          cards: state["discard"].map(({ up, ...rest }) => rest),
          src: "draw",
          dst: "draw",
        };
        await sendMoveToServer(requestedMove);
      }
      else if(pile !== "discard" && selected.selectedPile !== null) { // either a pile or stack
        const requestedMove = standardRequestedMove(selected.selectedIndex,selected.selectedPile,pile);
        await sendMoveToServer(requestedMove);
      }

      if(selected.selectedPile !== null) {
        unselectPrev(); // unselect previously selected
      }
    }
  };

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
  };

  // gets opposite color suits
  const getOppositeColorSuits = (card) => {
    if(["diamonds","hearts"].includes(card.suit)) {
      return new Set(["clubs","spades"]);
    }
    else {
      return new Set(["diamonds","hearts"]);
    }
  };

  // handles clicking Auto Complete button
  const onAutoCompleteClick = async (ev) => {
    let curState = state;
    while(curState !== null) {
      // get any legal move
      const requestedMove = getLegalPileToStackMove(curState);
      if(requestedMove === null) break;

      // send to server & update curState
      curState = await sendMoveToServer(requestedMove);
    }
    if(selected.selectedIndex !== null) {
      unselectPrev();
    }
  };

  // handles clicking End Game button
  const onEndGameClick = async (ev) => {
    let res = await fetch(`/v1/game/${id}/status`,{
      method: "PUT",
      body: JSON.stringify({ status: "Complete" }),
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
    });
    const data = await res.json();
    if (res.ok) {
      navigate(`/profile/${props.user.username}`);
    } else {
      console.log(data.error)
    }
  };

  // gets the (at most) 4 cards that can be moved onto stacks
  const getValidStackCards = (curState) => {
    let validCards = new Set();
    for(let i = 1; i <= 4; ++i) {
      const stack = "stack" + i;
      const topCard = curState[stack].at(-1);
      if(topCard === undefined) {
        validCards.add({
          value: 1,
          stack: stack,
        })
      }
      else if(topCard.value !== "king") {
        validCards.add({
          suit: topCard.suit,
          value: valueMap[topCard.value] + 1,
          stack: stack,
        });
      }
    }
    return validCards;
  };

  // gets the (at most) 7 cards that can be moved onto piles
  const getValidPileCards = (curState) => {
    let validCards = new Set();
    for(let i = 1; i <= 7; ++i) {
      const pile = "pile" + i;
      const botCard = curState[pile].at(-1);
      if(botCard === undefined) {
        validCards.add({
          value: 13,
          pile: pile,
        })
      }
      else if(botCard.value !== "ace") {
        getOppositeColorSuits(botCard)
            .forEach( suit =>
              validCards.add({
                suit: suit,
                value: valueMap[botCard.value] - 1,
                pile: pile,
              })
            );
      }
    }
    return validCards;
  }

  // checks if there is a legal pile to stack move in current state
  // returns the move, or null if none
  const getLegalPileToStackMove = (curState) => {
    const validCards = getValidStackCards(curState);

    // check bottom cards of piles
    for(let i = 1; i <= 7; ++i) {
      const pile = "pile" + i;
      const botCard = curState[pile].at(-1);
      if(botCard !== undefined) {
        for(let validCard of validCards) {
          if(valueMap[botCard.value] === validCard.value &&
              (!validCard.suit || botCard.suit === validCard.suit)) {
            return standardRequestedMove(-1,pile,validCard.stack,curState);
          }
        }
      }
    }
    return null;
  };

  const checkLegalDrawOrDiscardMove = (curState) => {
    const validCards = new Set([...getValidStackCards(curState), ...getValidPileCards(curState)]);

    // checks every drawCount-th card from the top of draw
    for(let i = curState.draw.length - drawCount; i >= 0; i -= drawCount) {
      const curCard = curState.draw[i];
      for(let validCard of validCards) {
        if(valueMap[curCard.value] === validCard.value &&
            (!validCard.suit || curCard.suit === validCard.suit)) {
          return true;
        }
      }
    }
    // checks every drawCount-th card from the bottom of discard
    for(let i = drawCount - 1; i < curState.discard.length; i += drawCount) {
      const curCard = curState.discard[i];
      for(let validCard of validCards) {
        if(valueMap[curCard.value] === validCard.value &&
            (!validCard.suit || curCard.suit === validCard.suit)) {
          return true;
        }
      }
    }
    // checks every drawCount-th card in draw that would show up after a cycle
    const offset = drawCount - curState.discard.length % drawCount;
    if(offset !== drawCount) {
      for(let i = curState.draw.length - offset; i >= 0; i -= drawCount) {
        const curCard = curState.draw[i];
        for(let validCard of validCards) {
          if(valueMap[curCard.value] === validCard.value &&
              (!validCard.suit || curCard.suit === validCard.suit)) {
            return true;
          }
        }
      }
    }
    // check top of discard
    const topDiscard = curState.discard.at(-1);
    if(topDiscard !== undefined) {
      for(let validCard of validCards) {
        if(valueMap[topDiscard.value] === validCard.value &&
            (!validCard.suit || topDiscard.suit === validCard.suit)) {
          return true;
        }
      }
    }
    // check bottom of draw
    const botDraw = curState.draw[0];
    if(botDraw !== undefined) {
      for(let validCard of validCards) {
        if(valueMap[botDraw.value] === validCard.value &&
            (!validCard.suit || botDraw.suit === validCard.suit)) {
          return true;
        }
      }
    }
    return false;
  };

  const checkLegalWholePileMove = (curState) => {
    const validCards = getValidPileCards(curState);

    // check top face-up cards in piles
    for(let i = 1; i <= 7; ++i) {
      const pile = "pile" + i;
      const topIndex = curState[pile].findIndex(elem => elem.up)
      if(topIndex !== -1) {
        const topCard = curState[pile][topIndex];
        for(let validCard of validCards) {
          if(valueMap[topCard.value] === validCard.value &&
              (!validCard.suit || topCard.suit === validCard.suit) &&
              !(topCard.value === "king" && topIndex === 0)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  // resets notify after accepting
  const onAcceptNotify = (ev) => {
    setNotify("");
  };

  return (
    <Fragment>
      <GameBase>
        <AutoCompleteButton onClick={onAutoCompleteClick} disabled={!pileToStackMoveExists}>
          Auto Complete
        </AutoCompleteButton>
        <EndGameButton onClick={onEndGameClick} disabled={!endOfGameDetected}>
          End Game
        </EndGameButton>
        <GameContainer>
          <CardRow>
            <Pile cards={state.stack1} spacing={0} onBaseClick={ev => onEmptyPileClick(ev,"stack1")} onCardClick={ev => onCardClick(ev,"stack1")} />
            <Pile cards={state.stack2} spacing={0} onBaseClick={ev => onEmptyPileClick(ev,"stack2")} onCardClick={ev => onCardClick(ev,"stack2")} />
            <Pile cards={state.stack3} spacing={0} onBaseClick={ev => onEmptyPileClick(ev,"stack3")} onCardClick={ev => onCardClick(ev,"stack3")} />
            <Pile cards={state.stack4} spacing={0} onBaseClick={ev => onEmptyPileClick(ev,"stack4")} onCardClick={ev => onCardClick(ev,"stack4")} />
            <CardRowGap />
            <Pile cards={state.draw} spacing={0} onBaseClick={ev => onEmptyPileClick(ev,"draw")} onCardClick={ev => onCardClick(ev,"draw")} />
            <Pile cards={state.discard} spacing={0} onBaseClick={ev => onEmptyPileClick(ev,"discard")} onCardClick={ev => onCardClick(ev,"discard")} />
          </CardRow>
          <CardRow>
            <Pile cards={state.pile1} onBaseClick={ev => onEmptyPileClick(ev,"pile1")} onCardClick={ev => onCardClick(ev,"pile1")} />
            <Pile cards={state.pile2} onBaseClick={ev => onEmptyPileClick(ev,"pile2")} onCardClick={ev => onCardClick(ev,"pile2")} />
            <Pile cards={state.pile3} onBaseClick={ev => onEmptyPileClick(ev,"pile3")} onCardClick={ev => onCardClick(ev,"pile3")} />
            <Pile cards={state.pile4} onBaseClick={ev => onEmptyPileClick(ev,"pile4")} onCardClick={ev => onCardClick(ev,"pile4")} />
            <Pile cards={state.pile5} onBaseClick={ev => onEmptyPileClick(ev,"pile5")} onCardClick={ev => onCardClick(ev,"pile5")} />
            <Pile cards={state.pile6} onBaseClick={ev => onEmptyPileClick(ev,"pile6")} onCardClick={ev => onCardClick(ev,"pile6")} />
            <Pile cards={state.pile7} onBaseClick={ev => onEmptyPileClick(ev,"pile7")} onCardClick={ev => onCardClick(ev,"pile7")} />
          </CardRow>
        </GameContainer>
        {notify !== "" ? (
            <ModalNotify
                id="notification"
                msg={notify}
                onAccept={onAcceptNotify}
            />
        ) : null}
      </GameBase>
    </Fragment>
  );
};

Game.propTypes = {};
