// *********************************************************************************
// CONNECTION.JS - THIS FILE INITIATES THE CONNECTION TO MYSQL
// *********************************************************************************

// Dependencies
var Sequelize = require("sequelize");

// Creates mySQL connection using Sequelize
var sequelize = new Sequelize("c6mw1yoy0se23py8", "root", "", {
  host: "localhost",

  //most default ports are 3306. change this if you're getting an error
  port:3307,
  dialect: "mysql",

  //we may want to update these?!? not sure what they do.
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

// Exports the connection for other files to use
module.exports = sequelize;
