var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

var scoresNS = 0;
var scoresEW = 0;

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/scores', function(request, response) {
  response.render('pages/scores', { scoresNS: scoresNS, scoresEW: scoresEW  });
});

app.get('/scores/add', function(request, response) {
  response.render('pages/scores_add');
});


app.post('/scores/add', urlencodedParser, function(req, res) {
  var scoreNS = req.body.scoreNS;
  var scoreEW = req.body.scoreEW;
  var name = req.body.name;
  var table = req.body.tableNumber;

  console.log(name);
  console.log(name);
  console.log(scoreNS);
  console.log(scoreEW);
  console.log(table);

  scoresNS += parseInt(scoreNS);
  scoresEW += parseInt(scoreEW);

  res.redirect('/scores');
});



app.get('/help', function(request, response) {
  response.render('pages/help');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


