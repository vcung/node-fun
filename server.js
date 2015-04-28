// Express initialization
var koa = require('koa');
var logger = require('koa-logger');
var route = require('koa-route');
var serve = require('koa-static');
var cors = require('koa-cors');
var app = koa();

app.use(serve(__dirname + '/frogger'));
app.use(cors({origin: true}));
app.use(route.get('/highscores', highscoresPage));
app.use(route.get('/highscores/:game_title', getHighScore));
app.use(route.post('/submitscore', addHighScore));

// middleware
app.use(logger());

// Mongo initialization, setting up a connection to a MongoDB on Heroku
var mongoUri = 'mongodb://<dbuser>:<dbpassword>@<port>.mongolab.com:<port>/<appname>';
var mongo = require('mongodb');
var db;
//mongo.MongoClient.connect(mongoUri, function (error, databaseConnection) {
//  db = databaseConnection;
//  if (!db) {
//    console.log(error);
//    db = error;
//  }

//});

function *highscoresPage() {
  this.body = "Send a GET request to /highscore/<game name> for the top 10 high scores of that game"+
              "Send a POST request to /submitscore in the format of {game_title: <string>, name: <string>, score: <int>} to record a highscore to the database";
}

//GET API
//get top 10 scores associated with give game title
function *getHighScore(game_title) {
  //wait for response from db
  this.body = yield findScores(game_title);
}

//return a callback function with results from db query
//returns a JSON string if db query is successful, an error code otherwise
function findScores(title) {
  return function(callback) { 
    mongo.MongoClient.connect(mongoUri, function (error, db) {
      
      var scores = db.collection('scores');
      if (error) {
        //cannot connect to db
        callback(null, error);
      }
      scores.find({'game_title': title}).limit(10).sort({score: -1}).toArray(function (er, results) {
        if (er) {
          //error with collection
	      callback(null, er);
        } else {
          var json = JSON.stringify(results);
          if (json != '[]') {
            callback(null, json);
          } else {
            //connected to db but no results matching query found
            callback(null, '{[]}');
          }
        }
      });
    });
  };
}

//POST API
//takes in a game_title, name, and score and adds them to the database
//fields cannot be null
function *addHighScore() {
  var date = new Date();
  var req = this.request.body;

  //make sure no null fields
  if ((req.game_title === 'null') || (req.name === 'null') || (req.score === 'null')) {
    this.body = 404;
  } else {    
    //wait for completion of adding score to db
    this.body = yield postScore(encodeURI(req.game_title), encodeURI(req.name), parseInt(req.score));
  }
}

//returns a callback function of user score submission if successfully added to db
function postScore(title, username, score) {
  return function(callback) {
   mongo.MongoClient.connect(mongoUri, function (error, db) {
      var scores = db.collection('scores');
      var date = new Date();
      scores.insert({'game_title': title, 'name': username, 'score': score, created_at: date}, function(er, submission) {
        if (er) {
          callback(null, er);
        } else {
          callback(null, submission);
        }  
      });
    });
  };
}

app.on('error', function(err){
  log.error('server error', err);
});

// Oh joy! http://stackoverflow.com/questions/15693192/heroku-node-js-error-web-process-failed-to-bind-to-port-within-60-seconds-of
app.listen(process.env.PORT || 3000);

