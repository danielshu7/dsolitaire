/* Copyright G. Hemingway @2022 - All rights reserved */
"use strict";

import path from "node:path";
import puppeteer from "puppeteer";
import * as url from "url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

describe("Results Page:", function () {
  this.timeout(20000);
  // Define global variables
  let browser;
  let page;

  before(async () => {
    browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    page = await browser.newPage();
    await page.goto("http://localhost:8080/results.html?id=1234");
    const screenshotPath = path.join(__dirname, "../screenshots/results.png");
    await page.screenshot({ path: screenshotPath });
  });

  it("A#profileLink, innerHTML=Profile, and href=/profile.html", async () => {
    const elem = await page.$("#profileLink");
    should.exist(elem);
    const tag = await page.evaluate((elem) => elem.tagName, elem);
    const href = await page.evaluate((elem) => elem.href, elem);
    const text = await page.evaluate((elem) => elem.innerHTML, elem);
    tag.trim().should.equal("A");
    href.trim().should.equal("http://localhost:8080/profile.html?username=heminggs");
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
