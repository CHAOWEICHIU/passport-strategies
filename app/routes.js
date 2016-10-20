// app/routes.js
module.exports = (app, passport)=>{

    app.get('/', (req, res)=>{
        res.render('index')
    })

    app.get('/login', (req, res)=>{
        res.render('login', { message: req.flash('loginMessage') })
    })

    // process the login form
    // app.post('/login', do all our passport stuff here);

    
    app.get('/signup', (req, res)=>{
        res.render('signup', { message: req.flash('signupMessage') })
    })

    // process the signup form
    // app.post('/signup', do all our passport stuff here);

    
    
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