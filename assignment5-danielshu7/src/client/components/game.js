/* Copyright G. Hemingway, @2022 - All rights reserved */
"use strict";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { Pile } from "./pile.js";

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

export const Game = () => {
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
  // let [startDrag, setStartDrag] = useState({ x: 0, y: 0 });

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
  const standardRequestedMove = (srcIndex, srcPile, dstPile) => {
    return {
      cards: state[srcPile]
        .slice(srcIndex)
        .map(({ up, ...rest }) => rest),
        src: srcPile,
      dst: dstPile,
    };
  };

  // send move to server & update accordingly
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
    } else {
      console.log(data.error)
    }
  };

  // handles clicking a card
  const onCardClick = async (ev,pile) => {
    if(!selected.selectedIndex && pile === "draw") {
      // if clicked "draw" pile and nothing selected previously, then draw
      const requestedMove = standardRequestedMove(state.draw.length-drawCount,"draw","discard");
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

  return (
    <GameBase>
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
    </GameBase>
  );
};

Game.propTypes = {};
