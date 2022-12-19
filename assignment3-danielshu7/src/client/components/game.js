"use strict";

import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

const CardImg = styled.img`
  position: absolute;
  height: auto;
  width: 100%;
  left: 0%;
`;

const CardHolder = (props) => {
  return (
    <div className={"card-holder"}>
      <div style={{marginTop: "140%"}} />
      {
        props.cardsList.map((card,i) => {
          const top = props.pile ? (i*8 + "%") : "0%";
          const src = card.up
            ? "/images/" + card.value + "_of_" + card.suit + ".png"
            : "/images/face_down.jpg";

          return (
            <CardImg
              src={src}
              key={card.suit + card.value}
              style={{top: top}}
            />
          )
        })
      }
    </div>
  );
};


export const Game = () => {
  const params = useParams();
  const { state } = useLocation();
  const [deck, setDeck] = useState({});

  // load nothing if no game id and no location state (reached only when directly going to "/game")
  if(!params.id && !state) return (null);

  let navigate = useNavigate();
  useEffect(
    () => {
      // get Promise of id
      let idPromise = params.id
        ? Promise.resolve({ id: params.id })
        : fetch("/v1/game", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            game: state.game,
            color: state.color,
          })
        })
          .then((data) => data.json())
          .then((data) => {
            let url = "/game/" + data.id;
            navigate(url, { replace: true });
            return data;
          });

      // get game data
      idPromise.then((data) => fetch(`/v1/game/${data.id}`))
        .then((data) => data.json())
        .then((data) => setDeck(data)
        );
    },
    []
  );
  console.log(deck);

  return (
    <div className={"game-container"}>
      <div className={"game-row"}>
        <CardHolder cardsList={[]} />
        <CardHolder cardsList={[]} />
        <CardHolder cardsList={[]} />
        <CardHolder cardsList={[]} />
        <div style={{flexGrow: 2}}/>
        <CardHolder cardsList={deck.draw || []} pile={false}/>
        <CardHolder cardsList={[]} />
      </div>
      <div className={"game-row"}>
        <CardHolder cardsList={deck.pile1 || []} pile={true}/>
        <CardHolder cardsList={deck.pile2 || []} pile={true}/>
        <CardHolder cardsList={deck.pile3 || []} pile={true}/>
        <CardHolder cardsList={deck.pile4 || []} pile={true}/>
        <CardHolder cardsList={deck.pile5 || []} pile={true}/>
        <CardHolder cardsList={deck.pile6 || []} pile={true}/>
        <CardHolder cardsList={deck.pile7 || []} pile={true}/>
      </div>
    </div>
  );
};