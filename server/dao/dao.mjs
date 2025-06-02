import db from '../db.js';
import { Card } from './models/models.js';


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


export const getThreeRandomCards = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM Card ORDER BY RANDOM() LIMIT 3`;
    db.all(sql, [], (err, rows) => {
      if (err) 
        reject(err);
      else 
        resolve(rows.map(row => new Card(row.description, row.image_url, row.bad_luck_index)));
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


