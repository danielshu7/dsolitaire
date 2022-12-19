/* Copyright G. Hemingway @2022 - All rights reserved */
"use strict";

import path from "node:path";
import puppeteer from "puppeteer";
import * as url from "url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

describe("Profile Page:", function () {
  this.timeout(20000);
  // Define global variables
  let browser;
  let page;

  before(async () => {
    browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    page = await browser.newPage();
    await page.goto("http://localhost:8080/profile.html?username=foobar");
    const screenshotPath = path.join(__dirname, "../screenshots/profile.png");
    await page.screenshot({ path: screenshotPath });
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

  it("Clicking on active games opens the game", async () => {
    const elems = await page.$$eval("a", (elems) =>
      elems.map((elem) => ({
        tag: elem.tagName,
        href: elem.href,
        text: elem.textContent,
      }))
    );
    const someLinkToResults = elems.some(
      ({ tag, href, text }) =>
        tag === "A" &&
        href === "http://localhost:8080/game.html?id=1234" &&
        text === "Active"
    );
    someLinkToResults.should.equal(true);
  });

  it("Clicking on completed games opens the results page", async () => {
    const elems = await page.$$eval("a", (elems) =>
      elems.map((elem) => ({
        tag: elem.tagName,
        href: elem.href,
        text: elem.textContent,
      }))
    );
    const someLinkToResults = elems.some(
      ({ tag, href, text }) =>
        tag === "A" &&
        href === "http://localhost:8080/results.html?id=1234" &&
        text === "Complete"
    );
    someLinkToResults.should.equal(true);
  });

  after(async () => {
    await browser.close();
  });
});
