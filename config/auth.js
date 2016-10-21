module.exports = {
    'facebookAuth' : {
        'clientID'      : '1305378059513311', // your App ID
        'clientSecret'  : '7a807d7d413287269677c8d933a76aa4', // your App Secret
        'callbackURL'   : 'http://localhost:3000/auth/facebook/callback',
        'scope'         : ['id', 'displayName', 'photos', 'email']
    },

    'twitterAuth' : {
        'consumerKey'       : 'your-consumer-key-here',
        'consumerSecret'    : 'your-client-secret-here',
        'callbackURL'       : 'http://localhost:3000/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : 'your-secret-clientID-here',
        'clientSecret'  : 'your-client-secret-here',
        'callbackURL'   : 'http://localhost:3000/auth/google/callback'
    }

};