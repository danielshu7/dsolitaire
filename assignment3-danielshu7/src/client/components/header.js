/* Copyright G. Hemingway, @2022 - All rights reserved */
"use strict";

import React, { useState } from "react";
import md5 from "md5";
import { Link } from "react-router-dom";

/**
 * @return {string}
 */
export function GravHash(email, size) {
  let hash = email && email.replace(/^\s\s*/, "").replace(/\s\s*$/, "");
  hash = hash && hash.toLowerCase();
  hash = hash && md5(hash);
  return `https://www.gravatar.com/avatar/${hash}?size=${size}`;
}

const HeaderLinks = ({ curUser }) => {
  if(curUser !== null) { // if logged in, display Logout and profile links
    const [userInfo, setUserInfo] = useState([]);
    // get user info for email
    fetch(`/v1/user/${curUser}`)
      .then((data) => data.json())
      .then((data) => setUserInfo(data));

    return (
      <div className={"logged-in-links"}>
        <Link to={"/logout"}>Log Out</Link>
        <Link to={"/profile/" + curUser}>
          <img src={GravHash(userInfo.primary_email,40)} />
        </Link>
      </div>
    );
  }
  else { // otherwise display Login and Register links
    return (
      <div className={"logged-out-links"}>
        <Link to={"/login"}>Log In</Link>
        <Link to={"/register"}>Register</Link>
      </div>
    );
  }
};

export const Header = ({ curUser }) => {
  console.log(curUser);
  const headerMain = (curUser !== null)
    ? <Link to={"/profile/" + curUser} style={{ textDecoration: "none" }}>
        <h2>GrahamCard</h2>
      </Link>
    : <h2>GrahamCard</h2>;

  return (
    <div className={"header"}>
      <div className={"header-main"}>
        {headerMain}
      </div>
      <HeaderLinks curUser={curUser} />
    </div>
  );
}
