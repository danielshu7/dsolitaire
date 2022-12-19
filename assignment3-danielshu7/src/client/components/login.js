"use strict";

import React, { useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";

export const FormInputPair = (props) => (
  <Fragment>
    <label htmlFor={props.name} className={"form-label"}>{props.label}:</label>
    <input
      id={props.name}
      name={props.name}
      type={props.type}
      placeholder={props.label}
      className={"form-input"}
      value={props.value}
      onChange={(ev) => props.handleChange(ev,props.setValue)} />
  </Fragment>
)

export const Login = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  let navigate = useNavigate();
  const handleSubmit = (ev) => {
    ev.preventDefault();
    fetch("/v1/session", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      })
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        else {
          let err = new Error("Login Error");
          err.code = response.status;
          throw err;
        }
      })
      .then((data) => {
        props.logIn(data.username);
        let url = "/profile/" + data.username;
        navigate(url);
      })
      .catch((error) => {
        if(error.code === 400) {
          setErrorMsg("Error: Please enter a username and password.");
        }
        else if(error.code === 401) {
          setErrorMsg("Error: Username and password do not match.");
        }
        else {
          setErrorMsg("An unknown error has occurred.");
        }
        console.log(errorMsg);
      });
  };

  const handleChange = (ev, setValue) => {
    setValue(ev.target.value);
  };

  return (
    <div style={{gridArea: "main / main / main / main"}}>
      <h1>Login Page!</h1>
      <form className={"form"}>
        <FormInputPair label={"Username"} name={"username"} value={username} setValue={setUsername} type={"text"} handleChange={handleChange} />
        <FormInputPair label={"Password"}  name={"password"} value={password} setValue={setPassword} type={"password"} handleChange={handleChange} />
        <div></div>
        <button id="submitBtn" className={"form-button"} onClick={handleSubmit}>Login</button>
      </form>
      <div style={{ color: "red" }}>{errorMsg}</div>
    </div>
  );
}