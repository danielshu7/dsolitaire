/* Copyright G. Hemingway @2022 - All rights reserved */
"use strict";

import path from "node:path";
import express from "express";
import logger from "morgan";
import bodyParser from "body-parser";
import * as url from "url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const port = process.env.PORT ? process.env.PORT : 8080;
const env = process.env.NODE_ENV ? process.env.NODE_ENV : "dev";

// Setup our Express pipeline
let app = express();
if (env !== "test") app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "../../public")));
// Allow for either URLEncoded or JSON encoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Import our routes
import routes from "./routes.js";
await routes(app);

// Run the server itself
const server = app.listen(port, () => {
  console.log("GrahamCard listening on " + server.address().port);
});
