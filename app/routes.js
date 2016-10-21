// app/routes.js
module.exports = (app, passport)=>{

    app.get('/', (req, res)=>{
        console.log(req.session)
        res.render('index')
    })

    app.get('/login', (req, res)=>{
        res.render('login', { message: req.flash('loginMessage') })
    })

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    
    app.get('/signup', (req, res)=>{
        res.render('signup', { message: req.flash('signupMessage') })
    })

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));



    app.get('/auth/facebook', passport.authenticate('facebook'));
    
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));
    
    app.get('/profile', isLoggedIn, (req, res)=>{
        
        
        
        res.render('profile', {
            user : req.user // get the user out of session and pass to template
        });
    });

    
    app.get('/logout', (req, res)=>{
        req.logout();
        res.redirect('/');
    })
}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}