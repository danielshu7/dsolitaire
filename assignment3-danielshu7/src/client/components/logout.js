"use strict";

import React, { useEffect } from "react";
import { Navigate } from 'react-router-dom';

export const Logout = (props) => {
  useEffect(
    () => {
      props.logOut();
    },
    []
  );

  return (
    <Navigate replace to="/login" />
  );
};

