/* Copyright G. Hemingway, @2022 - All rights reserved */
"use strict";

import "./base.css";
import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { Header } from "./components/header.js";
import { Landing } from "./components/landing.js";
/*** Add these back in as you build support ***/
import { Login } from "./components/login.js";
import { Logout } from "./components/logout.js";
import { Register } from "./components/register.js";
import { Profile } from "./components/profile.js";
import { Start } from "./components/start.js";
import { Results } from "./components/results.js";
import { Game } from "./components/game.js";

const defaultUser = {
  username: "",
  first_name: "",
  last_name: "",
  primary_email: "",
  city: "",
  games: [],
};

/***
 * Main application entry point
 * @returns {JSX.Element}
 * @constructor
 */
const MyApp = () => {
  // Think about state for the overall application...
  const [curUser, setUser] = useState(localStorage.getItem("curUser"));

  // Helper to manage what happens when the user logs in
  const logIn = async (username) => {
    localStorage.setItem("curUser", username);
    setUser(username);
  };

  // Helper for when a user logs out
  const logOut = () => {
    localStorage.removeItem("curUser");
    setUser(null);
  };

  return (
    <BrowserRouter>
      <div className={"page-container"}>
        <Header curUser={curUser}/>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login logIn={logIn}/>} />
          <Route path="/logout" element={<Logout logOut={logOut} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:user" element={<Profile curUser={curUser} />} />
          <Route path="/start" element={<Start curUser={curUser} />} />
          <Route path="/results" element={<Results />} />
          <Route path="/results/:id" element={<Results />} />
          <Route path="/game" element={<Game />} />
          <Route path="/game/:id" element={<Game />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

const root = createRoot(document.getElementById("mainDiv"));
root.render(<MyApp />);
