import { Card } from '../models/models.mjs';
import db from '../database/db.mjs';

export const getRandomCardExcluding = (excludedIds) => {
  return new Promise((resolve, reject) => {
    const placeholders = excludedIds.map(() => '?').join(',');

    const sql = `
      SELECT * FROM Card 
      WHERE bad_luck_index NOT IN (${placeholders})
      ORDER BY RANDOM() 
      LIMIT 1`;
    db.get(sql, excludedIds, (err, row) => {
      if (err)
        reject(err);
      else {
        resolve(new Card(row.id, row.description, row.image_url, row.bad_luck_index));
      }
    });
  });
};




export const getThreeRandomCards = async () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM Card ORDER BY RANDOM() LIMIT 3`;
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      }
      else {
        const cards = rows.map(row => new Card(row.id, row.description, row.image_url, row.bad_luck_index));
        resolve(cards);
      }
    });
  });
};




export async function postGameWithRounds(userId, mistakeCount, cardsWonCount, rounds) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');

      db.run(
        `INSERT INTO Game (user_id, date_created, mistake_count, cards_won_count)
         VALUES (?, ?, ?, ?)`,
        [userId, new Date().toISOString(), mistakeCount, cardsWonCount],
        function (err) {
          if (err) {
            db.run('ROLLBACK');
            return reject(err);
          }

          const gameId = this.lastID;

          const stmt = db.prepare(
            `INSERT INTO Round (game_id, round_number, card_id, is_won)
             VALUES (?, ?, ?, ?)`
          );

          // if it is one of the first 3 rounds -> round and is_won == -1
          let i = 0;
          for (const round of rounds) {
            const isWon = (i < 3) ? -1 : (round.result === 'won' ? 1 : 0);
            stmt.run(gameId, round.round, round.card.id, isWon);
            i++;
          }

          stmt.finalize((err) => {
            if (err) {
              db.run('ROLLBACK');
              return reject(err);
            }

            db.run('COMMIT');
            resolve(gameId);
          });
        }
      );
    });
  });
}

export function checkUserExists(userId) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT 1 FROM User WHERE id = ? LIMIT 1`;
    db.get(sql, [userId], (err, row) => {
      if (err) return reject(err);
      resolve(!!row); // true se esiste, false altrimenti
    });
  });
}

export function getUserGames(userId) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT G.id AS game_id, G.date_created, G.mistake_count, G.cards_won_count,
             R.id AS round_id, R.round_number, R.is_won,
             C.id AS card_id, C.description, C.image_url, C.bad_luck_index
      FROM Game G
      LEFT JOIN Round R ON G.id = R.game_id
      LEFT JOIN Card C ON R.card_id = C.id
      WHERE G.user_id = ?
      ORDER BY G.date_created DESC, R.round_number ASC
    `;

    db.all(sql, [userId], (err, rows) => {
      // query fallita
      if (err) {
        return reject(err);
      }

      // Raggruppa i dati per gioco
      const gamesMap = {};
      for (const row of rows) {
        if (!gamesMap[row.game_id]) {
          gamesMap[row.game_id] = {
            id: row.game_id,
            date_created: row.date_created,
            mistake_count: row.mistake_count,
            cards_won_count: row.cards_won_count,
            rounds: []
          };
        }
        if (row.round_id) {
          gamesMap[row.game_id].rounds.push({
            id: row.round_id,
            round_number: row.round_number,
            is_won: row.is_won,
            card: {
              id: row.card_id,
              description: row.description,
              image_url: row.image_url,
              bad_luck_index: row.bad_luck_index
            }
          });
        }
      }
      resolve(Object.values(gamesMap));
    });
  });
}









