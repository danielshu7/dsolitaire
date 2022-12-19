/* Copyright G. Hemingway @2022 - All rights reserved */
"use strict";

import path from "node:path";
import puppeteer from "puppeteer";
import * as url from "url";
import { expect } from "chai";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

describe("Login Page:", function () {
  this.timeout(20000);
  // Define global variables
  let browser;
  let page;

  before(async () => {
    browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    page = await browser.newPage();
    await page.goto("http://localhost:8080/login.html");
    const screenshotPath = path.join(__dirname, "../screenshots/login.png");
    await page.screenshot({ path: screenshotPath });
  });

  beforeEach(async () => {
    await page.goto("http://localhost:8080/login.html");
  });

  it("POSTs /v1/session with a JSON body containing username and password", async () => {
    let jsonBody = false;
    let postRequest = false;
    let ajaxRequest = false;
    let usernameIncluded = false;
    let passwordIncluded = false;

    page.on("request", (request) => {
      const type = request.resourceType();
      if (type === "xhr" || type === "fetch") ajaxRequest = true;
      if (request.method().toLowerCase() === "post") postRequest = true;

      // The body will fail to parse and throw if not valid JSON
      let body;
      try {
        body = JSON.parse(request.postData());
        jsonBody = true;
      } catch (err) {}

      if (body && body.username === "usera") usernameIncluded = true;
      if (body && body.password === "secret") passwordIncluded = true;
    });

    const username = await page.$("input#username");
    await username.type("usera");
    const password = await page.$("input#password");
    await password.type("secret");
    // Click the submit button and wait for response page to load
    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle0" }),
      page.click("button[type=submit]"),
    ]);

    expect(jsonBody, "Body does not appear to use JSON encoding or is empty").to
      .be.true;
    expect(postRequest, "No POST request was sent").to.be.true;
    expect(ajaxRequest, "Request is not an AJAX request").to.be.true;
    expect(usernameIncluded, "Body does not contain a username field").to.be
      .true;
    expect(passwordIncluded, "Body does not contain a password field").to.be
      .true;
  });

  it("Redirects to /profile.html?username=***username*** on success", async () => {
    const username = await page.$("input#username");
    await username.type("userb");
    const password = await page.$("input#password");
    await password.type("secret");
    // Click the submit button and wait for response page to load
    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle0" }),
      page.click("button[type=submit]"),
    ]);
    // Check to make sure the URL is http://localhost:8080/profile...
    const url = await page.url();
    url.should.equal("http://localhost:8080/profile.html?username=userb");
  });

  it("Displays an error message when an invalid username/password combination is input", async () => {
    await page.evaluate(() => {
      document.querySelector("input#username").value = "userabc";
      document.querySelector("input#password").value = "secrets";
    });

    await page.click("button[type=submit]");
    const text = await page.$eval("#errorMsg", (a) => a.innerHTML);
    expect(text, "Error message (#errorMsg) is empty").to.not.have.lengthOf(0);
  });

  it("INPUT#username, name=username, type=text", async () => {
    const elem = await page.$("#username");
    should.exist(elem);
    const tag = await page.evaluate((elem) => elem.tagName, elem);
    const name = await page.evaluate((elem) => elem.name, elem);
    const type = await page.evaluate((elem) => elem.type, elem);
    tag.trim().should.equal("INPUT");
    name.trim().should.equal("username");
    type.trim().should.equal("text");
  });

  it("INPUT#password, name=password, type=password", async () => {
    const elem = await page.$("#password");
    should.exist(elem);
    const tag = await page.evaluate((elem) => elem.tagName, elem);
    const name = await page.evaluate((elem) => elem.name, elem);
    const type = await page.evaluate((elem) => elem.type, elem);
    tag.trim().should.equal("INPUT");
    name.trim().should.equal("password");
    type.trim().should.equal("password");
  });

  it("BUTTON#submitBtn, type=submit, innerHTML=Login", async () => {
    const elem = await page.$("#submitBtn");
    should.exist(elem);
    const tag = await page.evaluate((elem) => elem.tagName, elem);
    const type = await page.evaluate((elem) => elem.type, elem);
    const text = await page.evaluate((elem) => elem.innerHTML, elem);
    tag.trim().should.equal("BUTTON");
    type.trim().should.equal("submit");
    text.trim().should.equal("Login");
  });

  it("Execute login with screenshot", async () => {
    const username = await page.$("input#username");
    await username.type("usera");
    const password = await page.$("input#password");
    await password.type("secret");
    // Click the submit button and wait for response page to load
    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle0" }),
      page.click("button[type=submit]"),
    ]);
    // Take a nice screenshot
    const screenshotPath = path.join(
      __dirname,
      "../screenshots/login-success.png"
    );
    await page.screenshot({ path: screenshotPath });
  });

  after(async () => {
    await browser.close();
  });
});
