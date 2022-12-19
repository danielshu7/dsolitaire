/* Copyright G. Hemingway @2022 - All rights reserved */
"use strict";

import path from "node:path";
import puppeteer from "puppeteer";
import * as url from "url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

describe("Register Page:", function () {
  this.timeout(20000);
  // Define global variables
  let browser;
  let page;

  before(async () => {
    browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    page = await browser.newPage();
    await page.goto("http://localhost:8080/register.html");
    const screenshotPath = path.join(__dirname, "../screenshots/register.png");
    await page.screenshot({ path: screenshotPath });
  });

  it("FORM with POST to /register", async () => {
    const forms = await page.$("form");
    const tag = await page.evaluate((elem) => elem.tagName, forms);
    const method = await page.evaluate((elem) => elem.method, forms);
    const action = await page.evaluate((elem) => elem.action, forms);
    tag.trim().should.equal("FORM");
    method.trim().should.equal("post");
    action.trim().should.equal("http://localhost:8080/register");
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

  it("INPUT#first_name, name=first_name, type=text", async () => {
    const elem = await page.$("#first_name");
    should.exist(elem);
    const tag = await page.evaluate((elem) => elem.tagName, elem);
    const name = await page.evaluate((elem) => elem.name, elem);
    const type = await page.evaluate((elem) => elem.type, elem);
    tag.trim().should.equal("INPUT");
    name.trim().should.equal("first_name");
    type.trim().should.equal("text");
  });

  it("INPUT#last_name, name=last_name, type=text", async () => {
    const elem = await page.$("#last_name");
    should.exist(elem);
    const tag = await page.evaluate((elem) => elem.tagName, elem);
    const name = await page.evaluate((elem) => elem.name, elem);
    const type = await page.evaluate((elem) => elem.type, elem);
    tag.trim().should.equal("INPUT");
    name.trim().should.equal("last_name");
    type.trim().should.equal("text");
  });

  it("INPUT#city, name=city, type=text", async () => {
    const elem = await page.$("#city");
    should.exist(elem);
    const tag = await page.evaluate((elem) => elem.tagName, elem);
    const name = await page.evaluate((elem) => elem.name, elem);
    const type = await page.evaluate((elem) => elem.type, elem);
    tag.trim().should.equal("INPUT");
    name.trim().should.equal("city");
    type.trim().should.equal("text");
  });

  it("INPUT#primary_email, name=primary_email, type=text", async () => {
    const elem = await page.$("#primary_email");
    should.exist(elem);
    const tag = await page.evaluate((elem) => elem.tagName, elem);
    const name = await page.evaluate((elem) => elem.name, elem);
    const type = await page.evaluate((elem) => elem.type, elem);
    tag.trim().should.equal("INPUT");
    name.trim().should.equal("primary_email");
    type.trim().should.equal("email");
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

  it("BUTTON#submitBtn, innerHTML=Register, type=submit", async () => {
    const elem = await page.$("#submitBtn");
    should.exist(elem);
    const tag = await page.evaluate((elem) => elem.tagName, elem);
    const type = await page.evaluate((elem) => elem.type, elem);
    const text = await page.evaluate((elem) => elem.innerHTML, elem);
    tag.trim().should.equal("BUTTON");
    type.trim().should.equal("submit");
    text.trim().should.equal("Register");
  });

  it("Execute registration with screenshot", async () => {
    const username = await page.$("input#username");
    await username.type("testusername");
    const first_name = await page.$("input#first_name");
    await first_name.type("Marky");
    const last_name = await page.$("input#last_name");
    await last_name.type("Marcus");
    const city = await page.$("input#city");
    await city.type("Boston");
    const primary_email = await page.$("input#primary_email");
    await primary_email.type("funky@bunch.com");
    const password = await page.$("input#password");
    await password.type("123456");
    // Click the submit button and wait for response page to load
    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle0" }),
      page.click("button[type=submit]"),
    ]);
    // Check to make sure the URL is http://localhost:8080/register
    const url = await page.url();
    url.should.equal("http://localhost:8080/register");
    // Check to make sure the page content has #registerSuccess
    const elem = await page.$("#regSuccess");
    should.exist(elem);
    const text = await page.evaluate((elem) => elem.innerHTML, elem);
    text.trim().should.equal(
      'Successfully registered: testusername. Go to <a href="/login.html">login</a>.'
    );

    // Take a nice screenshot
    const screenshotPath = path.join(
      __dirname,
      "../screenshots/register-success.png"
    );
    await page.screenshot({ path: screenshotPath });
  });

  after(async () => {
    await browser.close();
  });
});
