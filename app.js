
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , movie_recommender = require('./routes/movie_recommender')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port',  process.env.VCAP_APP_PORT || 3000);
app.set('host',  process.env.VCAP_APP_HOST || 'localhost');
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.users);
app.get('/word_count', user.word_count);
app.get('/top25', movie_recommender.top25);
app.get('/predictedRatingForMovie', movie_recommender.predictedRatingForMovie);
app.get('/movieID', movie_recommender.movieID);
app.get('/movieTitle', movie_recommender.movieTitle);
app.post('/rateMovie', movie_recommender.rateMovie);

http.createServer(app).listen(
  app.get('port'), 
  app.get('host'), 
  function(){
    console.log('Express server listening on port ' + app.get('port'));
  }
);
