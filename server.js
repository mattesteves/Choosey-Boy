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

var pollPageList2 = [];


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

// Mount all resource routes
app.use("/api/users", usersRoutes(knex));


/* ******** GET REQUESTS ******* */
// Home page
app.get("/", (req, res) => {
  const templateVars = {};
  res.render("index", templateVars);
});
// poll page to list polls
app.get("/poll", (req, res) => {
  const templateVars = {};
  templateVars.pollList = pollPageList2;

  res.render("poll", templateVars);
});

// new poll page
app.get("/new_poll", (req, res) => {
  const templateVars = {};
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

  const id = req.params.id;

  //check if user has voted
  returnQueries.checkCookie(req.session.user_id, req.params.id).then((user) => {
    if(user[0]) res.redirect("http://localhost:8080/poll/" + id + "/results/")
  })
  .then(() => {
    let templateVars = {};

    let pollTitle = returnQueries
    .getValue('polls', 'value', id)
    .then((returnValue) => {
      templateVars.pollName = returnValue;
    })
    .then(() => {
      let optionVars = returnQueries
      .getOptions(id).then((OptionInput) => {

        if(OptionInput.length > 0){
          let optionValues = [];
          let optionDescriptions = [];
          OptionInput.forEach((option) => {
            optionValues.push(option.value);
            optionDescriptions.push(option.description);
          })
          templateVars.poll =id
          templateVars.value = optionValues
          templateVars.descriptions = optionDescriptions

        //poll count goes here
        res.render("pollshow", templateVars);

        } else{
        res.status(403).send('Please input valid option');
        }
      })
    })
    .catch(err => console.log(err));
  })

});

//page that shows the votes and results urls after poll is created
app.get("/poll/:id/urls", (req, res) => {
  const pollId = req.params.id;
  const urlShare = "http://localhost:8080/poll/" + pollId;
  const urlAdmin = "http://localhost:8080/poll/" + pollId + "/results/";
  let templateVars = {
    voteUrl: urlShare,
    resultUrl: urlAdmin
  }
  res.render('poll_links', templateVars)
})

// poll results page
app.get("/poll/:id/results", (req, res) => {
  const pollId = req.params.id;
  let totalPoints = 0;
  let templateVars = {};
  let optionList = [];

  returnQueries.optionWeights(pollId, returnQueries.getOptions, returnQueries.getOptionId, returnQueries.weightSum, returnQueries.getValue)
  .then(options => {
    for(let option in options) {
      totalPoints += options[option].points;
    }
    templateVars.totalPoints = totalPoints;
    for(let option in options){
      optionList.push({
        value: option,
        points: options[option].points,
        description: options[option].description,
        proportion: options[option].points / totalPoints
      })
    }
    returnQueries.getValue('polls', 'value', pollId)
    .then((pollName) => {
      templateVars.pollValue = pollName;
      templateVars.options = optionList;

      res.render("results", templateVars);
    })
  })
});


//temp test results page without vars

app.get("/test", (req,res)=>{
  res.render("poll_links" )
});


/* ******** POST REQUESTS ******* */

//poll page to list polls

app.post("/poll", (req, res) => {
  let templateVars = {};
  const userEmail = req.body.email;

  let pollList = returnQueries
      .getPollIdFromEmail(userEmail)
      .then((returnValue) => {
        if (returnValue){
          pollPageList2 = returnValue;
          returnValue.forEach(function(poll) {
          });
        }
      }).then(() => {
        res.json({pollRedirect: "http://localhost:8080/poll/"});
        res.render("poll", templateVars);

      });

});

// new poll page
app.post("/new_poll", (req, res) => {

  const userEmail = req.body.email;
  const pollValue = req.body.pollValue;
  const options = req.body.options;
  const descriptions = req.body.descriptions;

  if (userEmail){
    let templateVars;
    // const templateVars = { poll: poll, user: email, cookie: cookie };

    insertQueries.insertUser(userEmail)
      .then(() => {
        insertQueries
          .insertPoll(userEmail, pollValue, options, descriptions, insertQueries.insertOptions)
          .then((pollId) => {

          //create poll, generate poll id
          let urlShare = "http://localhost:8080/poll/"+pollId[0];
          let urlAdmin = "http://localhost:8080/poll/" +pollId[0]+"/results/";

          let pollLinksPath = `/poll/${pollId[0]}/urls`;

          //send email
          sendEmail(userEmail,urlShare,urlAdmin);

          res.json({url: pollLinksPath});
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
  let optionsAndRank = [];
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

    //create poll, generate poll id
    let urlShare = "http://localhost:8080/poll/" + id;
    let urlAdmin = "http://localhost:8080/poll/" + id + "/results/";

    //send email
    returnQueries.getEmailFromPollId(id).then((email) => {
      sendEmail(email, urlShare, urlAdmin);
      res.json({url: urlAdmin})
    })
  }).catch(err => console.log(err))
});


app.listen(PORT, () => {
  console.log("Choosey Boy listening on port " + PORT);

});

//api that is used to send email to creator of poll
function sendEmail(to,pollLink,adminLink){

  sgMail.setApiKey('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');
  const msg = {
    to: to,
    from: to,
    subject: 'ChooseyBoy Poll links',
    text: 'Please find your poll share and Admin links below',
    html:"Link to the poll: " + pollLink + " <br>" + "Admin link : " + adminLink,
  };
  sgMail.send(msg);
}
