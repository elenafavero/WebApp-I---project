import fs from 'fs';
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('db.sqlite');

const schema = fs.readFileSync('schema.sql', 'utf8');

db.exec(schema, (err) => {
  if (err) {
    console.error('Errore durante la creazione del DB:', err);
  } else {
    console.log('Database creato con successo!');
  }
  db.close();
});