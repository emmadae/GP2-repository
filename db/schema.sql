-- Drops the todolist if it exists currently --
DROP DATABASE IF EXISTS c6mw1yoy0se23py8;
-- Creates the "todolist" database --
CREATE DATABASE c6mw1yoy0se23py8;



use c6mw1yoy0se23py8;

CREATE TABLE players(
user_id INTEGER (1) PRIMARY KEY AUTO_INCREMENT,
user_name VARCHAR (50) NOT NULL,
user_money INTEGER (255),
is_turn BOOLEAN,
pos_id INTEGER (2) NOT NULL,
in_jail INTEGER (1) NOT NULL,
user_image VARCHAR (255) NOT NULL
);


CREATE TABLE places(
pos_id INTEGER (2) PRIMARY KEY AUTO_INCREMENT NOT NULL,
id_grp INTEGER (1),
c_owner VARCHAR (50),
rent_lvl INTEGER (1) NOT NULL,
name VARCHAR (255) NOT NULL,
rent INTEGER (255),
active BOOLEAN
);


CREATE TABLE community(
com_id INTEGER (2) PRIMARY KEY AUTO_INCREMENT NOT NULL,
card_title VARCHAR (255) NOT NULL,
card_text TEXT NOT NULL,
card_value INTEGER (255) DEFAULT NULL
);

CREATE TABLE chance(
cha_id INTEGER (2) PRIMARY KEY AUTO_INCREMENT NOT NULL,
card_title VARCHAR (255) NOT NULL,
card_text TEXT NOT NULL,
card_value INTEGER (255) DEFAULT NULL
);
