import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { getRandomCard, getThreeRandomCards, getRandomCardExcluding } from './dao/dao.mjs';

import { check, validationResult } from 'express-validator';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import { getUser } from './dao/dao-user.mjs';
import session from 'express-session';

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

// Allow requests only from this specific origin, our frontend running on localhost:5173
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

app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));



app.post('/api/login', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).send(info);
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err)
        return next(err);

      // req.user contains the authenticated user, we send all the user info back
      return res.status(201).json(req.user);
    });
  })(req, res, next);
});

/* ROUTES */

app.get('/api/round/exclude', (req, res) => {
  const excludeIds = (req.query.exclude || '').split(',').map(id => parseInt(id)).filter(id => !isNaN(id));

  getRandomCardExcluding(excludeIds)
    .then(card => res.json(card))
    .catch(err => res.status(500).json({ error: 'Failed to fetch a random card excluding specified IDs' }));
});


app.get('/api/round/start', (req, res) => {
  
  getThreeRandomCards()
    .then(cards => res.json(cards))
    .catch(err => res.status(500).json({ error: 'Failed to fetch 3 random cards' }));
});



app.get('/api/session/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);  // user is stored in the session by passport
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

app.post('/api/logout', (req, res) => {
  req.logout(() => {
    res.end();
  });
});


/*
//  TODO:
// recupera la cronologia dei giochi dell'utente

app.get('/history', isLoggedIn, (req, res) => {
  // Here you would typically fetch the user's game history from the database
  // For now, we just return a placeholder response
  res.json({ message: 'This is your game history', user: req.user });
}


// salva il gioco corrente nel db

app.post('/save-game', isLoggedIn, (req, res) => {
  const gameData = req.body; // Assume the game data is sent in the request body
  // Here you would typically save the game data to the database
  // For now, we just return a placeholder response
  res.json({ message: 'Game saved successfully', user: req.user });
}
*/