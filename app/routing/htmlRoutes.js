
var path = require("path");

module.exports = function(app) {


app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.get("/checkplayers", function(req, res) {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});
};


// Requiring our custom middleware for checking if a user is logged in


//UNCOMMENT THIS BEFORE PUSHING!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// var isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {

  app.get("/", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/game");
    }
    res.sendFile(path.join(__dirname, "../public/registration.html"));
  });

  app.get("/login", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/game");
    }
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/lobby", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/lobby.html"));
  });

    app.get("/game", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/game.html"));
  });

};
