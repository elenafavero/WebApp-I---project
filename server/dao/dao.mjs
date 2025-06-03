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
      else 
        resolve(new Card(row.description, row.image_url, row.bad_luck_index));
    });
  });
};




export const getThreeRandomCards = async () => {
  console.log("[DAO] getThreeRandomCards called");
  return new Promise((resolve, reject) => {
    console.log("[DAO] Fetching 3 random cards from the database...");
    const sql = `SELECT * FROM Card ORDER BY RANDOM() LIMIT 3`;
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      }
      else {
        const cards = rows.map(row => new Card(row.description, row.image_url, row.bad_luck_index));
        console.log("[DAO] Cards:", cards);
        resolve(cards);
      }
    });
  });
};

////////////////


export const getRandomCard = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM Card ORDER BY RANDOM() LIMIT 1`;
    db.get(sql, [], (err, row) => {
      if (err)
        reject(err);
      else
        resolve(new Card(row.description, row.image_url, row.bad_luck_index));
    });
  });
};


export const getCardById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM Card WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
      if (err) reject(err);
      else if (!row) resolve(null);
      else resolve(new Card(row.description, row.image_url, row.bad_luck_index));
    });
  });
};


