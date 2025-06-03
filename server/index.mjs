import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { getRandomCard, getThreeRandomCards, getRandomCardExcluding } from './dao/dao.mjs';

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

app.get('/api/round/exclude', (req, res) => {
  console.log("[INDEX] /api/round/exclude route called");
  const excludeIds = (req.query.exclude || '').split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
  
  getRandomCardExcluding(excludeIds)
    .then(card => res.json(card))
    .catch(err => res.status(500).json({ error: 'Failed to fetch a random card excluding specified IDs' }));
});


app.get('/api/round/start', (req, res) => {
  console.log("[INDEX] /api/round/start route called");
  getThreeRandomCards()
    .then(cards => res.json(cards))
    .catch(err => res.status(500).json({ error: 'Failed to fetch 3 random cards' }));
});



///////
// GET /api/cards/random
app.get('/api/cards/random', (req, res) => {
  getRandomCard()
  .then(cards => res.json(cards))
  .catch(err => res.status(500).json({ error: 'Failed to fetch the new card' }));
});