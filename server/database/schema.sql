

CREATE TABLE IF NOT EXISTS User (
  id INTEGER PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  salt TEXT NOT NULL,
  saltedPassword TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Card (
  id INTEGER PRIMARY KEY,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  bad_luck_index REAL UNIQUE NOT NULL
);


CREATE TABLE IF NOT EXISTS Game (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  -- status TEXT,
  mistake_count INTEGER DEFAULT 0,
  cards_won_count INTEGER DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES User(id)
);

INSERT OR IGNORE INTO User (username, email, salt, saltedPassword) VALUES
  ('Elena', 'faveroelena2@gmail.com', 'cc5d394129172ad6', 'a6bf999e5837a06c55ec0273a4b581090201e63f9ec1ee984fe58aeafa6545e6'),
  ('Mario', 'mariobros@gmail.com', 'd3e4e8f2767c5a2f', '46a1906e14c17bd134fc3cbcdd615586cb2f36996218b88ba1680d34ba4ecc69');


INSERT OR IGNORE INTO Card (description, image_url, bad_luck_index) VALUES
  ('You slip on a wet hotel floor', '/images/slip.jpg', 1.0),
  ('Mosquitoes bite you all night', '/images/mosquito.jpg', 2.5),
  ('The beach is closed for maintenance', '/images/beach_closed.jpg', 4.0),
  ('Your phone charger breaks during the trip', '/images/broken_charger.jpg', 5.0),
  ('Your room has mold infestation', '/images/mold_room.jpg', 6.0),
  ('You wake up late and miss a tour', '/images/missed_tour.jpg', 7.0),
  ('The hotel is next to a noisy nightclub', '/images/noisy_hotel.jpg', 7.5),
  ('Your luggage breaks as soon as you arrive', '/images/broken_luggage.jpg', 8.0),
  ('Your hotel loses your reservation', '/images/lost_booking.jpg', 11.0),
  ('You get locked out of your hotel room', '/images/locked_out.jpg', 12.0),
  ('You lose tickets to an important show', '/images/lost_tickets.jpg', 13.0),
  ('Taxi takes you to the wrong place', '/images/wrong_place.jpg', 14.0),
  ('You end up in a haunted hostel', '/images/haunted_hostel.jpg', 15.5),
  ('The main attraction is closed', '/images/closed_site.jpg', 17.0),
  ('The plane experiences severe turbulence', '/images/turbulence.jpg', 17.5),
  ('You get stuck in an elevator', '/images/stuck_elevator.jpg',18.0),
  ('You fall during a photo tour', '/images/fall_tour.jpg', 19.0),
  ('You get fined for a misunderstood rule', '/images/fine.jpg', 21.5),
  ('You are stuck in customs for hours', '/images/customs_delay.jpg', 23.5),
  ('You get stuck at the airport for 12 hours', '/images/airport_delay.jpg', 26.0),
  ('Flights are canceled due to a strike', '/images/strike.jpg', 30.0),
  ('Wild animals invade your campsite', '/images/wild_animals.jpg', 31.5),
  ('You must share a bed with a stranger', '/images/roommate.jpg', 34.0),
  ('You get caught in the middle of a protest', '/images/protest.jpg', 38.0),
  ('You get a severe sunburn on day one', '/images/sunburn.jpg', 41.5),
  ('Your flight is overbooked and you are left behind', '/images/overbooked.jpg', 42.0),
  ('You confuse time zones and miss your flight', '/images/timezone_mistake.jpg', 42.5),
  ('You miss your flight by minutes', '/images/missed_flight.jpg', 43.0),
  ('Your room is infested with bugs', '/images/bugs_room.jpg', 48.0),
  ('Your hotel turns out to be fake', '/images/fake_hotel.jpg', 50.0),
  ('You drink unsafe water and get sick', '/images/bad_water.jpg', 53.5),
  ('You have an allergic reaction to food', '/images/food_allergy.jpg', 54.0),
  ('You fall sick on the first day of vacation', '/images/sick_day1.jpg', 55.0),
  ('You get lost in a foreign city without GPS', '/images/lost_city.jpg', 58.5),
  ('You get pickpocketed in a crowded market', '/images/pickpocket.jpg', 59.0),
  ('You lose your boarding pass', '/images/lost_boarding.jpg', 60.0),
  ('Your backpack with documents gets stolen', '/images/bag_theft.jpg', 61.0),
  ('You leave your luggage in a taxi', '/images/lost_luggage.jpg', 61.5),
  ('Your luggage is sent to the wrong destination', '/images/wrong_bag.jpg', 62.0),
  ('You forget your passport at home', '/images/passport.jpg', 65.0),
  ('You lose your phone permanently', '/images/lost_phone.jpg', 70.0),
  ('Your phone falls from a bridge into water', '/images/phone_bridge.jpg', 71.5),
  ('You get denied visa at the airport', '/images/visa_denied.jpg', 72.0),
  ('You get robbed while sleeping on a train', '/images/train_theft.jpg', 80.0),
  ('You discover your credit card is blocked', '/images/blocked_card.jpg', 81.0),
  ('You get robbed at night', '/images/night_robbery.jpg', 84.5),
  ('Your rental car is stolen', '/images/car_stolen.jpg', 85.0),
  ('You lose your wallet at the airport', '/images/theft_airport.jpg', 85.5),
  ('You break a leg hiking a mountain', '/images/broken_leg.jpg', 90.0),
  ('you get attacked at night in a city far from the hotel', '/images/attack.jpg', 100.0);