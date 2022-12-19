/* Copyright G. Hemingway, 2022 - All rights reserved */
"use strict";

const path = require("path");
const fs = require("fs");
const http = require("http");
const https = require("https");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const session = require("express-session");
const mongoose = require("mongoose");
const envConfig = require("simple-env-config");
const RedisStore = require("connect-redis")(session);
const redis = require("redis");

const env = process.env.NODE_ENV ? process.env.NODE_ENV : "dev";

/***
 * Setup Redis client connection
 * @returns {Promise<RedisClient<RedisDefaultModules & RedisModules, RedisFunctions, RedisScripts> & WithCommands & WithModules<RedisDefaultModules & RedisModules> & WithFunctions<RedisFunctions> & WithScripts<RedisScripts>>}
 */
const setRedis = async () => {
  // Create redis client object - not yet connected
  const client = redis.createClient({ url: "redis://localhost:6379" });
  client
    .on("ready", () => {
      console.log("Redis Connected");
    })
    .on("error", () => {
      console.log("Not able to connect to Redis");
      process.exit(-1);
    });
  // Connect to the Redis instance
  await client.connect();
  return client;
};

const setupServer = async () => {
  // Get the app config
  const conf = await envConfig("./config/config.json", env);
  const port = process.env.PORT ? process.env.PORT : conf.port;

  // Setup our Express pipeline
  let app = express();
  app.use(logger("dev"));
  app.engine("pug", require("pug").__express);
  app.set("views", __dirname);
  app.use(express.static(path.join(__dirname, "../../public")));
  // Setup pipeline session support
  app.store = session({
    name: "session",
    secret: "grahamcardrules",
    resave: false,
    saveUninitialized: false,
    cookie: {
      path: "/",
    },
  });
  app.use(app.store);
  // Finish with the body parser
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // Connect to redis for caching
  app.redisClient = await setRedis();
  // Setup pipeline session support
  let sessionClient = redis.createClient({
    url: "redis://localhost:6379",
    legacyMode: true,
  });
  await sessionClient.connect();
  app.use(
    session({
      name: "session",
      store: new RedisStore({ client: sessionClient }),
      secret: "ohhellyes",
      resave: false,
      saveUninitialized: true,
      cookie: {
        path: "/",
        httpOnly: false,
        secure: false,
        maxAge: 60000,
      },
    })
  );

  try {
    // Connect to MongoDB
    await mongoose.connect(conf.mongodb);
    mongoose.connection.on("disconnected", () => {
      console.log(`MongoDB shutting down`);
    });
    console.log(`MongoDB connected: ${conf.mongodb}`);
  } catch (err) {
    console.log(err);
    process.exit(-1);
  }

  // Import our Data Models
  app.models = {
    Game: require("./models/game.cjs"),
    Move: require("./models/move.cjs"),
    User: require("./models/user.cjs"),
  };

  // Import our routes
  require("./api/index.cjs")(app);

  // Give them the SPA base page
  app.get("*", (req, res) => {
    const user = req.session.user;
    console.log(`Loading app for: ${user ? user.username : "nobody!"}`);
    let preloadedState = user
      ? {
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          primary_email: user.primary_email,
          city: user.city,
          games: user.games,
        }
      : {};
    preloadedState = JSON.stringify(preloadedState).replace(/</g, "\\u003c");
    res.render("base.pug", {
      state: preloadedState,
    });
  });

  // Run the server itself
  let server;
  if (env === "production") {
    const options = {
      key: fs.readFileSync(conf.security.keyPath),
      cert: fs.readFileSync(conf.security.certPath),
      ca: fs.readFileSync(conf.security.caPath),
    };
    // Listen for HTTPS requests
    server = https.createServer(options, app).listen(port, () => {
      console.log(`Secure Assignment 4 listening on: ${server.address().port}`);
    });
    // Redirect HTTP to HTTPS
    http
      .createServer((req, res) => {
        const location = `https://${req.headers.host}${req.url}`;
        console.log(`Redirect to: ${location}`);
        res.writeHead(302, { Location: location });
        res.end();
      })
      .listen(80, () => {
        console.log(`Assignment 4 listening on 80 for HTTPS redirect`);
      });
  } else {
    server = app.listen(port, () => {
      console.log(`Assignment 5 ${env} listening on: ${server.address().port}`);
    });
  }
};

// Run the server
setupServer();
