
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , config = require('./config/app-config.json')
  , argv = require('optimist').argv;

/**
 *  Initialize Express.
 */
var app = express();

/**
 *  Configure Express.
 */
app.configure(function(){
  app.set('port', argv.port || config.httpPort);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', { pretty: true});
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

/**
 *  Define our application's HTTP routes.
 */
 var DeploymentNotesController = require('./controllers/deployment-notes-controller')(app);
 

/**
 *  Start the web server.
 */
http.createServer(app).listen(app.get('port'), function(){
  console.log("Deployment Services listening on port " + app.get('port'));
});
