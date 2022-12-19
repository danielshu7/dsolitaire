/* Copyright G. Hemingway @2022 - All rights reserved */
"use strict";

import path from "node:path";
import puppeteer from "puppeteer";
import * as url from "url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

describe("Start Page:", function () {
  this.timeout(20000);
  // Define global variables
  let browser;
  let page;

  before(async () => {
    browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    page = await browser.newPage();
    await page.goto("http://localhost:8080/start.html");
    const screenshotPath = path.join(__dirname, "../screenshots/start.png");
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

  it("FORM with POST to /start", async () => {
    const forms = await page.$("form");
    const tag = await page.evaluate((elem) => elem.tagName, forms);
    const method = await page.evaluate((elem) => elem.method, forms);
    const action = await page.evaluate((elem) => elem.action, forms);
    tag.trim().should.equal("FORM");
    method.trim().should.equal("post");
    action.trim().should.equal("http://localhost:8080/start");
  });

  it("BUTTON#submitBtn, type=submit, innerHTML=Start", async () => {
    const elem = await page.$("#submitBtn");
    should.exist(elem);
    const tag = await page.evaluate((elem) => elem.tagName, elem);
    const type = await page.evaluate((elem) => elem.type, elem);
    const text = await page.evaluate((elem) => elem.innerHTML, elem);
    tag.trim().should.equal("BUTTON");
    type.trim().should.equal("submit");
    text.trim().should.equal("Start");
  });

  it("Execute start with screenshot", async () => {
    // Click the submit button and wait for response page to load
    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle0" }),
      page.click("button[type=submit]"),
    ]);
    // Check to make sure the URL is http://localhost:8080/start
    const url = await page.url();
    url.should.equal("http://localhost:8080/start");
    // Check to make sure the page content has #loginSuccess
    const elem = await page.$("#startSuccess");
    should.exist(elem);
    // Take a nice screenshot
    const screenshotPath = path.join(
      __dirname,
      "../screenshots/start-success.png"
    );
    await page.screenshot({ path: screenshotPath });
  });

  after(async () => {
    await browser.close();
  });
});
