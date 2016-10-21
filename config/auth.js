module.exports = {
    'facebookAuth' : {
        'clientID'      : '1305378059513311', // your App ID
        'clientSecret'  : '7a807d7d413287269677c8d933a76aa4', // your App Secret
        'callbackURL'   : 'http://localhost:3000/auth/facebook/callback',
        'scope'         : ['id', 'displayName', 'photos', 'email']
    },

    'googleAuth' : {
        'clientID'      : '672850834509-u9cg82fucbd1ifbiubifsga94us87iv4.apps.googleusercontent.com',
        'clientSecret'  : '-Pv3HRFMIbbnSWIwurO1CLuC',
        'callbackURL'   : 'http://localhost:3000/auth/google/callback',
        'scope'         : ['profile', 'email']
    }

};