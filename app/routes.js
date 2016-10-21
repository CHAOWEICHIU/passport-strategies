// app/routes.js
module.exports = (app, passport)=>{

    app.get('/', (req, res)=>{
        console.log(req.user)
        res.render('index')
    })

    app.get('/profile', isLoggedIn, (req, res)=>{
        console.log(req.session)
        res.render('profile', {
            user : req.user // get the user out of session and pass to template
        })
    })

    app.get('/logout', (req, res)=>{
        req.logout();
        res.redirect('/');
    })

    // =============================================================================
    // AUTHENTICATE (FIRST LOGIN) ==================================================
    // =============================================================================

        // Local -------------------------------------------------------------------

            // Login ===============================================================
            app.get('/login', (req, res)=>{
                res.render('login', { message: req.flash('loginMessage') })
            })

            app.post('/login', passport.authenticate('local-login', {
                successRedirect : '/profile', // redirect to the secure profile section
                failureRedirect : '/login', // redirect back to the signup page if there is an error
                failureFlash : true // allow flash messages
            }));

            // Signup ==============================================================
            app.get('/signup', (req, res)=>{
                res.render('signup', { message: req.flash('signupMessage') })
            })

            app.post('/signup', passport.authenticate('local-signup', {
                successRedirect : '/profile', // redirect to the secure profile section
                failureRedirect : '/signup', // redirect back to the signup page if there is an error
                failureFlash : true // allow flash messages
            }));

        // Google -------------------------------------------------------------------
            // send to google to do the authentication
            app.get('/auth/google', passport.authenticate('google'));

            // the callback after google has authenticated the user
            app.get('/auth/google/callback',
                    passport.authenticate('google', {
                            successRedirect : '/profile',
                            failureRedirect : '/'
                    }));
        // Facebook // ---------------------------------------------------------------
            // send to facebook to do the authentication
            app.get('/auth/facebook', passport.authenticate('facebook'));

            // handle the callback after facebook has authenticated the user
            app.get('/auth/facebook/callback',
                    passport.authenticate('facebook', {
                        successRedirect : '/profile',
                        failureRedirect : '/'
                    }));
    

    // =============================================================================
    // AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
    // =============================================================================

    
        // locally --------------------------------
            app.get('/connect/local', function(req, res) {
                res.render('connect-local.ejs', { message: req.flash('loginMessage') });
            });
            app.post('/connect/local', passport.authenticate('local-signup', {
                successRedirect : '/profile', // redirect to the secure profile section
                failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
                failureFlash : true // allow flash messages
            }));

        // facebook -------------------------------

            // send to facebook to do the authentication
            app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

            // handle the callback after facebook has authorized the user
            app.get('/connect/facebook/callback',
                passport.authorize('facebook', {
                    successRedirect : '/profile',
                    failureRedirect : '/'
                }));


        // google ---------------------------------

            // send to google to do the authentication
            app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

            // the callback after google has authorized the user
            app.get('/connect/google/callback',
                passport.authorize('google', {
                    successRedirect : '/profile',
                    failureRedirect : '/'
                }));

    // =============================================================================
    // UNLINK ACCOUNTS =============================================================
    // =============================================================================
    // used to unlink accounts. for social accounts, just remove the token
    // for local account, remove email and password
    // user account will stay active in case they want to reconnect in the future

        // local -----------------------------------
        app.get('/unlink/local', function(req, res) {
            var user            = req.user;
            user.local.email    = undefined;
            user.local.password = undefined;
            user.save(function(err) {
                res.redirect('/profile');
            });
        });

        // facebook -------------------------------
        app.get('/unlink/facebook', function(req, res) {
            var user            = req.user;
            user.facebook.token = undefined;
            user.save(function(err) {
                res.redirect('/profile');
            });
        });    

        // google ---------------------------------
        app.get('/unlink/google', function(req, res) {
            var user          = req.user;
            user.google.token = undefined;
            user.save(function(err) {
               res.redirect('/profile');
            });
        });
        


    
    
}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}