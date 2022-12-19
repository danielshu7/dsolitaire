/* Copyright G. Hemingway @2022 - All rights reserved */
"use strict";

let oldX,oldY;
let newX,newY;

function mouseDownActions(ev) {
  // set original coordinates (for drag distance) and print
  oldX = ev.x;
  oldY = ev.y;
  console.log("Mouse down at: " + oldX + "," + oldY);
}

function mouseUpActions(ev) {
  // set new coordinates and print
  newX = ev.x;
  newY = ev.y;
  console.log("Mouse up at: " + newX + "," + newY);

  // calculate dragged distance
  let dist = Math.sqrt((newX - oldX)**2 + (newY - oldY)**2);
  console.log("Mouse dragged: " + dist);
}

// card click event
let cards = $("img")
cards.click(ev => {
  let src = ev.target.src;
  let cardString = src.substring(29,src.length-4);
  let split = cardString.split('_');
  if(split.length < 3) {
    console.log("Red Joker");
  }
  else {
    console.log(split[0].charAt(0).toUpperCase() + " of " + split[2].charAt(0).toUpperCase());
  }
});

// make cards draggable
cards.draggable();

// make cards show over others when dragged
cards.mousedown(ev => {
  $(ev.target).css('zIndex', '999');
})
cards.mouseup(ev => {
  $(ev.target).css('zIndex', '0'); // reset
})