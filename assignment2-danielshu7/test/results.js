/* Copyright G. Hemingway @2022 - All rights reserved */
"use strict";

import path from "node:path";
import puppeteer from "puppeteer";
import * as url from "url";
import { expect } from "chai";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

describe("Results Page:", function () {
  this.timeout(20000);
  // Define global variables
  let browser;
  let page;

  before(async () => {
    browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    page = await browser.newPage();
    await page.goto("http://localhost:8080/results.html?id=ioary");
    const screenshotPath = path.join(__dirname, "../screenshots/results.png");
    await page.screenshot({ path: screenshotPath });
  });

  it("Fetches and displays the moves for the game", async () => {
    const pageContent = await page.content();
    expect(
      pageContent.includes("Ace to K4"),
      "Page is missing the move 'Ace to K4' from server for game with id 'ioary'"
    ).to.be.true;
    expect(
      pageContent.includes("One to K6"),
      "Page is missing the move 'One to K6' from server for game with id 'ioary'"
    ).to.be.true;
    expect(
      pageContent.includes("Queen to K7"),
      "Page is missing the move 'Queen to K7' from server for game with id 'ioary'"
    ).to.be.true;
  });

  it("Does not hardcode the table information", async () => {
    await page.goto("http://localhost:8080/results.html?id=1234");
    const includes = (await page.content()).includes("Ace to K4");
    expect(includes, "Page includes moves from server for invalid game ID").to
      .be.false;
  });

  it("A#profileLink, innerHTML=Profile, and href=/profile.html", async () => {
    const elem = await page.$("#profileLink");
    should.exist(elem);
    const tag = await page.evaluate((elem) => elem.tagName, elem);
    const href = await page.evaluate((elem) => elem.href, elem);
    const text = await page.evaluate((elem) => elem.innerHTML, elem);
    tag.trim().should.equal("A");
    href
      .trim()
      .should.equal("http://localhost:8080/profile.html?username=usera");
    text.trim().should.equal("Profile");
  });

  it("A#logoutLink, innerHTML=Log Out, href=/login.html", async () => {
    const elem = await page.$("#logoutLink");
    should.exist(elem);
    const tag = await page.evaluate((elem) => elem.tagName, elem);
    const href = await page.evaluate((elem) => elem.href, elem);
    const text = await page.evaluate((elem) => elem.innerHTML, elem);
    tag.trim().should.equal("A");
    href.trim().should.equal("http://localhost:8080/login.html");
    text.trim().should.equal("Log Out");
  });

  it("A#startLink, innerHTML=New Game, and href=/start.html", async () => {
    const elem = await page.$("#startLink");
    should.exist(elem);
    const tag = await page.evaluate((elem) => elem.tagName, elem);
    const href = await page.evaluate((elem) => elem.href, elem);
    const text = await page.evaluate((elem) => elem.innerHTML, elem);
    tag.trim().should.equal("A");
    href.trim().should.equal("http://localhost:8080/start.html");
    text.trim().should.equal("New Game");
  });

  after(async () => {
    await browser.close();
  });
});
