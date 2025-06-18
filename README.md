[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/ArqHNgsV)
# Exam #1: "Stuff Happens"
## Student: s347341 ELENA FAVERO

## React Client Application Routes

- Route `/`: page content and purpose
- Route `/something/:param`: page content and purpose, param specification
- ...

## API Server

- POST `/api/something`
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
  - id
  - username
  - email
  - salt
  -saltedPassword 
- Table `Card` - contains information about each card:
  - id
  - description
  - image_url
  - bad luck index 
- Table `Game` - contains information about each game:
  - id
  - user_id: user who played the game
  - date_created: start date of the game
  - mistake_count: number of cards guessed incorrectly
  - cards_won: number of cards guessed correctly
- Table `Round` - contains information about each round of each game:
  - id
  - game_id: game to which the round belongs
  - round_number: number of the round (-1 = initial cards, 0 = 1st round, 1 = second round ...)
  - card_id: card drawn from the deck
  - is_won: round outcome (-1 = initial cards, 0 = lost, 1 = won)


## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality

- `Header` (in `Header.jsx`): it renders the Navbar - contains:
  - a `<Navbar />` component with: 
    - the game title ('Stuff happens')
    - buttons for logged user: 'Your Game History' and 'Logout'.
  - an `<Outlet />` component to render child routes’ components below the navbar

- `ListCards` (in `ListCards.jsx`): it renders the cards that the player owns - contains:
  - list of cards owned by the player
  - for logged user: the `Next Round` button (to proceed to the next round)
  

- `LoginForm` (in `LoginForm.jsx`): it renders the login form - contains:
  - the login form with fields for: username, password
  - buttons: `Cancel` and `Login` to go back to the home page and log in, respectively

- `NewCard` (in `NewCard.jsx`): it renders the new card drawn from the deck - contains:
  - the new card
  - the timer
  - a loading spinner with the message "Waiting for result..." when the game ends
  - a message showing the outcome of the last move made (correct/wrong position or timer expired)

- `Profile` (in `Profile.jsx`): it renders the profile page of the user - contains:
  - a loading spinner while games are being fetched from the database
  - if no games are found in the db: the message "No games yet!" 
  - if some games are found in the db: the list of games completed by the user

- `ShowResult` (in `Result.jsx`): it renders the result page at the end of the game - contains:
  - summary of won cards by the player at the end of the game (for logged users) or the round (for not logged users)
  - for logged users:
    - the message "YOU WIN" or "GAME OVER"
    - button: `Start New Game`
  - for demo user: 
    - the "Demo round finished!" message at the end of the demo round
    - the `Home page` button (to go back to home page)

- `Welcome` (in `Welcome.jsx`): it renders the home page - contains:
  - Welcome message
  - buttons: `Login to play` and `Play Demo Version`

- `StartPage` (in `StartPage.jsx`): it renders the start page - contains:
  - if logged in:
    - message: "Are you ready to start?"
    - button: `Start New Game`
  - if demo version:
    - the game rules
    - message: "Ready to play?"
    - button: `Start New Game`





## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- faveroelena2@gmail.co, CasaBlu
- mariobros@gmail.com, RagnoViola
