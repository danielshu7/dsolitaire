/* Copyright G. Hemingway @2022 - All rights reserved */
"use strict";

import path from "node:path";
import puppeteer from "puppeteer";
import * as url from "url";
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

  it("FORM with POST to /login", async () => {
    const forms = await page.$("form");
    const tag = await page.evaluate((elem) => elem.tagName, forms);
    const method = await page.evaluate((elem) => elem.method, forms);
    const action = await page.evaluate((elem) => elem.action, forms);
    tag.trim().should.equal("FORM");
    method.trim().should.equal("post");
    action.trim().should.equal("http://localhost:8080/login");
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
    await username.type("testusername");
    const password = await page.$("input#password");
    await password.type("123456");
    // Click the submit button and wait for response page to load
    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle0" }),
      page.click("button[type=submit]"),
    ]);
    // Check to make sure the URL is http://localhost:8080/login
    const url = await page.url();
    url.should.equal("http://localhost:8080/login");
    // Check to make sure the page content has #loginSuccess
    const elem = await page.$("#loginSuccess");
    should.exist(elem);
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
