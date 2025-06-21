class User {
    constructor(username, email) {
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash; 
    }
}

class Card {
    constructor(id, description, imageUrl, bad_luck_index) {
        this.id = id;
        this.description = description;
        this.imageUrl = imageUrl; 
        this.bad_luck_index = bad_luck_index;       
    }
}

class Game {
    constructor(id = 0, userId) {
        this.id = this.id;
        this.userId = userId; 
        this.rounds = []; 
    }
}


export { User, Card, Game };