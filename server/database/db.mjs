import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs/promises';

const db = await open({
  filename: './db.sqlite',
  driver: sqlite3.Database
});

const schema = await fs.readFile('./schema.sql', 'utf-8');
await db.exec(schema);

export default db;