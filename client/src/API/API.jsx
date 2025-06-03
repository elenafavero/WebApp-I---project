import { User, Card, Game } from "../../../server/models/models.mjs";

const URI = "http://localhost:3001/api"


/*
export async function getRandomCardExcluding(excludeIds = [], round_number) {
    try {
        const queryString = excludeIds.length > 0 ? `?exclude=${excludeIds.join(',')}` : '';
        const response = await fetch(`${URI}/round/${round_number}${queryString}`);
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
*/



// get 3 cards randomly
export async function getThreeRandomCards() {
    console.log("[API] getThreeRandomCards called");
    try {
        const response = await fetch(`${URI}/round/start`);
        if (response.ok) {
            const cards = await response.json();
            console.log("[API] Cards:", cards);
            return cards.map(card => new Card(card.description, card.imageUrl, card.bad_luck_index));
        } else {
            throw new Error("API error: " + response.status);
        }
    } catch (error) {
        throw new Error("Network error in getting three random cards: " + error);
    }
}



///////


// get 1 card randomly
export async function getRandomCard() {
    try {
        const response = await fetch(`${URI}/cards/random`);
        if (response.ok) {
            const card = await response.json();
            return new Card(card.description, card.imageUrl, card.bad_luck_index);
        }
        else {
            throw new Error(error);
        }
    } catch (error) {
        throw new Error("Network error in getting a random card: " + error);
    }
}