# CS 4288: Web-based System Architecture
## Programming Assignment 1

## Getting Started!

Make sure you have `npm` installed.  Install all of the dependencies:

```
npm install
```

To start the server, run:

```
npm run start
```

To run the test suite, first start the server and then run:

```
npm run test
```

## Overview

For this assignment you are to create a series of static HTML web pages.  This is going to be the starting point for our Klondyke Solitaire game site.  Author your seven HTML pages and any associated CSS for styling and commit it to Github before the deadline.  Here are the details, and while this may look long, I am just trying to be as specific as possible:

__Create the pages__

You need to create seven HTML pages that begin to provide the basic ideas of what your website will do.  Here are the pages:

* Landing page (/index.html)
* User registration (/register.html)
* User login (/login.html)
* User profile (/profile.html
* Create new game (/start.html)
* Primary game view (/game.html)
* Review game results (/results.html)

For now, each of these pages will be its own HTML page, though I am fine with a common CSS file for all of the pages.  All of these pages should live in the `/public` (i.e. static) subdirectory of your project.  Here are the requirements for each page:

__Styling__

In order to help you match the styling of the screenshots, we have included the newest versions of Bootstrap and JQuery.

We suggest using Bootstrap `row`s and `col`s to match styling. An example can be found [here](https://www.w3schools.com/bootstrap/bootstrap_grid_system.asp).

As for the fonts, there's no need to change any of the font families or sizes to try to match the screenshots. Instead, just use the default font styling that Bootstrap provides. No need to do anything fancy, just use `<h2>`s and `<p>`s as normal!

[Here](https://getbootstrap.com/docs/5.1/components/navbar/) are some useful things for styling the navbar. Checkout `navbar`, `navbar-expand-lg`, `navbar-static-top`, `navbar-light` and `bg-light`.

__Data__

We are crafting just simple static web pages.  None of the data on these pages is live or "pulled" from anywhere.  Write each page so that is always shows the same thing (i.e. the same user, the same results, etc.).  In our future assignments we will get the data dynamically.


### User Registration - path=/register.html

Where the user goes to register.  Eventually we will be able to tell if the user is registered or not, but for now we just want to let someone register.  This is a form page and should capture the following pieces of information:

* username, id=username
* first_name, id=first_name
* last_name, id=last_name
* password, id=password, type=password
* city, id=city
* primary_email, id=primary_email, type=email

Hint: using the Bootstrap `col`s, put the form in the middle 8 `col`s. Each label inside should be of width 2 `col`s, and the input the remaining 10.

### User Login - path=/login.html

A simple little form that accepts username and password.  This form should POST to /login. The password field must obscure the password being typed in.

Hint: same as registration -- put the form in the middle 8 `col`s. Put each label in 2 `col`s, and each input in the remaining 8.

### User Profile - path=/profile.html

For now this is going to be a completely static profile always showing the same details.  Using the same fields as in the registration (except not password obviously) give us a nice looking profile page.  Care should be given to alignment and clarity.  The page should also display a listing of active and past games and some simple stats about each (status, start date, # of moves made, score and game type).

Have a link near the list of games to start a new game.  This should take the user to _/start.html_.

Hints:
* Player Profile, 2 `col`s
* Player info, 8 `col`s
  * Row
    * Gravatar, 1 `col`
    * General info, 11 `col`s
  * Row, games played, 12 `col`s, use a table with Bootstrap class table!

*5 extra credit points:* if you can get the page to correctly show the Gravitar icon associated with your Vandy email address.  This may require you to create such an account with [Gravitar.com](http://gravatar.com).

### Create Game Plan - path=/start.html

Create a nice looking create game page.  The form should have fields that let the user choose one specific variant of Solitaire to play: Klondike, Pyramid, Hearts, Canfield, Golf, and Yukon.  The user should also be able to choose to Draw 1 or Draw 3 three cards at a time, and to choose the color of the deck (have at least four choices).  Submit this on a POST to /start.

Hints:
* Bootstrap `form-group` and `form-horizontal`
* Gametype, 4 `col`s
* Draw & Color, 8 `col`s

### Primary Game View - path=/game.html

Eventually, this is going to be just like what you have in any other Solitaire game.  For now, build a web page with a 4x4 grid of images that nicely layouts any 16 of the cards.  The images should have no gap between them, should be face-up, and should stretch to fill the whole screen from side-to-side, but should only scroll in the vertical direction (this will take some CSS-foo). In the middle of these cards, have one more card that is centered both horizontally and vertically is on top of the other cards.  I'll draw this in class so you fully understand.

Hint: don't get fancy! Simply use `div`s, css `width` & `height` as a % to make this work. You may need to put `margin: 0 -2px;` on each card to remove the tiny gaps. This is ok.

* The cards must maintain their aspect ratio as the window is resized

Finally, have two links in the upper right corner overlaying the card images.  These links should go to _/login.html_ and _/profile.html_ (see above for details on both).

### Review Game Results - path=/results.html

Finally, create a static page that reviews the game that was just played.  It should nicely display the following statistics (you can make up the value of these for now): duration (in XXd YYh ZZm AAs format), number of moves (int), points (int), cards remaining (int) and able to move (boolean).  Take some care to make the page look nice.  Provide links to let the user start a new game (_/start.html_) and to go to their profile (_/profile.html_).

Hints:
* Game Details, 2 `col`s
* Remainder, 10 `col`s
  * Row
    * Labels, 3 `col`s, Bootstrap class `text-right`
    * Info, 6 `col`s
  * Row, table, 12 `col`s, Bootstrap class `table`

## Building & Testing

We have developed a set of automated tests that verify the capabilities and functionality of your site.

* I will walk you through running the tests in class
* We will apply these tests via Travis (also to be discussed in class)
* These tests will be used by the graders as a first assessment of your code

We have included screenshots to test your code. The images you are trying to match against are in `/reference`. Each time you run `npm run test`, a series of `*.png`s will be created under `screenshots/`. Do your best to match the originals, but don't break your back over font sizes and pixels.

_Please do not modify the testing scripts. We will ensure during grading that they have not been modified._

## Grading Criteria:

Each page is worth 1/7 of the total points, so 14.285 points.  Meet the description above, match the screenshots, and you get all of the points.  As functionality isn't working, visual styling is not as desired, or things are simply missing, points will be deducted.

We reserve the right to modify the grading criteria.

## Submission:

Ensure your files are in a clean and organized folder hierarchy.  Make sure your package.json is complete and up-to-date.  Commit all necessary files (not node_modules) to your GitHub repository.  Grading will follow pretty much the same script on every assignment:

* Clone student's repo
* Run ```npm install``` and all dependencies are installed
* Run ```npm run start``` and the web app is running
* Navigate to localhost:8080 and the grader is on the landing page

Your repo must be compliant with these steps.  It is easy to practice this on your local machine to ensure you have everything in the right place.

You must have pushed to Github and have at least one Github Actions build of your code.  Failure to do so will result in a 40pt deduction.  Make sure your code passes all of the GH Actions automated unit tests.  Again, failure to ensure this will result in significant point deductions.


## Updates to the assignment - Will announce if you need to do

We may periodically deploy updates to the assignment.
You will need to resolve any conflicts that occur. Please come to office hours if you have any issues, however most updates will be to `test/` which you should not modify.

If significant changes have been made, we will do our best to send an announcement to the class.