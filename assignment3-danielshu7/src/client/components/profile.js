"use strict";

import React, { useState, useEffect, Fragment } from "react";
import styled from "styled-components";
import { useParams, Link } from "react-router-dom";
import {GravHash} from "./header.js";

export const ProfileP = styled.p`
  margin: 0.5em 0.25em;
`;

const GameTableRow = ({ game }) => {
  let status = game.active ? "Active" : "Complete";
  let url = game.active ? `/game/${game.id}` : `/results/${game.id}`;

  let startDate = new Date(game.start);
  let date = startDate.toLocaleDateString();
  let time = startDate.toLocaleTimeString();

  return (
    <tr>
      <td><Link to={url}>{status}</Link></td>
      <td>{date}, {time}</td>
      <td>{(game.moves || []).length}</td>
      <td>{game.score}</td>
      <td>{game.game}</td>
    </tr>
  )
}

export const Profile = ({ curUser }) => {
  let params = useParams();
  if(!params.user) return (null); // load nothing if no user profile specified

  const [userInfo, setUserInfo] = useState([]);
  // get user info
  useEffect(
    () => {
      fetch(`/v1/user/${params.user}`)
        .then((data) => data.json())
        .then((data) => setUserInfo(data));
    },
    []
  );
  console.log(userInfo);

  const loggedInAsUser = (params.user === curUser);
  const conditionalEditLink = loggedInAsUser
    ? <div style={{gridArea: "sb / sb / sb / sb"}}>
        <Link to="/edit">Edit Profile</Link>
      </div>
    : null;
  const conditionalStartLink = loggedInAsUser
    ? <Link to="/start" style={{margin: "0 1em 1em 0"}}>Start new game</Link>
    : null;

  return (
    <Fragment>
      {conditionalEditLink}
      <div style={{gridArea: "main / main / main / main"}}>
        <div className={"profile-info"}>
          <img src={GravHash(userInfo.primary_email,200)} className={"pfp"} />
          <div className={"profile-details"}>
            <div className={"profile-cols"} style={{
              alignItems: "flex-end",
              fontWeight: "bold",
            }}>
              <ProfileP>Username:</ProfileP>
              <ProfileP>First Name:</ProfileP>
              <ProfileP>Last Name:</ProfileP>
              <ProfileP>City:</ProfileP>
              <ProfileP>Email Address:</ProfileP>
            </div>
            <div className={"profile-cols"}>
              <ProfileP>{userInfo.username}</ProfileP>
              <ProfileP>{userInfo.first_name}</ProfileP>
              <ProfileP>{userInfo.last_name}</ProfileP>
              <ProfileP>{userInfo.city}</ProfileP>
              <ProfileP>{userInfo.primary_email}</ProfileP>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", margin: "1em" }}>
          <h4 style={{ margin: "0px", flexGrow: "1" }}>
            Games ({(userInfo.games || []).length})
          </h4>
          {conditionalStartLink}
        </div>
        <table style={{ width: "100%", textAlign: "center" }}>
          <thead>
            <tr>
              <th>Status</th>
              <th>Start Date</th>
              <th># of Moves</th>
              <th>Score</th>
              <th>Game Type</th>
            </tr>
          </thead>
          <tbody>
          {
            (userInfo.games || []).map((game) => <GameTableRow key={"game" + game.id} game={game} />)
          }
          </tbody>
        </table>
      </div>
    </Fragment>
  );
}