var express      = require('express');
var app     	 = express();
var port    	 = process.env.PORT || 3000;
var mongoose 	 = require('mongoose');
var passport 	 = require('passport');
var flash    	 = require('connect-flash');
var morgan       = require('morgan');
console.log(morgan())
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var configDB 	 = require('./config/database.js');
const handlebars = require('express3-handlebars').create({defaultLayout:'main',helpers: {
	section: function(name, options){if(!this._sections)this._sections = {};
	this._sections[name] = options.fn(this);return null;}}});
mongoose.connect(configDB.url);
require('./config/passport')(passport);
app.use(morgan('dev')); 
app.use(cookieParser()); 
app.use(bodyParser()); 
app.engine('handlebars',handlebars.engine);
app.set('view engine', 'handlebars');
app.use(session({ secret: 'probleprobleproble' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); 
app.use(express.static(__dirname + '/public'));
require('./app/routes.js')(app, passport);
app.listen(port);console.log('The magic happens on port ' + port);
app.use(function(req,res,next){res.status(404);res.render('404');});
app.use(function(err,req,res,next){console.error(err.stack);res.status(500);res.render('500');});




