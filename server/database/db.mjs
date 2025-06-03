import sqlite from 'sqlite3';

/*
TODO:
- prima hai creato il db (in codice qua)
- poi hai cancellato quel codice e lo hai solo aperto
questo perchpè altrimenti niente andava
*/


const db = new sqlite.Database('./database/db.sqlite', (err) => {
    if (err) {
        console.error('Error opening database ' + err.message);
    }
});

export default db;
