[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/ArqHNgsV)
# Exam #1: "Stuff Happens"
## Student: s347341 ELENA FAVERO

## React Client Application Routes

- Route `/`: it is the entry point of the web application. It renders the `<Welcome />` component, which represents the Home Page, together with the `<Header />` component,  which represents the Navbar. It shows the greetings message and asks the user to choose between the two game modes: demo version or not. 
- Route `/login`: when the user clicks on the login button in the Home Page, they are redirected to this route. It renders the `<LoginForm />` component, which contains the login form the user compiles to log in the web application.
- Route `/start`: it is the preparation page before the game or round begins. It asks the user if they're ready to play and displays a button to start. If the user is not logged in, it also shows the game rules.
- Route `/game`: it is where all rounds take place. It renders the `<NewCard />` and `<ListCards />` components, which show the newly drawn card and the user's current cards respectively, together with the timer.
- Route `/game/result`: it is where the outcome of the game or round is shown (game for logged users, round otherwise), along with the list of cards won during the game or round. It renders the `<ShowResult />` component and gives the possibility to start a new game, in the case of a logged in user, or to return to the home page, in the other case.
- Route `/profile`:  when the logged user clicks on the "Your Game History" button in the Navbar, they are redirected to this route. It renders the `<Profile />` component, which displays the user’s game history with details about each round.

## API Server

- POST `/api/login`
  - request parameters and request body content
  - response body content
- GET `/api/something`
  - request parameters
  - response body content
- POST `/api/something`
  - request parameters and request body content
  - response body content
- ...

## Database Tables

- Table `User` - contains information about each user:
  - `id`: unique identifier of the student
  - `username`: username of the user
  - `email`: email of the user
  - `salt`: salt used to compute the password of the user. It is used to match the password inserted in the login form
- Table `Card` - contains information about each card:
  - `id`: unique identifier of the card
  - `description`: description of the horrible situation of the card
  - `image_url`: URL of the image associated with the card's description
  - `bad_luck_index`: index representing the "bad luck" level of the card

- Table `Game` - contains information about each game:
  - `id`: unique identifier of the game
  - `user_id`: identifier of the user who played the game
  - `date_created`: date when the game was stored in the db
  - `mistake_count`: number of cards guessed incorrectly
  - `cards_won`: number of cards guessed correctly

- Table `Round` - contains information about each round of every game:
  - `id`: unique identifier of the round
  - `game_id`: identifier of the game to which the round belongs
  - `round_number`: round number (-1 = initial cards, 0 = first round, 1 = second round, ...)
  - `card_id`: identifier of the card drawn from the deck
  - `is_won`: outcome of the round (-1 = initial cards, 0 = lost, 1 = won)

## Main React Components

- `Header` (in `Header.jsx`): it renders the Navbar - contains:
  - a `<Navbar />` component with: 
    - the game title ('Stuff happens')
    - for logged user: 
      - `Your Game History` button: navigates to the '/profile' route 
      - `Logout` button: calls the handleLogout function which then navigates to the '/start' route (Start Page)
  - an `<Outlet />` component to render child routes’ components below the navbar

- `ListCards` (in `ListCards.jsx`): it renders the cards that the player owns - contains:
  - list of cards owned by the player 
  - buttons to select the desired interval
  - for logged user: 
    - `Next Round` button: calls the proceedToNextRound function that draws a new card and starts a new round

- `LoginForm` (in `LoginForm.jsx`): it renders the login form - contains:
  - the login form with fields for: username, password
  - `Cancel` button: navigates to the '/' route (Home page)
  - `Login` button: calls the submitCredentials function which, through a chain of function calls, leads to the completion of the user's login operation, finally navigating to the '/start' route

- `NewCard` (in `NewCard.jsx`): it renders the new card drawn from the deck - contains:
  - the new card drawn form the deck
  - the timer showing the remaining time
  - a loading spinner with the message "Waiting for result..." when waiting for the game result
  - message about the outcome: after making a choice, a message showing the outcome of the last move made (correct/wrong position or timer expired)

- `Profile` (in `Profile.jsx`): it renders the profile page of the user - contains:
  - a loading spinner while games are being fetched from the database
  - "No games yet!" message: if no games are found in the db
  - the list of games completed by the user: if some games are found in the db

- `ShowResult` (in `Result.jsx`): it renders the result page at the end of the game (for logged users) or round (for not logged users) - contains:
  - summary of won cards by the player at the end of the game/round 
  - for logged users:
    - "YOU WIN" or "GAME OVER" message
    - `Start New Game` button: calls the handleRestart that starts a new game and navigates to the '/game' route  
  - for demo user: 
    - "Demo round finished!" message:  at the end of the demo round
    - `Home page` button: calls the proceedToNextRound function which resets the variables so that a new demo round can be repeated and finally navigates to the '/' route

- `Welcome` (in `Welcome.jsx`): it renders the Home Page - contains:
  - Welcome message
  - `Login to play` button: which navigates to the '/login' route
  - `Play Demo Version` button: which navigates to the '/start' route

- `StartPage` (in `StartPage.jsx`): it renders the Start Page - contains:
  - for logged users:
    - message: "Are you ready to start?"
    - `Start New Game` button: which navigates to the '/game' route
  - for demo user: 
    - the game rules
    - message: "Ready to play?"
    - `Start Round` button: which navigates to the '/game' route





## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- faveroelena2@gmail.co, CasaBlu
- mariobros@gmail.com, RagnoViola
