/* Copyright @author: G. Hemingway 2022, All Rights Reserved */
"use strict";

import "chai/register-should.js";

export const mochaGlobalSetup = async function () {
  // Start api and async servers in TEST mode
};

export const mochaGlobalTeardown = async function () {
  // Shutdown api and async servers
};

export const mochaHooks = {
  /***
   * Execute once before all tests begin
   * @returns {Promise<void>}
   */
  async beforeAll() {},

  /***
   * Execute once after all tests have finished running
   * @returns {Promise<void>}
   */
  async afterAll() {},
};
