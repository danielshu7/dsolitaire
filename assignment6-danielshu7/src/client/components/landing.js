/* Copyright G. Hemingway, @2022 - All rights reserved */
"use strict";

import React from "react";
import styled from "styled-components";

const LandingBase = styled.div`
  display: flex;
  justify-content: center;
  grid-area: main;
  flex-direction: column;
`;

const FeatureParagraphs = styled.p`
  margin-right: 20%;
`;

export const Landing = () => (
  <LandingBase>
      <h1>Welcome to DSolitaire!</h1>
      <div>
          <FeatureParagraphs>I have implemented the following optional assignment features:</FeatureParagraphs>
          <ul>
              <li><FeatureParagraphs>3: allowed editing of first name, last name, and city</FeatureParagraphs></li>
              <li><FeatureParagraphs>
                  7: implemented an Auto Complete button that is clickable
                  when there are valid moves from tableau piles to foundation stacks
              </FeatureParagraphs></li>
              <li><FeatureParagraphs>
                  8: recognizes potential end of game.
                  The conditions I used were checking if there are any remaining moves from tableau piles to foundation stacks,
                  discard/draw piles to tableau piles or foundation stacks, or non-trivial moves between tableau piles.
                  There is no check for moving cards from foundation stacks back to tableau piles.
                  When the conditions all fail, a modal will pop up, and the End Game button on the left becomes clickable.
              </FeatureParagraphs></li>
          </ul>
      </div>

  </LandingBase>
);
