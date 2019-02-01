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
const cookieSession = require('cookie-session');

app.use(cookieSession({
  secret: "super_secret"
}));

const insertQueries = require('./public/scripts/insertQueries.js')(knex);
const returnQueries = require('./public/scripts/returnQueries.js')(knex);

// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');

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

//random string generate function used for ID generation
function generateRandomString() {
  let text = '';
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let randomLetterInc = 0; randomLetterInc < 6; randomLetterInc++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// poll vote page
app.get("/poll/:id", (req, res) => {
  if(!req.session.user_id){
    req.session.user_id = generateRandomString();
  }
 const templateVars = {};
  const userID = 1;
  if (userID ){
    // const templateVars = { poll: poll, user: email, cookie: cookie };
    console.log('in get poll/:id request')
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

  console.log(req.body.email)
  const userEmail = req.body.email;
  const pollValue = req.body.pollValue;
  const options = req.body.options;

  if (userEmail){
    let templateVars;
    // const templateVars = { poll: poll, user: email, cookie: cookie };

    insertQueries.insertUser(userEmail)
      .then(() => {
        insertQueries
          .insertPoll(userEmail, pollValue, options, options, insertQueries.insertOptions)
          .then((pollId) => {

          //create poll, generate poll id
          let urlShare = "http://localhost:8080/poll/"+pollId[0];
          let urlAdmin = "http://localhost:8080/results/"+pollId[0];

          //send email
          sendEmail(userEmail,urlShare,urlAdmin);

          res.json({url: urlShare})
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
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



function sendEmail(to,pollLink,adminLink){
  console.log(pollLink)

  sgMail.setApiKey('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');
  const msg = {
    to: to,
    from: to,
    subject: 'ChooseyBoy Poll links',
    text: 'Please find your poll share and Admin links below',
    html:"Link to the poll: "+ pollLink + " <br>" + "Admin link : "+ adminLink,
  };
  sgMail.send(msg);
}

/*
route paths
  GET - /new_poll
  POST - /new_poll
  GET - /poll/:id
  POST - /poll/:id
  GET - /poll/:id/results
*/
