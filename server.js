const express 	= require('express')
	, app 		= express()
	, PORT		= process.env.PORT || 3000
	, bodyParser = require('body-parser')
	, cookieParser = require('cookie-parser')
	, mongoose	= require('mongoose')
	, flash 	= require('connect-flash')
	, session 	= require('express-session')
	, passport  = require('passport')
	, morgan 	= require('morgan')
	, configDB	= require('./config/database');

// configuration ===============================================================
mongoose.connect(configDB.url);

app.use(morgan('dev')) // log every request to console
app.use(bodyParser()) // get info from HTML form
app.use(cookieParser()) // read cookies (for auth)

app.set('view engine', 'ejs')

app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport


// launch ======================================================================
app.listen(PORT, ()=>{console.log('The magic happens on port ' + PORT)})


