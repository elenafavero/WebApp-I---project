import db from '../database/db.mjs';
import crypto from 'crypto';


export const getUser = (email, password) => {
    console.log('[DAO-USER] Fetching user with email:', email);
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM user WHERE email = ?';
        db.get(sql, [email], (err, row) => {
            if (err) {
                reject(err);
            }
            else if (row === undefined) {
                resolve(false);
            }
            else {
                const salt = row.salt;
                const db_hashedPassword = row.saltedPassword;
                const user = { id: row.id, email: row.email, name: row.username };
                console.log('[DAO-USER] salt:', salt);
                console.log('[DAO-USER] db_hashedPassword:', db_hashedPassword);
                console.log('[DAO-USER] user:', user);

                crypto.scrypt(password, salt, 32, function (err, hashedPassword) {
                    if (err) {
                        console.log('[DAO-USER] Error hashing password:', err);
                        reject(err);
                    }
                    if (!crypto.timingSafeEqual(Buffer.from(db_hashedPassword, 'hex'), hashedPassword)) {
                        console.log('[DAO-USER] Password does not match');
                        resolve(false);
                    }
                    else {
                        console.log('[DAO-USER] Password matches, returning user:', user);
                        resolve(user);
                    }
                        
                });
            }
        });
    });
};