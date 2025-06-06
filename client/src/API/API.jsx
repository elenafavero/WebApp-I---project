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
            return new Card(card.description, card.imageUrl, card.bad_luck_index);
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
            return cards.map(card => new Card(card.description, card.imageUrl, card.bad_luck_index));
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
        console.log("[API] Login successful, fetching user data");
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





export {getRandomCardExcluding, getThreeRandomCards, logIn, logout, getCurrentUser};