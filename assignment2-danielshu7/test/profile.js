/* Copyright G. Hemingway @2022 - All rights reserved */
"use strict";

import path from "node:path";
import puppeteer from "puppeteer";
import * as url from "url";
import { expect } from "chai";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

describe("Profile Page:", function () {
  this.timeout(20000);
  // Define global variables
  let browser;
  let page;

  before(async () => {
    browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    page = await browser.newPage();
    await page.goto("http://localhost:8080/profile.html?username=usera");
    const screenshotPath = path.join(__dirname, "../screenshots/profile.png");
    await page.screenshot({ path: screenshotPath });
  });

  it("Fetches and displays the games for a user", async () => {
    const pageContent = await page.content();
    expect(
      pageContent.includes("Active"),
      "Page is missing the text 'Active' for the game status (fetched from the server)"
    ).to.be.true;
    expect(
      pageContent.includes("3"),
      "Page is missing the text '3' for the # of moves (fetched from the server)"
    ).to.be.true;
    expect(
      pageContent.includes("70"),
      "Page is missing the text '70' for the score (fetched from the server)"
    ).to.be.true;
    expect(
      pageContent.includes("hearts"),
      "Page is missing the text 'hearts' for the game type (fetched from the server)"
    ).to.be.true;
  });

  it("Does not hardcode the table information", async () => {
    await page.goto("http://localhost:8080/profile.html?id=1234");
    const includes = (await page.content()).includes("hearts");
    expect(
      includes,
      "Page includes the game type from server for invalid game ID"
    ).to.be.false;
  });

  it("A#loginLink, innerHTML=Log In, href=/login.html", async () => {
    const elem = await page.$("#loginLink");
    should.exist(elem);
    const tag = await page.evaluate((elem) => elem.tagName, elem);
    const href = await page.evaluate((elem) => elem.href, elem);
    const text = await page.evaluate((elem) => elem.innerHTML, elem);
    tag.trim().should.equal("A");
    href.trim().should.equal("http://localhost:8080/login.html");
    text.trim().should.equal("Log In");
  });

  it("A#regLink, innerHTML=Register, href=/register.html", async () => {
    const elem = await page.$("#regLink");
    should.exist(elem);
    const tag = await page.evaluate((elem) => elem.tagName, elem);
    const href = await page.evaluate((elem) => elem.href, elem);
    const text = await page.evaluate((elem) => elem.innerHTML, elem);
    tag.trim().should.equal("A");
    href.trim().should.equal("http://localhost:8080/register.html");
    text.trim().should.equal("Register");
  });

  it("A#startLink, innerHTML=Start new game, href=/start.html", async () => {
    const elem = await page.$("#startLink");
    should.exist(elem);
    const tag = await page.evaluate((elem) => elem.tagName, elem);
    const href = await page.evaluate((elem) => elem.href, elem);
    const text = await page.evaluate((elem) => elem.innerHTML, elem);
    tag.trim().should.equal("A");
    href.trim().should.equal("http://localhost:8080/start.html");
    text.trim().should.equal("Start new game");
  });

  after(async () => {
    await browser.close();
  });
});
