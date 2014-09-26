// set up ========================
var express  = require('express');
var path            = require('path');
var log             = require('./config/log')(module);
var app      = express(); // create our app w/ express
var port = process.env.PORT || 8080; 								
var mongoose = require('mongoose'); 		// mongoose for mongodb
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan'); 			// log requests to the console (express4)
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser'); 	// pull information from HTML POST (express4)
var session = require('express-session');
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

// load the conif =================
var database = require('./config/database');
mongoose.connect(database.url); 	// connect to mongoDB database on modulus.io

// require('./config/passport')(passport); // pass passport for configuration

// app.use(express.favicon()); // use standard favicon
app.use(morgan('dev'));  // log every request to the console
app.use(express.static(__dirname + '/views/public')); 				// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/')); 				// set the static files location /public/img will be /img for users
app.use(cookieParser());
app.use(bodyParser());

// Set the folder where the pages are kept
app.set('views', __dirname + '/views/private');
app.set('view engine', 'ejs');

app.use(session({ secret: 'ilovescotchscotchyscotchscotch'}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(bodyParser.urlencoded({'extended':'true'})); 			// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded());
app.use(bodyParser.json()); 									// parse application/json
// app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// app.use(function(req, res, next){
//     res.status(404);
//     log.debug('Not found URL: %s',req.url);
//     res.send({ error: 'Not found' });
//     return;
// });

// app.use(function(err, req, res, next){
//     res.status(err.status || 500);
//     log.error('Internal error(%d): %s',res.statusCode,err.message);
//     res.send({ error: err.message });
//     return;
// });


require('./config/auth');

require('./app/routes')(app, passport);

// listen (start app with node server.js) ======================================
app.listen(port);
console.log('App listening on port ' + port);