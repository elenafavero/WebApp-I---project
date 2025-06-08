import { User, Card, Game } from "../../../server/models/models.mjs";

const URI = "http://localhost:3001/api"



async function getRandomCardExcluding(excludeIds = []) {
    try {
        const queryString = excludeIds.length > 0 ? `?exclude=${excludeIds.join(',')}` : '';

        const response = await fetch(`${URI}/round/exclude${queryString}`, {
            credentials: 'include'
        });
        if (response.ok) {
            const card = await response.json();
            return new Card(card.id, card.description, card.imageUrl, card.bad_luck_index);
        } else {
            throw new Error("API error: " + response.status);
        }
    } catch (error) {
        throw new Error("Network error: " + error.message);
    }
}






// get 3 cards randomly
async function getThreeRandomCards() {
    try {
        const response = await fetch(`${URI}/round/start`, {
            credentials: 'include'
        });
        if (response.ok) {
            const cards = await response.json();
            return cards.map(card => new Card(card.id, card.description, card.imageUrl, card.bad_luck_index));
        } else {
            throw new Error("API error: " + response.status);
        }
    } catch (error) {
        throw new Error("Network error in getting three random cards: " + error);
    }
}


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

    } else {
        console.error("[API] Login failed with status:", response.status);
        const err = await response.text()
        throw err;
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


async function getCurrentUser() {
    const res = await fetch(URI + '/session/current', {
        credentials: 'include'
    });

    if (!res.ok) throw new Error("Not authenticated");
    return res.json();
}



async function saveGameToDB(gameData) {
    const response = await fetch(`${URI}/game/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(gameData)
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(err);
    }

    return await response.json(); // contiene gameId
}


async function getUserGames(userId) {
    try {
        const response = await fetch(`${URI}/users/${userId}/games`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error('Failed to fetch user games: ' + error.message);
    }
}

async function validateInterval(start_index, end_index, table_index ) {
  try {
    const response = await fetch(`${URI}/round/guess`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ start_index, end_index, table_index  }),
    });

    if (!response.ok) throw new Error(`Server error ${response.status}`);

    const data = await response.json();
    return data.correct; // true o false
  } catch (error) {
    console.error("API validateInterval error:", error);
    throw error;
  }
}









export { getRandomCardExcluding, getThreeRandomCards, logIn, logout, getCurrentUser, saveGameToDB, getUserGames, validateInterval};