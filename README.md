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

### POST `/api/login`
  Authenticates a user using email and password.
  If credentials are valid it returns user info  otherwise, returns an error.

- **Request body:**  email and password of the user logging in.
  ```json
  {
    "email": "faveroelena2@gmail.com",
    "password": "CasaBlu"
  }
  ```
- **Response body:**  `201 CREATED`: success. Returns a JSON object, contining the user informations. 
  ```json
  {
    "id": 1,
    "email": "faveroelena2@gmail.com",
    "name": "Elena"
  }
  ```
- **Error codes:**
  - `401 UNAUTHORIZED`: the credentials are invalid.
  - `422 UNPROCESSABLE ENTITY`: the request is not in the specified format.
  - `500 INTERNAL SERVER ERROR`: generic error if the server crashes.


### POST `/api/logout`
  Logs out the current logged in user.
  - **Request body:**  Empty body.
  - **Response body:**  `201 CREATED`: success. Empty body.
  - **Error codes:**
    - `500 INTERNAL SERVER ERROR`: generic error if the server crashes.


### GET `/api/cards/1`
  Returns a new card for the round, excluding cards that have already been drawn previously.
- **Request body:**  Empty body
- **Query parameters:** exclude='1,2,3' (It excludes cards with ids 1, 2, and 3 from the pool of cards available to draw a new card from)
- **Response body:**  `200 OK`: success. Returns a JSON object, contining the new card informations. 
  ```json
  {
    "id": 28,
    "description": "You miss your flight by minutes",
    "imageUrl": "/images/missed_flight.jpg",
    "bad_luck_index": 43
  }
  ```
- **Error codes:**
  - `422 UNPROCESSABLE ENTITY`: the request is not in the specified format.
  - `500 INTERNAL SERVER ERROR`: generic error if the server crashes.


### GET `/api/cards/3`
  Returns the three cards that appear at the beginning of the game.
- **Request body:**  Empty body
- **Response body:**  `200 OK`: success. Returns an array of JSON object, each one representing a card with its informations.
  ```json
  [
      {
          "id": 45,
          "description": "You discover your credit card is blocked",
          "imageUrl": "/images/blocked_card.jpg",
          "bad_luck_index": 81
      },
      {
          "id": 49,
          "description": "You break a leg hiking a mountain",
          "imageUrl": "/images/broken_leg.jpg",
          "bad_luck_index": 90
      },
      {
          "id": 31,
          "description": "You drink unsafe water and get sick",
          "imageUrl": "/images/bad_water.jpg",
          "bad_luck_index": 53.5
      }
  ]
  ```
- **Error codes:**
  - `500 INTERNAL SERVER ERROR`: generic error if the server crashes.


### POST `/api/game`
  Stores a new game in the database, including all its information and the rounds it consists of.

- **Request body:**  game information, including the rounds it consists of.
  ```json
  {
    "date": "2025-06-19T15:33:20.734Z",
    "rounds": [
      {
        "round": -1,
        "card": {
          "id": 5,
          "description": "Your room has mold infestation",
          "imageUrl": "/images/mold_room.jpg",
          "bad_luck_index": 6
        },
        "result": -1
      },
      {
        "round": -1,
        "card": {
          "id": 20,
          "description": "You get stuck at the airport for 12 hours",
          "imageUrl": "/images/airport_delay.jpg",
          "bad_luck_index": 26
        },
        "result": -1
      },
      {
        "round": -1,
        "card": {
          "id": 26,
          "description": "Your flight is overbooked and you are left behind",
          "imageUrl": "/images/overbooked.jpg",
          "bad_luck_index": 42
        },
        "result": -1
      },
      {
        "round": 0,
        "card": {
          "id": 25,
          "description": "You get a severe sunburn on day one",
          "imageUrl": "/images/sunburn.jpg",
          "bad_luck_index": 41.5
        },
        "result": "won"
      },
      {
        "round": 1,
        "card": {
          "id": 3,
          "description": "The beach is closed for maintenance",
          "imageUrl": "/images/beach_closed.jpg",
          "bad_luck_index": 4
        },
        "result": "won"
      },
      {
        "round": 2,
        "card": {
          "id": 19,
          "description": "You are stuck in customs for hours",
          "imageUrl": "/images/customs_delay.jpg",
          "bad_luck_index": 23.5
        },
        "result": "won"
      }
    ],
    "mistakeCount": 0,
    "cardsWonCount": 3
  }
  ```
- **Response body:**  `201 CREATED`: success. Returns a JSON object, contining game id of the new game stored in the database. 
  ```json
  {
    "gameId": 63
  }
  ```
- **Error codes:**
  - `400 BAD REQUEST`: Invalid data.
  - `401 UNAUTHORIZED`: the user is not authenticated.
  - `422 UNPROCESSABLE ENTITY`: the request is not in the specified format.
  - `500 INTERNAL SERVER ERROR`: generic error if the server crashes.



### GET `/api/users/:userId/games`
  Retrieves the games of a specific user.

- **Request body:**  empty body.
- **Path varibles:** id of the user.
- **Response body:**  `200 OK`: success. Returns an array of JSON objects, each one representing a game including all its information and the rounds it consists of.
  ```json
  [
    {
      "date": "2025-06-19T15:33:20.734Z",
      "rounds": [
        {
          "round": -1,
          "card": {
            "id": 5,
            "description": "Your room has mold infestation",
            "imageUrl": "/images/mold_room.jpg",
            "bad_luck_index": 6
          },
          "result": -1
        },
        {
          "round": -1,
          "card": {
            "id": 20,
            "description": "You get stuck at the airport for 12 hours",
            "imageUrl": "/images/airport_delay.jpg",
            "bad_luck_index": 26
          },
          "result": -1
        },
        {
          "round": -1,
          "card": {
            "id": 26,
            "description": "Your flight is overbooked and you are left behind",
            "imageUrl": "/images/overbooked.jpg",
            "bad_luck_index": 42
          },
          "result": -1
        },
        {
          "round": 0,
          "card": {
            "id": 25,
            "description": "You get a severe sunburn on day one",
            "imageUrl": "/images/sunburn.jpg",
            "bad_luck_index": 41.5
          },
          "result": "won"
        },
        {
          "round": 1,
          "card": {
            "id": 3,
            "description": "The beach is closed for maintenance",
            "imageUrl": "/images/beach_closed.jpg",
            "bad_luck_index": 4
          },
          "result": "won"
        },
        {
          "round": 2,
          "card": {
            "id": 19,
            "description": "You are stuck in customs for hours",
            "imageUrl": "/images/customs_delay.jpg",
            "bad_luck_index": 23.5
          },
          "result": "won"
        }
      ],
      "mistakeCount": 0,
      "cardsWonCount": 3
    },
    ...
  ]
  ```
- **Error codes:**
  - `400 BAD REQUEST`: user id is required.
  - `401 UNAUTHORIZED`: the user is not authenticated.
  - `404: NOT FOUND`: the user does not exists in the database.
  - `422 UNPROCESSABLE ENTITY`: the request is not in the specified format.
  - `500 INTERNAL SERVER ERROR`: generic error if the server crashes.


### POST `/api/round/guess`
  Checks if the position choosen by the user for the new card is correct or not.

- **Request body:**  indexes of the cards defining the interval, and the index of the new card to insert.
  ```json
  {
    "start_index": 0,
    "end_index": 10,
    "table_index": 2
  }
  ```
- **Response body:**  `201 CREATED`: success. "Returns a JSON object containing a boolean value that indicates whether the chosen interval is correct or not.
  ```json
  {
    "correct": true
  }
  ```
- **Error codes:**
  - `400 BAD REQUEST`: start_index must be lower than end_index.
  - `422 UNPROCESSABLE ENTITY`: the request is not in the specified format.
  - `500 INTERNAL SERVER ERROR`: generic error if the server crashes.



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
