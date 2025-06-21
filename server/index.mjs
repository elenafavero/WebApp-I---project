import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { getThreeRandomCards, getRandomCardExcluding, postGameWithRounds, getUserGames, checkUserExists } from './dao/dao.mjs';
import { getUser } from './dao/dao-user.mjs';

import { check, query, validationResult } from 'express-validator';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';

const LOWER_BOUND = -1;   
const UPPER_BOUND = 101;


// init express
const app = new express();
const port = 3001;


// middleware
app.use(express.json());
app.use(morgan('dev'));


// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});


// middleware
app.use(express.json());
app.use(morgan('dev'));


// Allow requests only from this specific origin. frontend running on localhost:5173
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));;


passport.use(new LocalStrategy({ usernameField: 'email' }, async function verify(username, password, cb) {
  const user = await getUser(username, password);
  if (!user) {
    return cb(null, false, 'Incorrect username or password.');
  }
  return cb(null, user);
}));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  return cb(null, user);

});

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'Not authorized' });
}

/* session and cookies */
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));



/* SERVER ROUTES */

/*
422 Unprocessable Entity
401 Invalid credentials
201 Created: returns user informations
500 Internal Server Error
*/
app.post('/api/login', [
  check('email').isEmail().withMessage('The email must be a valid email address'),
  check('password').isLength({ min: 1 }).withMessage('The password cannot be empty')
], function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      return res.status(401).send(info);
    }
    req.login(user, (err) => {
      if (err)
        return next(err);

      return res.status(201).json(req.user);
    });
  })(req, res, next);
});


/*
201 Created
500 Internal Server Error
*/
app.post('/api/logout', (req, res) => {
  req.logout(err => {
    if (err) 
      return next(err);
    res.status(201).end();
  });
});


/*
200 OK
422 Unprocessable Entity
500 Internal Server Error	
*/
app.get('/api/cards/1', [
  query('exclude')
    /* custom validation */
    .custom((value) => {
      if (!value) {
        throw new Error('exclude query parameter is required');
      }

      const ids = value.split(',');
      if (ids.length < 3) {
        throw new Error('At least 3 IDs are required in exclude');
      }

      for (const id of ids) {
        if (isNaN(parseFloat(id))) {
          throw new Error(`Invalid ID in exclude: ${id}`);
        }
      }
      return true;
    })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const excludeIds = req.query.exclude
      .split(',')
      .map(id => parseFloat(id))
      .filter(id => !isNaN(id));

    const card = await getRandomCardExcluding(excludeIds);
    res.status(200).json(card);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch a random card excluding specified IDs' });
  }
});


/*
200 OK
500 Internal Server Error
*/
app.get('/api/cards/3', async (req, res) => {
  try {
    const cards = await getThreeRandomCards();
    res.status(200).json(cards);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cards' });
  }
});




/*
 201 Creatd
 400 Bad Request	
 401 Unauthorized	
 422 Unprocessable 
 500 Internal Server Error	
*/
app.post('/api/game', isLoggedIn, [
  check('date').isISO8601(),
  check('rounds').notEmpty(),
  check('mistakeCount').isNumeric(),
  check('cardsWonCount').isNumeric()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const userId = req.user?.id;
  const { date, rounds, mistakeCount, cardsWonCount } = req.body;

  if (!userId || !Array.isArray(rounds)) {
    return res.status(400).json({ error: 'Invalid data' });
  }

  try {
    const gameId = await postGameWithRounds(userId, date, mistakeCount, cardsWonCount, rounds);
    res.status(201).json({ gameId });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});



/*
- 400 Bad Request
- 401 Unauthorized
- 404 Not Found 
- 422 Unprocessable Entity 
- 500 Internal Server Error 
*/
app.get('/api/users/:userId/games', isLoggedIn, [
  check('userId').isInt().withMessage('User ID must be an integer')
], async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const userId = req.params.userId;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }
  try {
    const userExists = await checkUserExists(userId);
    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }
    const result = await getUserGames(userId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});


/*
201 Created 
400 Bad Request
422 Unprocessable Entity  
500 Internal Server Error 
*/
app.post('/api/round/guess', [
  check('start_index').isFloat({ min: LOWER_BOUND, max: UPPER_BOUND }).withMessage('start_index must be a number between 0 and 100'),
  check('end_index').isFloat({ min: LOWER_BOUND, max: UPPER_BOUND }).withMessage('end_index must be a number between 0 and 100'),
  check('table_index').isFloat({ min: LOWER_BOUND + 1, max: UPPER_BOUND - 1 }).withMessage('table_index must be a number between 0 and 100'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { start_index, end_index, table_index } = req.body;

  try {
    if (start_index >= end_index) {
      return res.status(400).json({ error: 'start_index must be lower than end_index' });
    }
    const correct = table_index > start_index && table_index < end_index;
    return res.status(201).json({ correct });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});



app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});





