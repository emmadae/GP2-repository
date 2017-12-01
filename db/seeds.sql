use c6mw1yoy0se23py8;

INSERT INTO community_cards (card_title, card_text, card_value)
VALUES ("Back Taxes!", "You owe $150 in backtaxes!", 150),
("@$<ERROR>!@#!", "ERROR CODE:2010 PAY $100 TO REMOVE VIRUS", 100),
("Income Tax Refund", "In Extreme Capitalism, Government Pay You. Collect $20", 20),
("Favor", "Earn $25 for 'services'. Yeah we'll let your mind fill in the blanks", 25),
("Win A Bet", "None of them thought Trump would win. You just have a gambling addiction. Collect $50 from all players", 50),
("Second Place Beauty Contest", "It's okay, You convined the winner to eat a bunch of Kalteen bars. you Collect $10", 10),
("Pay School Tax", "Take that $150 punch on the chin if you don't have kids." 150),
("Doctor's Fee", "Let's be honest, paying $50 to go to the doctor is a steal. You're pretty much robbing them!", 50),
("You Inherit Money!", "Wait you had an uncle?!?", 100),
("Pay Hospital", "They see twins... You see Thunderdome crib edition. Pay $100", 100),
("Moonlight as Santa", "Nothing says the holidays like a funny smelling costime and terrified childen. Collect $100.", 100),
("Bank Error in Your Favor", "You'd be a lot more excited if you didn't notice it AND had to call 3 times for your $200", 200),
("Go to Jail!", "Don't collect $200 if you pass go. Man if you drew this early in the game you're screwed!", NULL),
("Drag Race in your Prius", "Go directly to <GO>, lose your dignity on the way.", NULL),
("Pay Street Repairs", "How were you supposed to know 50 roman candles could wreak such havoc? Pay for each upgraded property", 60),
("Earn Money From BitCoins", "No one can really explain what they are or how they work, but they just made you $45, so do you really care?", 45);

INSERT INTO chance_cards (card_title, card_text, card_value)
VALUES ("Advance to Go", "Advance to Go. Collect $200", 200),
("Surprise Vacation!", "Take your family on a surprise vacation. Advance to <GO>", 200),
("Train Ride", "Take a Ride on the <Reading RailRoad>. If you pass GO, collect $200.", 200),
("Down on the Board Walk", "Advance token to the board walk", NULL),
("Tennants complain", "Pay for each upgraded property you own", 50),
("Go Back 3 Spaces", "You forgot your wallet...again...", NULL),
("Advance to <GO>", "I've run out of clever remarks, just take your $200 and leave.", 200),
("Adventure Is Out There!", "Go to the nearest railroad and pay double, unless it's unowned.", 2),
("Bank Pays You", "It's just $50... don't get too excited.", 50),
("Building and Loan Mature", "Somebody who understands this stuff probably should have written the cards. Have $150!", 150),
("Elected Board Chairman", "Pay each player $50 to make sure that one video from college never appears.", 50),
("Pay Poor Tax", "You have to admit, it's an interesting social commentary based on whether your winning or not. Pay $15.", 15),
("Go To Jail!", "You shouldn't have tried to steal from the guard with such a low pickpocketing skill. Next time quicksave first.", NULL),
("Advance to <PLACE>", "See the sights, look at the stuff, locations are dynamically generated so pretend I said something fitting.", NULL),
("Advance to <PLACE2>", "See the sights, look at the stuff, locations are dynamically generated so pretend I said something fitting.", NULL);

INSERT INTO players(user_name, user_money, is_turn, pos_id, in_jail)
VALUES("Paul1", 1500, true, 1, 0),
("Emma2", 1500, false, 1, 0),
("David", 1500, false, 1, 0),
("Just Justin", 1500, false, 1, 0);

INSERT INTO places(id_grp, c_owner, rent_lvl, name, rent, active)
VALUES
--BOTTOM ROW OF BOARD--
(NULL, "bank", 0, "GO", NULL, false),
(1, "bank", 0, "Purple1", 60, false),
(NULL, "bank", 0, "Community Chest1", NULL, false),
(1, "bank", 0, "Purple2", 60, False),
(NULL, "bank", "Income Tax", NULL, false),
(9, "bank", 0, "RR1", 200, False),
(2, "bank", 0, "Blue1", 100, false),
(NULL, "bank", "Chance1", NULL, false),
(2, "bank", "Blue2", 100, false),
(2, "bank", "Blue3", 120, false),

--LEFT ROW OF BOARD--
(NULL, "bank", 0, "JAIL", NULL, false),
(3, "bank", 0, "Pink1", 140, false),
(10, "bank", 0, "Utility1", 150, false),
(3, "bank", 0, "Pink2", 140, false),
(3, "bank", 0, "Pink3", 160, false),
(9, "bank", 0, "RR2", 200, False),
(4, "bank", 0, "Orange1", 180, false),
(NULL, "bank", 0, "Community Chest2", NULL, false),
(4, "bank", 0, "Orange2", 180, false),
(4, "bank", 0, "Orange3", 200, false),

--TOP ROW OF BOARD--
(NULL, "bank", 0, "FREE PARKING", NULL, false),
(5, "bank", 0, "Red1", 220, false),
(NULL, "bank", 0, "Chance2", NULL, false),
(5, "bank", 0, "Red2", 220, false),
(5, "bank", 0, "Red3", 240, false),
(9, "bank", 0, "RR3", 200, false),
(6, "bank", 0, "Yellow1", 260, false),
(6, "bank", 0, "Yellow2", 260, false),
(10, "bank", 0, "Utility2", 150, false),
(6, "bank", 0, "Yellow3", 280, false);

--RIGHT ROW OF BOARD--
(NULL, "bank", 0, "GO TO JAIL", NULL, false),
(7, "bank", 0, "Green1", NULL, false),
(7, "bank", 0, "Green2", NULL, false),
(NULL, "bank", 0, "Community Chest3", NULL, false),
(7, "bank", 0, "Green3", NULL, false),
(9, "bank", 0, "RR4", 200, false),
(NULL, "bank", 0, "Chance3", NULL, false),
(8, "bank", 0, "Awesome1", 350, false),
(NULL, "bank", 0, "Luxury Tax", 75, false),
(8, "bank", 0, "Awesome2", 400, false);
