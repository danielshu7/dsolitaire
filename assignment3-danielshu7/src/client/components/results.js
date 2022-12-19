"use strict";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useParams } from "react-router-dom";
import { ProfileP } from "./profile.js";

const ResultsTableRow = ({ turn }) => {
  let id = i+1;

  return (
    <tr>
      <td>{id}</td>
      <td>{turn.duration} seconds</td>
      <td>{turn.player}</td>
      <td>{turn.move}</td>
    </tr>
  )
};

export const Results = () => {
  let params = useParams();
  const [game, setGame] = useState({});

  if(!params.id) return (null); // load nothing if no game id specified

  useEffect(
    () => {
      // get game data
      fetch(`/v1/game/${params.id}`)
        .then((data) => data.json())
        .then((data) => setGame(data));
    },
    []
  );

  return (
    <div style={{gridArea: "main / main / main / main"}}>
      <h4>Game Detail</h4>
      <div className={"profile-details"}>
        <div className={"profile-cols"} style={{
          alignItems: "flex-end",
          fontWeight: "bold",
        }}>
          <ProfileP>Duration:</ProfileP>
          <ProfileP>Number of Moves:</ProfileP>
          <ProfileP>Points:</ProfileP>
          <ProfileP>Cards Remaining:</ProfileP>
          <ProfileP>Able to Move:</ProfileP>
        </div>
        <div className={"profile-cols"}>
          <ProfileP>{game.duration || (Date.now() - game.start) / 1000} seconds</ProfileP>
          <ProfileP>{(game.moves || []).length}</ProfileP>
          <ProfileP>{game.score}</ProfileP>
          <ProfileP>{game.cards_remaining}</ProfileP>
          <ProfileP>{game.active ? "Active" : "Complete"}</ProfileP>
        </div>
      </div>
      <table className={"results-table"}>
        <thead>
        <tr>
          <th>Id</th>
          <th>Duration</th>
          <th>Player</th>
          <th>Move Details</th>
        </tr>
        </thead>
        <tbody>
        {
          (game.moves || []).map((turn,i) => <ResultsTableRow key={"turn" + (i+1)} turn={turn} />)
        }
        </tbody>
      </table>
    </div>
  );
};