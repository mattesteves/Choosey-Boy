# Choosey Boy

##About
Choosey boy allowed users to submit polls with up to 10 options (each of which can have an optional description). The poll-creator is given links to send to people, and view the results of their polls.

Users can then vote on their preferences by clicking up and down arrows, and are redirected to a results page which dynamically displays a pie chart with their results courtesy of charts.js

## Getting Started
* Clone the github repo into a new directory
* From the new directory in your terminal, run npm -i
* From the new directory in your terminal terminal, run npm start 
* Visit localhost/8080 to start choosing!

## Dependencies

- Node 5.10.x or above
- NPM 3.8.x or above
- Knex
- Express
- EJS
- Body-parser
- Bootstrap
- Sass
- @sendgrid/mail
- cookie-session
- Jquery
- Postgres

## Set up .env
- Rename .env.example file to .env

## Setting up SendGrid 
- Create an SendGrid account and get API key at http://sendgrid.com/pricing.html

-Type following command into terminal
  ```
  echo "SENDGRID_API_KEY='YOUR_API_KEY'" >> .env
  
  ```

## Screenshots

[Asking the important questions](https://imgur.com/lLgUVOa)
[Voting](https://imgur.com/mUMuGrm)
[The truth revealed](https://imgur.com/Jr6ZtfZ)
