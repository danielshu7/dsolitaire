# CS 4288: Web-based System Architecture 
## Programming Assignment 4

# Overview

For this assignment you are to begin building out the server-side of your application.  If done properly, this should blend seamlessly with the React-based SPA client developed in Assignment #3.  Listed below are the requirements for the specific enhancements you need to make and how they will be graded.  Follow the directions closely!

### Focus: Add Data Persistence

* I would recommend using Docker to easily install MongoDB on your laptop..

* The server (```src/server/index.cjs```)has been enhanced so that when it starts it running, it connects to your Mongo instance.  This needs to be configurable, since we will need your application to connect to our Mongo instance when we test it on our machines.  Your connection should connect to a database named the same as your VUNetID for development, for example mongodb://localhost:55000/heminggs.  And, there will be another database called "testing" for when we run automated tests.  Update ```config/config.json``` lines 4 and 8 so that they point to your server and port.

* This same connection string on line 8 will be reused in the testing material in ```test/*```.

* In this assignment we actually do nothing client-side.  Hang onto your code from HW3, it will return in HW5.

# Enhancements

### Mongoose Schemas (30pts total)

Develop Mongoose schemas for Users, Games and Moves.  You know most of the fields that should be included in each of these schemas.  Think of what else is necessary.  In class we will explore the initial stages of support for these entities.  Expand on this and leverage this knowledge to complete the schemas.

* Schema for User (see in class discussion)

* Schema for Game (see in class discussion)

* Schema for Moves (see in class discussion)


### Server-Side Workflow Support (70 points)

There are a number of things that need to get upgraded throughout the application.  You need to support CRUD actions for users and games.  This means that a user should be able to register, log in and out, view profiles and modify their profile (eventually).  A user should also be able to create a new game, and mark a game as either deleted or completed (these are both valid choices - though we have no UI that can support this yet).

* The login page itself doe not need to change, but the server side now needs to properly support user login and password verification. (10pts)
    * This route is outlined in ***src/server/api/v1/session.cjs*** at POST _/v1/session_.
    
* The logout action in the client also needs to send a request to the server.  We don't yet have anything on the client to do this, so add it. (10pts)
    * This route is outlined in ***src/server/api/v1/session.cjs*** at DELETE _/v1/session_.


* The registration page itself doesn't need to change, but the server side now need to properly support creation of documents in the Users collection in the database. (10pts)
    * This route is outlined in ***src/server/api/v1/user.cjs*** at POST _/v1/user_.

* The profile page should perform the same AJAX query as before, but now the data must come from the database. (10pts)
    * This route is outlined in ***src/server/api/v1/user.cjs*** at GET _/v1/user/:username_.
    
* Any edits to the user's profile need to synchronized with the server.  We do not yet have any client capability to do this (look for it in Assignment #5).  But, we can prepare the server to handle this.  (10pts)
    * This route is outlined in ***src/server/api/v1/user.cjs*** at PUT _/v1/user_.


* The game creation page itself does not need to change, but the server-side needs to properly support game creation in the Games collection. (10pts).  
    * This route is outlined in ***src/server/api/v1/game.cjs*** at POST _/v1/game_.

* The game and results pages should allow the user to see details about games, both in progress and completed games as stored in the database. (10pts)
    * This route is outlined in ***src/server/api/v1/game.cjs*** at GET _/v1/game/:id_.
    
* We are not to the point of actually playing a game yet.  You do not need to implement actual game moves, but I do want you to take a shot at what the schema should look like.  There are no tests for this, so please add comments to your code to help us understand what you are trying to accomplish.

### General Server-Side Requirements

* All data must be stored into the MongoDB

* All server-side routines interacting with the DB must have good error management and reporting

* All data being stored into the database must be validated and cleansed of any possible script injections
 

### Testing Code - Useful, but different

* Use of Github Actions is required for this assignment.  I have provided some testing code to help in your development.
* To use the testing code:
    * Make sure the mongoDB connection URL in ***config/config.json*** is correct
    * Start your server ```npm run start-test```
    * Check that the server is running and has connected to your MongoDB
    * Run ```npm run test``` from your command line
    * 39 different tests are run against the Session, User and Game APIs.  Sadly, the game tests are not able to test all possibilities yet.
