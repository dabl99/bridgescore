var express = require('express');
var assert = require('assert');
var app = express();
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var json2csv = require('json2csv');

var mongodb = require("mongodb");

// Use the URI set by heroku or if not try to see if there
// is a local mongodb server running 
var dburl = process.env.MONGODB_URI ? process.env.MONGODB_URI : "mongodb://127.0.0.1";

// Connect to the mongodb database
mongodb.MongoClient.connect(dburl, function (err, database) {

  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

});
  

// Start the server on the specified port
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));


// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');



// Get all the scores from MONGODB
// See http://mongodb.github.io/node-mongodb-native/2.1/tutorials/crud/
function getScores(callback){
  db.collection('scores').find().toArray(function(err, scores){
    console.log(scores);
    callback(err, scores);
  });
}

// Add a new score to MONGODB
// See http://mongodb.github.io/node-mongodb-native/2.1/tutorials/crud/
function addScore(data, callback){
  db.collection('scores').insertOne(data, callback); 
}

app.get('/', function(request, response) {
  response.redirect('/scores');
});

app.get('/scores', function(request, response) {

  getScores(function(err, scores){
    response.render('pages/scores', { scores: scores });
  });

});


app.get('/scores.csv', function(request, response) {
  var json2csv = require('json2csv');
  
  getScores(function(err, scores){
    assert.equal(null, err);
    json2csv({data:scores},function(err,csv){
      assert.equal(null, err);
      response.header("Content-Type", "text/csv");
      response.send(csv)
    });

  });
});

app.get('/scores/add', function(request, response) {
  var contracts = 
    "1C 1D 1H 1S 1NT 2C 2D 2H 2S 2NT 3C 3D 3H 3S 3NT 4C 4D 4H 4S 4NT 5C 5D 5H 5S 5NT 6C 6D 6H 6S 6NT 7C 7D 7H 7S 7NT".split(" ");
  response.render('pages/scores_add', 
    { contracts: contracts });
});


app.post('/scores/add', urlencodedParser, function(req, res) {

  var b = req.body;

  console.log();
  console.log(b.tableNumber);
  console.log(b.boardNumer);
  console.log(b.doubled);
  console.log(b.declarer);
  console.log(b.declarerTricks);
  console.log(b.nsPair);
  console.log(b.ewPair);

  var data = {
    tableNumber:parseInt(b.tableNumber),
    boardNumber:parseInt(b.boardNumber),
    doubled:b.doubled,
    declarer:b.declarer,
    declarerTricks:parseInt(b.declarerTricks),
    nsPair:parseInt(b.nsPair),
    ewPair:parseInt(b.ewPair),
  }

  addScore(data, function(err, r){
    assert.equal(null,err);
  });

  res.redirect('/scores');
});



app.get('/help', function(request, response) {
  response.render('pages/help');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


