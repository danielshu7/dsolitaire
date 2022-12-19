/* Copyright G. Hemingway @2022 - All rights reserved */
"use strict";

import path from "node:path";
import puppeteer from "puppeteer";
import * as url from "url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

describe("Game Page:", function () {
  this.timeout(20000);
  // Define global variables
  let browser;
  let page;

  before(async () => {
    browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    page = await browser.newPage();
    await page.goto("http://localhost:8080/game.html?id=usera");
    const screenshotPath = path.join(__dirname, "../screenshots/game.png");
    await page.screenshot({ path: screenshotPath });
  });

  it("A#profileLink, innerHTML=Profile, and href=/profile.html", async () => {
    const elem = await page.$("#profileLink");
    should.exist(elem);
    const tag = await page.evaluate((elem) => elem.tagName, elem);
    const href = await page.evaluate((elem) => elem.href, elem);
    const text = await page.evaluate((elem) => elem.innerHTML, elem);
    tag.trim().should.equal("A");
    href.trim().should.equal("http://localhost:8080/profile.html?username=usera");
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

  after(async () => {
    await browser.close();
  });
});
