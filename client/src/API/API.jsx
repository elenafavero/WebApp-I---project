import { User, Card, Game } from "../../../server/models/models.mjs";

const URI = "http://localhost:3001/api"


/* GIUSTO */
async function logIn(credentials) {
    const bodyObject = {
        email: credentials.email,
        password: credentials.password
    }
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
}


async function logout() {
    const response = await fetch(URI + `/logout`, {
        method: 'POST',
        credentials: 'include',
    });
    if (response.ok)
        return null;
}



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
        throw new Error("Failed to fetch a new random card: " + error.message);
    }
}






// get 3 cards randomly
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
        throw new Error("Failed to fetch three random cards: " + error);
    }
}




/*
async function getCurrentUser() {
    const res = await fetch(URI + '/session/current', {
        credentials: 'include'
    });

    if (!res.ok) throw new Error("Not authenticated");
    return res.json();
}
*/

// GIUSTO 
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
        throw new Error('Failed to save game: ' + error.message);
    }
}


// GIUSTO 
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
        throw new Error('Failed to fetch user games: ' + error.message);
    }
}

// GIUSTO 
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
        throw new Error('Failed to check card interval: ' + error.message);
    }
}









export { fetchRandomCardExcluding, fetchThreeRandomCards, logIn, logout, /*getCurrentUser,*/ saveGameToDB, fetchUserGames, validateInterval };