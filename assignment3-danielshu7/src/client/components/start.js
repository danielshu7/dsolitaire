"use strict";

import React, { useState } from "react";
import styled from "styled-components";
import { Navigate, useNavigate } from "react-router-dom";

const GameTypeRadio = (props) => (
  <label>
    <input
      type="radio"
      name="game"
      value={props.value}
      checked={props.selectedGameType === props.value}
      onChange={(ev) => props.setGameType(ev.target.value)}
    />
    {props.value}
  </label>
);

const GameSettingSelect = (props) => (
  <div style={{ marginBottom: "1em" }}>
    <label  htmlFor={props.name} style={{ marginRight: "0.5em" }}>{props.label}:</label>
    <select
      id={props.name}
      name={props.name}
      onChange={(ev) => props.setValue(ev.target.value)}
    >
      {
        props.options.map((option) => <option key={"option:" + option}>{option}</option>)
      }
    </select>
  </div>
);

export const Start = ({ curUser }) => {
  if(curUser === null) { // if not logged in, redirect to login page
    return (<Navigate replace to={"/login"}></Navigate>);
  }

  const [selectedGameType, setGameType] = useState("klondike");
  const [draw, setDraw] = useState("Draw 1");
  const [color, setColor] = useState("Red");

  let navigate = useNavigate();
  const handleSubmit = (ev) => {
    ev.preventDefault();
    navigate("/game", { state:{
        game: selectedGameType,
        color: color,
    }});
  };

  return (
    <div style={{
      gridArea: "main / main / main / main",
      margin: "1em",
    }}>
      <h2>Create New Game</h2>
      <form style={{ display: "flex", margin: "1em", }}>
        <div className={"game-types"}>
          <GameTypeRadio value={"klondike"} selectedGameType={selectedGameType} setGameType={setGameType} />
          <GameTypeRadio value={"pyramid"} selectedGameType={selectedGameType} setGameType={setGameType} />
          <GameTypeRadio value={"canfield"} selectedGameType={selectedGameType} setGameType={setGameType} />
          <GameTypeRadio value={"golf"} selectedGameType={selectedGameType} setGameType={setGameType} />
          <GameTypeRadio value={"yukon"} selectedGameType={selectedGameType} setGameType={setGameType} />
          <GameTypeRadio value={"hearts"} selectedGameType={selectedGameType} setGameType={setGameType} />
        </div>
        <div className={"game-settings"}>
          <GameSettingSelect
            label={"Draw"}
            name={"draw"}
            setValue={setDraw}
            options={["Draw 1", "Draw 3"]}
          />
          <GameSettingSelect
            label={"Card Color"}
            name={"color"}
            setValue={setColor}
            options={["Red", "Green", "Blue", "Magical"]}
          />
        </div>
      </form>
      <button id="startBtn" className={"form-button"} onClick={handleSubmit}>Start</button>
    </div>
  );
};