/* Copyright G. Hemingway @2022 - All rights reserved */
"use strict";

import path from "node:path";
import puppeteer from "puppeteer";
import * as url from "url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

describe("Landing Page:", function () {
  this.timeout(20000);
  // Define global variables
  let browser;
  let page;

  before(async () => {
    browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    page = await browser.newPage();
    await page.goto("http://localhost:8080");
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

  after(async () => {
    const screenshotPath = path.join(__dirname, "../screenshots/landing.png");
    await page.screenshot({ path: screenshotPath });
    await browser.close();
  });
});
