"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));
console.log(__dirname)
// Mount all resource routes
app.use("/api/users", usersRoutes(knex));


/* ******** GET REQUESTS ******* */
// Home page
app.get("/", (req, res) => {
  const templateVars = {};
  // const templateVars = { poll: poll, user: email, cookie: cookie };
  res.render("index", templateVars);
});

// new poll page
app.get("/new_poll", (req, res) => {
  const templateVars = {};
  // const templateVars = { poll: poll, user: email, cookie: cookie };
  res.render("new_poll", templateVars);
});

// poll vote page
app.get("/poll/:id", (req, res) => {
  // const userID = req.session.userID;
 const templateVars = {};
  const userID = 1;
  if (userID ){
    // const templateVars = { poll: poll, user: email, cookie: cookie };

    res.render("pollshow", templateVars);
  }else{
    const userID = bcrypt.hashSync(ID(PK), 10);
    req.session.userID = userID;
  }
});


// poll results page
app.get("/poll/:id/results", (req, res) => {
  const templateVars = { poll: poll, user: email, cookie: cookie };
  res.render("results", templateVars);
});


/* ******** POST REQUESTS ******* */

// new poll page
app.post("/new_poll", (req, res) => {
  // const email = req.body.email;
  const email = "test@test.com";
  if (email){
    // const templateVars = { poll: poll, user: email, cookie: cookie };

    //create poll

    res.render("/poll/:id", templateVars);
    res.redirect('/poll/:id');
  }else{
    res.redirect(302,'/');
  }

});


// poll vote page
app.post("/poll/:id", (req, res) => {
  const userID = req.session.userID;
  const isValidcookie = bcrypt.compareSync(userID);
  if (isValidcookie){
    const templateVars = { poll: poll, user: email, cookie: cookie };
  //poll count goes here
  res.render("pollshow", templateVars);
  }else if(isValidcookie /* if already voted */){

    const err = "You are not allowed here!";
    const templateVars = { poll: poll, cookie: cookie, error: err };
    res.render("pollshow", templateVars);
  }else{
    res.redirect(302,"/");
  }
});





app.listen(PORT, () => {
  console.log("Choosey Boy listening on port " + PORT);

});

/*
route paths
  GET - /new_poll
  POST - /new_poll
  GET - /poll/:id
  POST - /poll/:id
  GET - /poll/:id/results
*/
