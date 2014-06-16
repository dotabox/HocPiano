
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'www')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// app.all('/manifest.webapp', function(req, res){
// 	res.setHeader("Content-Type", "application/x-web-app-manifest+json");
// 	var obj = {
// 		  "name": "DOTA vs LOL",
// 		  "description": "What is the BEST",
// 		  "launch_path": "/index.html",
// 		  "developer": {
// 		    "name": "BKGM",
// 		    "url": "https://slaprat.herokuapp.com/"
// 		  },
// 		  "icons": {
// 		    "60": "/img/icons/60.png",
// 		    "128": "/img/icons/128.png",
// 		    "48": "/img/icons/48.png",
// 		  },  
// 		};
// 	res.json(obj);
// });

app.post('/*',function(req, res){
	res.redirect('/');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
