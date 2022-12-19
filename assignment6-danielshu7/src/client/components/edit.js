import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { validPassword, validUsername } from "../../shared/index.js";
import { ErrorMessage, FormBase, FormButton, FormInput, FormLabel, ModalNotify } from "./shared.js";

const WrongUserMsg = styled.h1`
  grid-area: main;
`;

const EditFields = ({ username }) => {
  let navigate = useNavigate();
  let [state, setState] = useState({
    first_name: "",
    last_name: "",
    city: "",
  });
  let [originalData, setOriginalData] = useState({
    first_name: "",
    last_name: "",
    city: "",
  });
  let [error, setError] = useState("");
  let [notify, setNotify] = useState("");

  useEffect(() => {
    document.getElementById("first_name").focus();
  }, []);

  useEffect(() => {
    fetch(`/v1/user/${username}`)
      .then((res) => res.json())
      .then((data) => {
        setOriginalData(data);
        setState(data);
      })
      .catch((err) => console.log(err));
  }, [username]);

  const onChange = (ev) => {
    setError("");
    // Update from form and clear errors
    setState({
      ...state,
      [ev.target.name]: ev.target.value,
    });
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    // Only proceed if there are no errors
    if (error !== "") return;
    const res = await fetch(`/v1/user/${username}`, {
      method: "PUT",
      body: JSON.stringify(state),
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
    });
    if (res.ok) {
      // Notify users
      setNotify(`${username}'s profile has been updated.`);
    } else {
      const err = await res.json();
      setError(err.error);
    }
  };

  const onAcceptEdit = () => {
    navigate(`/profile/${username}`);
  };

  return (
    <div style={{ gridArea: "main" }}>
      {notify !== "" ? (
        <ModalNotify
          id="notification"
          msg={notify}
          onAccept={onAcceptEdit}
        />
      ) : null}
      <ErrorMessage msg={error} />
      <FormBase>
        <FormLabel htmlFor="first_name">First Name:</FormLabel>
        <FormInput
          id="first_name"
          name="first_name"
          placeholder={originalData.first_name}
          onChange={onChange}
          value={state.first_name}
        />

        <FormLabel htmlFor="last_name">Last Name:</FormLabel>
        <FormInput
          id="last_name"
          name="last_name"
          placeholder={originalData.last_name}
          onChange={onChange}
          value={state.last_name}
        />

        <FormLabel htmlFor="city">City:</FormLabel>
        <FormInput
          id="city"
          name="city"
          placeholder={originalData.city}
          onChange={onChange}
          value={state.city}
        />

        <div />
        <FormButton id="submitBtn" onClick={onSubmit}>
          Edit Profile
        </FormButton>
      </FormBase>
    </div>
  );
};

export const Edit = (props) => {
  const { username } = useParams();

  // Is the logged-in user viewing their own profile
  const isUser = username === props.currentUser;
  return isUser ? (
    <EditFields username={username}/>
  ) : (
    <WrongUserMsg>You are not logged in as this user.</WrongUserMsg>
  );
};