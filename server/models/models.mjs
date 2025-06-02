class User {
    constructor(username, email) {
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash; // lato client: non dovrai mettere questa proprietà
    }
}

class Card {
    constructor(description, imageUrl, bad_luck_index) {
        this.description = description;
        this.imageUrl = imageUrl; // URL o path all'immagine rappresentativa (/server/images)
        this.bad_luck_index = bad_luck_index;       // bad luck index
    }
}

/*
class Round {
    constructor(id, gameId, card_id) {
        // this.id = id;
        this.gameId = gameId;
        this.card_id = card_id; // ID della carta giocata in questo round
        this.won = false; // Indica se il round è stato vinto
        // this.roundNumber = roundNumber; // Numero del round, se necessario
    }
}
*/


class Game {
    constructor(id = 0, userId) {
        this.id = this.id;
        this.userId = userId; // ID dell'utente che ha creato il gioco
        this.rounds = []; // Array di Round
    }
}


export { User, Card, Game };