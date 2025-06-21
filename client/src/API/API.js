import { Card } from "../../../server/models/models.mjs";

const URI = "http://localhost:3001/api"


async function logIn(credentials) {
    const bodyObject = {
        email: credentials.email,
        password: credentials.password
    }
    try {
        const response = await fetch(`${URI}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(bodyObject)
        })
        if (response.ok) {
            const user = await response.json();
            return user;

        } else if (response.status === 422) {
            const errorData = await response.json();
            throw errorData.errors;

        } else if (response.status === 401) {
            const err = await response.text();
            throw [{ msg: err }];

        } else {
            const err = await response.text();
            throw [{ msg: "Unknown error: " + err }];
        }
    } catch (error) {
        throw error;
    }
}


async function logout() {
    try {
        const response = await fetch(URI + `/logout`, {
            method: 'POST',
            credentials: 'include',
        });
        if (response.ok)
            return null;
        else {
            throw new Error("API error: " + response.status);
        }
    } catch (error) {
        throw new Error(error.message);
    }
}


// retrieves a random card, excluding the ones with the given IDs
async function fetchRandomCardExcluding(excludeIds = []) {
    try {
        const queryString = excludeIds.length > 0 ? `?exclude=${excludeIds.join(',')}` : '';

        const response = await fetch(`${URI}/cards/1${queryString}`, {
            credentials: 'include'
        });
        if (response.ok) {
            const card = await response.json();
            return new Card(card.id, card.description, card.imageUrl, card.bad_luck_index);
        } else {
            throw new Error("API error: " + response.status);
        }
    } catch (error) {
        throw new Error(error.message);
    }
}




// retrieves 3 cards randomly
async function fetchThreeRandomCards() {
    try {
        const response = await fetch(`${URI}/cards/3`, {
            credentials: 'include'
        });
        if (response.ok) {
            const cards = await response.json();
            return cards.map(card => new Card(card.id, card.description, card.imageUrl, card.bad_luck_index));
        } else {
            throw new Error("API error: " + response.status);
        }
    } catch (error) {
        throw new Error(error.message);
    }
}




async function saveGameToDB(gameData) {
    try {
        const response = await fetch(`${URI}/game`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ date: new Date().toISOString(), rounds: gameData.rounds, mistakeCount: gameData.mistakeCount, cardsWonCount: gameData.cardsWonCount })
        });

        if (!response.ok) {
            throw new Error(`Application error: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
}


async function fetchUserGames(userId) {
    try {
        const response = await fetch(`${URI}/users/${userId}/games`, {
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error(`Application error: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
}


async function validateInterval(start_index, end_index, table_index) {
    try {
        const response = await fetch(`${URI}/round/guess`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ start_index, end_index, table_index }),
        });

        if (!response.ok) {
            throw new Error(`Application error: ${response.status}`);
        }
        const data = await response.json();
        return data.correct; // true or false
    } catch (error) {
        throw new Error(error.message);
    }
}



export { fetchRandomCardExcluding, fetchThreeRandomCards, logIn, logout, saveGameToDB, fetchUserGames, validateInterval };