"use strict";

import React, { useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { FormInputPair } from "./login.js";

export const Register = () => {
  // form elements
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // error state
  const [submitErrorMsg, setSubmitErrorMsg] = useState(null);
  const [usernameErrorMsg, setUsernameErrorMsg] = useState(null);
  const [emailErrorMsg, setEmailErrorMsg] = useState(null);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState(null);

  // form success tracker
  const [formSuccess, setFormSuccess] = useState(false);

  // form handler
  let navigate = useNavigate();
  let responseOk;
  const handleSubmit = (ev) => {
    ev.preventDefault();
    fetch("/v1/user", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
        first_name: firstName,
        last_name: lastName,
        city: city,
        primary_email: email,
      })
    })
      .then((response) => {
        responseOk = response.ok;
        return response.json();
      })
      .then((response) => {
        if (responseOk) {
          setFormSuccess(true);
          // navigate("/login");
          console.log("success");
        }
        else {
          console.log(response)
          let err = new Error("Registration Error");
          err.msg = response.error;
          throw err;
        }
      })
      .catch((error) => {
        setSubmitErrorMsg("Error: " + error.msg);
      });
  };

  // input monitoring onChange
  const handleChangeDefault = (ev, setValue) => {
    setValue(ev.target.value);
    setSubmitErrorMsg(null);
  };

  const handleChangeUsername = (ev) => {
    setUsername(ev.target.value);
    setSubmitErrorMsg(null);

    if(ev.target.value.length <= 2 || ev.target.value.length >= 16) {
      setUsernameErrorMsg("Error: Username length must be > 2 and < 16.");
    }
    else {
      setUsernameErrorMsg(null);
    }
  }

  const handleChangeEmail = (ev) => {
    setEmail(ev.target.value);
    setSubmitErrorMsg(null);

    if(!ev.target.value.match(/^\S+@\S+\.\S+$/)) {
      setEmailErrorMsg("Error: email must contain an '@' followed by an '.'")
    }
    else {
      setEmailErrorMsg(null);
    }
  }

  const handleChangePassword = (ev) => {
    const curPass = ev.target.value;
    setPassword(curPass);
    setSubmitErrorMsg(null);

    if(curPass.length < 8) {
      setPasswordErrorMsg("Error: password must be at least length 8.")
    }
    else if(!/\d/.test(curPass)) {
      setPasswordErrorMsg("Error: password must contain a number.");
    }
    else if(!/[!@#$%^]/.test(curPass)) {
      setPasswordErrorMsg("Error: password must contain @, !, #, $, % or ^.");
    }
    else if(!/[A-Z]/.test(curPass)) {
      setPasswordErrorMsg("Error: password must contain a capital letter.");
    }
    else {
      setPasswordErrorMsg(null);
    }
  }

  // successful registration proceed button handler
  const handleRegisterProceed = (ev) => {
    ev.preventDefault();
    navigate("/login");
  }

  // render variables
  let submitDisabled =
    (usernameErrorMsg !== null) ||
    (emailErrorMsg !== null) ||
    (passwordErrorMsg !== null);

  let fullErrorMsg =
    (submitErrorMsg !== null ? submitErrorMsg + "\n" : "") +
    (usernameErrorMsg !== null ? usernameErrorMsg + "\n" : "") +
    (emailErrorMsg !== null ? emailErrorMsg + "\n" : "") +
    (passwordErrorMsg !== null ? passwordErrorMsg + "\n" : "");

  let notification = formSuccess
    ? <div className={"register-notification"}>
        <div className={"notification-body"}>
          <p>{username} registered. You will now need to log in.</p>
          <button className={"form-button"} onClick={handleRegisterProceed} >Ok</button>
        </div>
      </div>
    : null;

  return (
    <div style={{gridArea: "main / main / main / main"}}>
      {notification}
      <h1>Register Below:</h1>
      <form className={"form"}>
        <FormInputPair label={"Username"} name={"username"} value={username} type={"text"} handleChange={handleChangeUsername} />
        <FormInputPair label={"First Name"} name={"first_name"} value={firstName} setValue={setFirstName} type={"text"} handleChange={handleChangeDefault} />
        <FormInputPair label={"Last Name"}  name={"last_name"} value={lastName} setValue={setLastName} type={"text"} handleChange={handleChangeDefault} />
        <FormInputPair label={"City"} name={"city"} value={city} setValue={setCity} type={"text"} handleChange={handleChangeDefault} />
        <FormInputPair label={"Email"}  name={"primary_email"} value={email} type={"email"} handleChange={handleChangeEmail} />
        <FormInputPair label={"Password"}  name={"password"} value={password} type={"password"} handleChange={handleChangePassword} />
        <div></div>
        <button id="submitBtn" disabled={submitDisabled} className={"form-button"} onClick={handleSubmit}>Login</button>
      </form>
      <div style={{ color: "red", whiteSpace: "pre-line" }}>{fullErrorMsg}</div>
    </div>
  );
}