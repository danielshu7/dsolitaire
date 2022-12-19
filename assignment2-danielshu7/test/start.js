/* Copyright G. Hemingway @2022 - All rights reserved */
"use strict";

import path from "node:path";
import puppeteer from "puppeteer";
import * as url from "url";
import { expect } from "chai";
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

  beforeEach(
    async () => void (await page.goto("http://localhost:8080/start.html"))
  );

  it("POSTs /v1/game with a JSON body containing draw, color, and game", async () => {
    let jsonBody = false;
    let postRequest = false;
    let ajaxRequest = false;
    let body;

    page.on("request", (request) => {
      const type = request.resourceType();
      if (type === "xhr" || type === "fetch") ajaxRequest = true;
      if (request.method().toLowerCase() === "post") postRequest = true;

      // The body will fail to parse and throw if not valid JSON
      try {
        body = JSON.parse(request.postData());
        jsonBody = true;
      } catch (err) {}
    });

    const username = await page.evaluate(
      () => void document.querySelector("input#canfield").click()
    );
    // Click the submit button and wait for response page to load
    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle0" }),
      page.click("button[type=submit]"),
    ]);

    expect(jsonBody, "Body does not appear to use JSON encoding or is empty").to
      .be.true;
    expect(postRequest, "No POST request was sent").to.be.true;
    expect(ajaxRequest, "Request is not an AJAX request").to.be.true;
    expect(body, "Body does not contain the selected options").to.deep.equal({
      game: "canfield",
      draw: "1",
      color: "red",
    });
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

  it("Execute start game with screenshot", async () => {
    // Click the submit button and wait for response page to load
    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle0" }),
      page.click("button[type=submit]"),
    ]);
    // Check to make sure the URL is http://localhost:8080/game.html...
    const url = await page.url().split("=");
    url[0].should.equal("http://localhost:8080/game.html?id");
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
