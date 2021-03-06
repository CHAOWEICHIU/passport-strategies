
const LocalStrategy     = require('passport-local').Strategy
    , FacebookStrategy  = require('passport-facebook').Strategy
    , GoogleStrategy    = require('passport-google-oauth').OAuth2Strategy
    , configAuth        = require('./auth')
    , User              = require('../models/users.model');

// expose this function to our app using module.exports
module.exports = (passport)=>{
    
    passport.serializeUser((user, done)=>{
        console.log('serializeUser')
        done(null, user.id);
    })
    passport.deserializeUser((id, done)=>{
        console.log('deserializeUser')
        User.findById(id, (err, user)=>{
            done(err, user);
        })
    })

    // =========================================================================
    // Local  ==================================================================
    // =========================================================================


    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },(req, email, password, done)=>{
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function(){
        
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email },(err, user)=>{
            
            // if there are any errors, return the error
            if (err) return done(err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {
                console.log('1')
                // if there is no user with that email
                // create the user
                let newUser            = new User();

                // set the user's local credentials
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password);

                // save the user
                newUser.save((err)=>{
                    console.log('2')
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });    

        });

    }));


    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },(req, email, password, done)=> { // callback with email and password from our form

        User.findOne({ 'local.email' :  email }, (err, user) => {
            // if there are any errors, return the error before anything else
            if (err)return done(err);

            // if no user is found, return the message
            if (!user) return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password)) return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });

    }));


    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================


    passport.use(new FacebookStrategy({
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        profileFields   : configAuth.facebookAuth.scope,
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

    },

    // facebook will send back the token and profile
    function(req, token, refreshToken, profile, done) {
        if(!req.user){
            process.nextTick(function() {
                // find the user in the database based on their facebook id
                User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err) return done(err);

                    // if the user is found, then log them in
                    if (user) {
                        return done(null, user); // user found, return that user
                    } else {
                        
                        // if there is no user found with that facebook id, create them
                        var newUser            = new User();

                        // set all of the facebook information in our user model
                        newUser.facebook.id    = profile.id; // set the users facebook id                   
                        newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
                        newUser.facebook.name  = profile.displayName;
                        newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                        // save our user to the database
                        newUser.save(function(err) {
                            if (err) throw err;

                            // if successful, return the new user
                            return done(null, newUser);
                        });
                    }
                });
            });
        } else {
            var user            = req.user; // pull the user out of the session

            // update the current users facebook credentials
            user.facebook.id    = profile.id;
            user.facebook.token = token;
            user.facebook.name  = profile.displayName;
            user.facebook.email = profile.emails[0].value;

            // save the user
            user.save(function(err) {
                if (err) throw err;
                return done(null, user);
            });
        }

        
        // asynchronous
        

    }));


    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({

        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,
        scope           : configAuth.googleAuth.scope,
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

    },
    function(req, token, refreshToken, profile, done) {
        if(!req.user){
            process.nextTick(function() {
                // try to find the user based on their google id
                User.findOne({ 'google.id' : profile.id }, function(err, user) {
                    if (err) return done(err);

                    if (user) {

                        // if a user is found, log them in
                        return done(null, user);
                    } else {
                        // if the user isnt in our database, create a new user
                        var newUser          = new User();

                        // set all of the relevant information
                        newUser.google.id    = profile.id;
                        newUser.google.token = token;
                        newUser.google.name  = profile.displayName;
                        newUser.google.email = profile.emails[0].value; // pull the first email

                        // save the user
                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });
        } else {
            var newUser          = req.user

            // set all of the relevant information
            newUser.google.id    = profile.id;
            newUser.google.token = token;
            newUser.google.name  = profile.displayName;
            newUser.google.email = profile.emails[0].value; // pull the first email

            // save the user
            newUser.save(function(err) {
                if (err)
                    throw err;
                return done(null, newUser);
            });
        }
        

    }));








};