// server.js
// where your node app starts

// init project
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Show the homepage
// http://expressjs.com/en/starter/static-files.html
app.use(express.static('views'));

// Handle requests from IFTTT
app.post("/", function (request, response) {
  console.log("Request received from IFTTT");
  console.log("Data: " + JSON.stringify(request.body));
  
  if ("57XAuKVgPmtvXydR" === request.body.key) {
    console.log("Calling Habitica API...");
    addHabiticaToDo(request.body.user, request.body.token, request.body.title, request.body.notes);
    console.log("Done triggering.");
  }
  else {
    console.log("Bad key, exiting.");   
  }
  response.end();  
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});


function addHabiticaToDo(user, token, title, linktotask){
  // Make a request to Habitica using IFTTT
  request({
    headers: {
      'x-api-user': user,
      'x-api-key': token
    },
    uri: 'https://habitica.com/api/v3/tasks/user',
    body: { text: title, type: 'todo', notes: linktotask},
    json: true,
    method: 'POST'
  }, function (error, response, body) {
     if (!error && response.statusCode == 200) {
       console.log(body); // Show the response from Habitica
     }
    else {
      console.log(response.statusCode);
      console.log(body);
    }
  });
}

