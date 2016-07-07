
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , movie_recommender = require('./routes/movie_recommender')
  , top_25_movies = require('./routes/top_25_movies')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
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
app.put('/rateMovie', movie_recommender.rateMovie);
//app.get('/top_25_movies', top_25_movies.results);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
