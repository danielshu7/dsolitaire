# CS 4288: Web-based System Architecture

## Programming Assignment 3

## Overview

For this assignment you are to continuing to expand on the card game playing application we built in Assignments #1 and #2. Listed below are the requirements for the specific enhancements you need to make and how they will be graded. Follow the directions closely and the site will that much closer to being usable.

My solution to this assignment will become available at [assignment3.rosterlink.org](http://assignment3.rosterlink.org) before the submission deadline.

### Enhancements

### A. Get your game on!! (20pts)

Over the next few assignments, you'll be building the actual card playing logic and capabilities into your solitaire application. For this assignment, you'll build the interactive front-end components. Firstly, you need to:

- Build a new function called `shuffleCards()` (skeleton is in: [_src/server/solitaire.js_](./src/server/solitaire.js). This will be a server-side function (thus: it must not be imported into the front-end) that generates a deck of cards with the position of each card randomized. This call should return a JSON array or card objects representing the deck of cards. The returned JS array should be of the following form:

```
[{ "suit": "clubs", "value": 7 }, { "suit": "diamonds", "value": "king" }, ... ]
```

For this assignment, you will be implementing [Klondike Solitaire](<https://en.wikipedia.org/wiki/Klondike_(solitaire)>). Therefore, you need to implement a way to lay out the cards according to how the game looks when it starts. When your `/game` page loads, it needs to fetch this initial state of the cards to display from the server. On the server side, the function to create this randomized initial state is called `initialState()` and is located in [`/src/server/solitaire.js`](./src/server/solitaire.js). This function will be called by the handler for the `POST /v1/game` endpoint. Some specifications to keep in mind while creating this function:

- Each pile must contain the correct number of cards as defined by the official rules of Klondike Solitaire.

- Your function should appropriately use the `shuffleCards()` function created above.

- Your function should return a JS object containing the game's initial state. It should look like this:

```
{
     id: "somerandomid",
     pile1: [{"suit": "clubs", "value": 7, "up": true}, {"suit": "diamonds", "value": 4, "up": false}, ...],
     pile2: [...],
     ...
     pile7: [...],
     stack1: [...],
     ...
     stack4: [...],
     draw: [...],
     discard: [...]
}
```

When a user chooses to start a new game, this object will be generated and stored for later use (see below).

### B. Show The Game (20 pts)

The `/game` page should render the cards in the same layout a player would see if playing the game on a tabletop (you can see an example in the [wiki page for Klondike Solitaire](<https://en.wikipedia.org/wiki/Klondike_(solitaire)>)). When the game page loads, fetch the game's initial state (which is returned when sending a POST request to `/v1/game` and uses the functions defined above) and render the cards in the appropriate places according to the game rules. As per the game rules, cards which are face-down should appear face-down to the user and vice versa.

It is important to keep in mind that your game page should utilize components to reduce duplicate code.

### C. Add client-side state (10pts)

The game screen is not your entire app; therefore, we need to build the supporting pages for the rest of your app. You need to enable all of the usual functions of an app that your user would expect from using other web apps: logging in and out, account home page, and game details.

Here are the criteria for this task:

- Logging in and out
  - When the user logs in, they remain logged in until they explicitly log out (and vice versa when they log out)
  - The user should remain logged in when refreshing the page.
  - The login and register page validation and submission should be implemented in React and should not use jQuery or the Browser DOM API as you did in the previous assignment.
  - You should pass a prop called `logIn` to the `Login` page component which will handle propagating the new login information to the rest of the application once a user has successfully logged in.
- Profile page
  - The header should show links to register and log in by default. If the user has logged in, show the user's Gravatar icon (fetched based on their email address) and a link to log out instead.
  - Users should be able to edit their profile in the future. If profile being viewed on the profile page is for the same username as the logged-in user, make an edit button/link visible. This button should navigate the user to /edit, but for now, nothing needs to actually be at this address.
  - The `/profile` page should only display the start button / link to the `/start` page if the user is logged in.
- Start page
  - Only logged-in users should be able to go to the start page to initiate a new game. Have the `/start` page check if a user is logged in. If not, automatically redirect them to the `/login` page.

## SPA Build Process (10 pts)

Since we are writing a single page app we must have a robust build process. Use the Webpack template developed in class as the basis for your build process. Your application should build cleanly with no errors or warnings and should put the output file into the /public/js folder. I am giving you all of the configuration files you need. So, really, just do not break the build.

## Single Page Application (40pts)

Rewrite your client-side application to build as a single page app. Use the React view framework and the starter code we developed in class as the starting point. You will need to do the following:

- Build as a single page app
- Use React Router (v6+) for all client-side page routing
- Rewrite all pages to be entirely React-based components
  - Use very small, very granular components
  - Use stateless functional components whenever possible (hint: they're always possible)
  - Elements inside containers (lists of games, lists of moves, etc.) must be their own components, as should the parent (containing) element.

You should use React Hooks for your state management rather than class-based components.

## Building & Testing

We have developed a set of automated tests that verify some capabilities and functionality of your site.

- We will apply these tests via GitHub Actions (also to be discussed in class)
- These tests will be used by the graders as a first assessment of your code
- All tests passing does not guarantee that you have followed every specification for this assignment

## Grading Criteria:

Meet the description above, and you get all the points. As functionality isn't working, visual styling is not as desired, or things are simply missing, points will be deducted.

## Submission:

Ensure your files are in a clean and organized folder hierarchy. Make sure your package.json is complete and up-to-date. Commit all necessary files (not node_modules) to your GitHub repository. Grading will follow pretty much the same script on every assignment:

- Clone student's repo
- Run `npm install` to install all dependencies
- Run `npm run build` to build the client
- Run `npm run start` to run the server
- Navigate to localhost:8080 to walk through each page of the application
- Run `npm run test` to execute all the test scripts locally

Your repo must be compliant with these steps. It is easy to practice this on your local machine to ensure you have everything in the right place.

You must run Travis builds for your code - this should be done automatically. Failure to do so will result in a 40pt deduction. Make sure your code passes all of the Travis automated unit tests. Again, failure to ensure this will result in significant point deductions.

## Useful tips from your TAs

- Use React Hooks and functional components. They will save you time and frustration.
- Use `fetch` rather than `$.AJAX`. In general, don't use any callback based code. Promises and `async` / `await` are much more prevalent because they are easier to reason about and are available everywhere.
- **NEVER** mix jQuery or DOM API operations with React
- `npm run build -- -w` will automatically rebuild your frontend whenever you save a file
