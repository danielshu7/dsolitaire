# CS 4288: Web-based System Architecture

## Programming Assignment 2

## Overview

For this assignment you are going to be adding Javascript to your client to enhance its behavior. Listed below are the enhancements you need to make. Carefully follow the directions and commit your changes back to your Github repo. A new server file and client base code has been created for you. I have given you my solution to HW 1 and the skeletons for all of the JS files.  I suggest you use what is given to you, as opposed to your previous assignment - but that is not a requirement.

You are mostly adding Javascript to your pages. You should write all of the JS in separate files from the HTML (already created for you). Use one JS file per page (don't bundle them all into one JS file). Beyond invoking functions from events, you should not have JS in your HTML. Use of jQuery or other 3rd party libraries is encouraged but not required.

### Required Enhancements

#### Better user feedback in Login, Register and Create Game

We need our pages to work better and actually validate the user’s inputs. We have three forms that need validation support: login, register, and start a new game.

Note: Do _not_ use an [alert](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert) for error messages. This is an extremely poor user experience.

### User Login - path=/login.html

We don't want the login form to use the default behavior for submitting a form, as we want to intercept errors returned by the server and give the user a pleasant error experience. Firstly, we want to change the submit behavior of the form. Rather than use the `<form>` tag's action attribute to handle submitting the form, write JavaScript to capture the button click and perform an AJAX POST request to the path `/v1/session`, with the contents of the form (username and password) encoded as JSON in the request body. The response from the server will either be a `201 CREATED` and some additional user information or a 4XX error meaning that the user did not provide a valid username/password. On a 201, do a client-side redirect (Google window.location) to `/profile.html?username=***username***`. Of course, replace `***username***` with the appropriate new user name. On a 4XX error, you should display a message on the page informing the user what went wrong. You might consider reading up on [what makes a good error message](https://uxplanet.org/how-to-write-the-perfect-error-message-ffc132fda06a) and seeing how your favorite sites display these kinds of error messages on a login form, in order to style it in a pleasing manner.

### User Registration - path=/register.html

For the Register page we want to make sure the user is entering information in the right format. Validate that their username is between 6-16 characters and contains only alphanumeric characters. The password should also be greater than 8 characters and contain a lower-case, an upper-case, a number and a symbol (!, @, #, \$, % or ^). The primary email address should be a valid looking email address. Just like the Login page, capture the Submit button click and perform an AJAX POST to `/v1/user` and look for either a 201 CREATED, or a 4XX error. On success, redirect to `/profile.html?username=***newusername***`.

### Create Game - path=/start.html

Follow similar instructions for the Create Game page. If another game is selected it should become active. Perform a POST to `/v1/game` and look for the return status code. On success, redirect to `/game.html?id=***newgameid***`. The `newgameid` value will be returned in the body of a successful (2XX error code) response.

### Primary Game View - path=/game.html

There are a number of events we want to recognize in the game view, but for now let’s focus on clicking and selecting cards. Do the following incrementally, to build up your understanding of how user events can be handled within your javascript code. All of these activities should be within your main game page.

1. When a user’s mouse is clicked down, print to the console the X, Y screen location of the mouse. (e.g. "Mouse down at: 1170, 328")
2. Do the same when a user releases the mouse button (e.g. "Mouse up at: 1170, 328")
3. If the user clicks and drags the mouse, print out a drag distance in pixels (e.g. "Mouse dragged: 181.76083186429358")
4. Identify which card the user has clicked on and print out it's identity (e.g. "Card: 4 of H" or "Card: A of D")
5. Move the card in the center of the screen by clicking and dragging it.

### Data for our Profiles and Game Reviews

With the above directions in mind, hopefully you see what is coming here. Now the profile and game results pages are really just templates. Once the pages have loaded, get the ID parameters from the query string. I.e. from ?username=foo get "foo". Use this to perform a query to fetch data from the server with AJAX GET requests to `/v1/user/***username***` and `/v1/game/***gameid***`. Get the JSON back from the server and populate the pages appropriately.

Additional notes for the profile screen:

- Clicking on a game that is not completed should take you to the game itself (i.e. go to `/game.html?id=1234)`.

- Clicking on a game that is completed should take you to the results page for that game (i.e. `/results.html?id=1234`).

### Bonus!

5 bonus points if the user can click and drag any of the 17 cards on the game page.

5 bonus points will be awarded to the single best looking Landing Page as judged by myself and the graders. This is completely subjective.

5 bonus points will be awarded to any student who animates the transition from all of the forms to the next pages in some way, such as swooshing left or right.

## Useful Links

You may find the following API docs helpful as you attempt to work through this assignment:

- [`fetch` API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [`JSON` in JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON)
- [A guide to events](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events) (such as clicks)
- [The official jQuery API documentation](https://api.jquery.com/https://api.jquery.com/)

## Building & Testing

We have developed a set of automated tests that verify the capabilities and functionality of your site.

- We will apply these tests via CI (also to be discussed in class)
- These tests will be used by the graders as a first assessment of your code

Follow the instructions in Submission to start your application and test it.

## Grading Criteria:

Each page described above is worth 1/6 of the total points, so 16.666 points. Meet the description above and you get all of the points. As functionality isn't working, visual styling is not as desired, or things are simply missing, points will be deducted.

## Submission:

Ensure your files are in a clean and organized folder hierarchy. Commit all necessary files (not node_modules) to your GitHub repository. Grading will follow pretty much the same script on every assignment:

- Clone student's repo
- Run `npm install` and all dependencies are installed
- Run `npm run start` and the web app is running
- Navigate to localhost:8080 and the grader is on the landing page
- Run `npm run test` to execute all of the test scripts locally

Your repo must be compliant with these steps. It is easy to practice this on your local machine to ensure you have everything in the right place.

Make sure your code passes all of the CI automated unit tests. Again, failure to ensure this will result in significant point deductions.

_Helpful note:_ Registration of new users relies on the usernames not being registered already. If you experience the tests for registration failing and you don't know why, restart the server and try the tests again.

## Updates to the assignment

We may periodically deploy updates to the assignment.
You will need to resolve any conflicts that occur. Please come to office hours if you have any issues, however most updates will be to `test/` which you should not modify.

If significant changes have been made, we will do our best to send an announcement to the class.
