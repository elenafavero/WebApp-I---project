import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { getRandomCard, getThreeRandomCards } from './dao/dao.mjs';

// init express
const app = new express();
const port = 3001;

// middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});



/* ROUTES */

// GET /api/cards/random
app.get('/api/cards/random', (req, res) => {
  getRandomCard()
  .then(cards => res.json(cards))
  .catch(err => res.status(500).json({ error: 'Failed to fetch the new card' }));
});

app.get('/api/cards/random/3', (req, res) => {
  getThreeRandomCards()
    .then(cards => res.json(cards))
    .catch(err => res.status(500).json({ error: 'Failed to fetch 3 random cards' }));
});