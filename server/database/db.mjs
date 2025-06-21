import sqlite from 'sqlite3';

const db = new sqlite.Database('./database/db.sqlite', (err) => {
    if (err) {
        console.error('Error opening database ' + err.message);
    }
});

export default db;
