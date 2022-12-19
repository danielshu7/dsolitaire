/* Copyright G. Hemingway @2022 - All rights reserved */
"use strict";

import path from "node:path";
import puppeteer from "puppeteer";
import * as url from "url";
import { expect } from "chai";
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

  beforeEach(
    async () => void (await page.goto("http://localhost:8080/register.html"))
  );

  it("POSTs /v1/user with a JSON body containing username, password, first_name, last_name, city, and primary_email", async () => {
    let jsonBody = false;
    let postRequest = false;
    let ajaxRequest = false;
    let requestURL = false;
    let body;

    page.on("request", (request) => {
      const type = request.resourceType();
      if (type === "xhr" || type === "fetch") ajaxRequest = true;
      if (request.method().toLowerCase() === "post") postRequest = true;
      if (request.url() == "http://localhost:8080/v1/user") requestURL = true;

      // The body will fail to parse and throw if not valid JSON
      try {
        body = JSON.parse(request.postData());
        jsonBody = true;
      } catch (err) {}
    });

    await page.evaluate(() => {
      document.querySelector("input#username").value = "foobarbin";
      document.querySelector("input#primary_email").value = "foo@bar.baz";
      document.querySelector("input#first_name").value = "bar";
      document.querySelector("input#last_name").value = "baz";
      document.querySelector("input#city").value = "Nashville";
      document.querySelector("input#password").value = "p@sswOrd1";
    });
    // Click the submit button and wait for response page to load
    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle0" }),
      page.click("button[type=submit]"),
    ]);

    expect(requestURL, "Request URL does not point to /v1/user").to.be.true;
    expect(jsonBody, "Body does not appear to use JSON encoding or is empty").to
      .be.true;
    expect(postRequest, "No POST request was sent").to.be.true;
    expect(ajaxRequest, "Request is not an AJAX request").to.be.true;
    expect(body, "Body does not contain the inputted values").to.deep.equal({
      username: "foobarbin",
      password: "p@sswOrd1",
      first_name: "bar",
      last_name: "baz",
      city: "Nashville",
      primary_email: "foo@bar.baz",
    });
  });

  it("Redirects to /profile.html?username=***username*** on success", async () => {
    await page.evaluate(() => {
      document.querySelector("input#username").value = "foobarbin2";
      document.querySelector("input#primary_email").value = "foo@bar.baz";
      document.querySelector("input#first_name").value = "bar";
      document.querySelector("input#last_name").value = "baz";
      document.querySelector("input#city").value = "Nashville";
      document.querySelector("input#password").value = "p@sswOrd1";
    });
    // Click the submit button and wait for response page to load
    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle0" }),
      page.click("button[type=submit]"),
    ]);
    // Check to make sure the URL is http://localhost:8080/profile...
    const url = await page.url();
    url.should.equal("http://localhost:8080/profile.html?username=foobarbin2");
  });

  it("Displays an error message when an invalid email is input", async () => {
    await page.evaluate(() => {
      document.querySelector("input#username").value = "foobarbin2";
      document.querySelector("input#primary_email").value = "foobar.baz";
      document.querySelector("input#first_name").value = "bar";
      document.querySelector("input#last_name").value = "baz";
      document.querySelector("input#city").value = "Nashville";
      document.querySelector("input#password").value = "p@sswOrd1";
    });

    await page.click("button[type=submit]");
    let text = await page.evaluate(
      () => document.querySelector("#errorMsg").innerHTML
    );
    expect(text, "Error message doesn't check for @ sign in email").to.contain(
      "email"
    );

    await page.evaluate(() => {
      document.querySelector("input#primary_email").value = "foo@bar.baz";
      document.querySelector("input#password").value = "passwor";
    });
    await page.click("button[type=submit]");
    text = await page.evaluate(
      () => document.querySelector("#errorMsg").innerHTML
    );
    expect(
      text,
      "Email error message doesn't get cleared when email is fixed"
    ).to.not.contain("email");

    await page.evaluate(() => {
      document.querySelector("input#username").value = "foobarbin3";
      document.querySelector("input#password").value = "p@ssw0rD";
      document.querySelector("input#primary_email").value = "foo@barbaz";
    });

    await page.click("button[type=submit]");
    text = await page.evaluate(
      () => document.querySelector("#errorMsg").innerHTML
    );
    expect(text, "Error message doesn't check for . in email").to.contain(
      "email"
    );
  });

  it("Displays an error message when an invalid password is input", async () => {
    await page.evaluate(() => {
      document.querySelector("input#username").value = "foobarbin4";
      document.querySelector("input#primary_email").value = "foo@bar.baz";
      document.querySelector("input#first_name").value = "bar";
      document.querySelector("input#last_name").value = "baz";
      document.querySelector("input#city").value = "Nashville";
      document.querySelector("input#password").value = "passwo";
    });

    await page.click("button[type=submit]");
    let text = await page.evaluate(
      () => document.querySelector("#errorMsg").innerHTML
    );
    expect(text, "Error message doesn't specify password").to.contain(
      "password"
    );
    expect(text, "Error message doesn't specify password length").to.contain(
      "length"
    );

    await page.evaluate(() => {
      document.querySelector("input#password").value = "p@ssworD";
    });
    await page.click("button[type=submit]");
    text = await page.evaluate(
      () => document.querySelector("#errorMsg").innerHTML
    );
    expect(
      text,
      "Error message doesn't specify input password is missing numeric characters"
    ).to.contain("number");
    expect(
      text,
      "Error message specifies length despite password being requisite length"
    ).to.not.contain("length");

    await page.evaluate(() => {
      document.querySelector("input#password").value = "p@ssw0rD";
      document.querySelector("input#username").value = "short";
    });
    await page.click("button[type=submit]");
    text = await page.evaluate(
      () => document.querySelector("#errorMsg").innerHTML
    );
    expect(
      text,
      "Error message still contains 'password' when correct password is input"
    ).to.not.contain("password");
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
    await password.type("!1234Aasdf");
    // Click the submit button and wait for response page to load
    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle0" }),
      page.click("button[type=submit]"),
    ]);
    // Check to make sure the URL is http://localhost:8080/register
    const url = await page.url();
    url.should.equal(
      "http://localhost:8080/profile.html?username=testusername"
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
