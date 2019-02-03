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
var pollPageList = [];

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
// poll page to list polls
app.get("/poll", (req, res) => {
  const templateVars = {};
  console.log('this is pollPageList', pollPageList)
  templateVars.pollList = pollPageList;
  console.log(templateVars)
  // const templateVars = { poll: poll, user: email, cookie: cookie };
  res.render("poll", templateVars);
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
  const id = req.params.id;
  // const isValidcookie = req.session.pollId;
  const isValidcookie = 1;
  const table = "polls"
  const value = "value"
  let templateVars = {};
  if (isValidcookie){
      let pollTitle = returnQueries
      .getValue(table, value, id)
      .then((returnValue) => {
        console.log("this is returnValue:",returnValue)
        templateVars.pollName = returnValue;
        })

      .then(() => {

      let optionVars = returnQueries
      .getOptions(id).then((OptionInput) => {
        //console.log(OptionInput)
        if(OptionInput.length > 0){
          const description = "new world"
          templateVars.poll =id
          templateVars.value = OptionInput
          templateVars.description = description

        //poll count goes here
        res.render("pollshow", templateVars);

        }else{
        res.status(403).send('Please input valid option');
        }
      })
        // console.log("this is templateVars",templateVars)
        // res.render("pollshow", templateVars);
      })

      .catch(err => console.log(err));


    }else{
      res.redirect(302,'/poll/');
    }

});


// poll results page
app.get("/poll/results/:id", (req, res) => {

  const id = req.params.id;
  // const isValidcookie = req.session.pollId;
  const isValidcookie = 1;
  const table = "polls"
  const value = "value"
  let templateVars = {};
  if (isValidcookie){
      let pollTitle = returnQueries
      .getValue(table, value, id)
      .then((returnValue) => {
        console.log("this is returnValue:",returnValue)
        templateVars.pollName = returnValue;
        })

      .then(() => {

      let optionVars = returnQueries
      .getOptions(id).then((OptionInput) => {
        //console.log(OptionInput)
        if(OptionInput.length > 0){
          const description = "new world"
          templateVars.poll =id
          templateVars.value = OptionInput
          templateVars.description = description

        //poll count goes here
        res.render("results", templateVars);

        }else{
        res.status(403).send('Please input valid option');
        }
      })

      })

      .catch(err => console.log(err));


    }else{
      res.redirect(302,'/poll/');
    }

});


//temp test results page without vars

app.get("/test", (req,res)=>{
res.render("results" )
});


/* ******** POST REQUESTS ******* */

//poll page to list polls

app.post("/poll", (req, res) => {
  let templateVars = {};
  console.log("email on server get :",req.body.email)
  const userEmail = req.body.email;

  let pollList = returnQueries
      .getPollIdFromEmail(userEmail)
      .then((returnValue) => {
        if (returnValue){
          console.log("this is returnValue :", returnValue)
          // finalArray = returnValue.map(function (obj) {
          // return obj.id;
          // });
          // var pollPageList = [];
          returnValue.forEach(function(poll) {
          pollPageList.push(poll.id);
          });
        // templateVars.pollList = polls;
        // console.log(templateVars)

        }
      })
      res.json({pollRedirect: "http://localhost:8080/poll/"});
  res.render("poll", templateVars);
});

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
          let urlAdmin = "http://localhost:8080/poll/" +pollId[0]+"/results/";

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

//give options points based on vote
function givePoints(options, optionId) {
  let optionsAndRank = []
  options.forEach((option, rank) => {
    let pointWeight = options.length - (rank + 1);
    optionsAndRank.push({
      value: option,
      pointWeight: pointWeight
    })
  })
  return optionsAndRank;
}

// poll vote page
app.post("/poll/:id", (req, res) => {
  const id = req.params.id;

  //check if user has voted
  returnQueries.checkCookie(req.session.user_id, req.params.id).then((user) => {
    if(user[0]) throw "already voted";

    let inputOptions = req.body.votes;
    let rankedOptions =  givePoints(inputOptions);

    //add options with points to db if user hasnt voted
    rankedOptions.forEach((option) => {
      insertQueries.insertVotes(req.params.id, option.value, req.session.user_id, option.pointWeight)
    })

    //send email
    .then(() => {

          //create poll, generate poll id
          let urlShare = "http://localhost:8080/poll/"+id;
          let urlAdmin = "http://localhost:8080/poll/"+id+"/results/";

          //send email
          sendEmail(userEmail,urlShare,urlAdmin);
        })



  }).catch(err => console.log(err))
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
