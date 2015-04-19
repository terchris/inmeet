var async = require('async'),
    _ = require('underscore');

var passport = require('passport'),
    passportAuth0Strategy = require('passport-auth0');

var keystone = require('keystone'),
    User = keystone.list('User');

var credentials = {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL
};

exports.authenticateUser = function(req, res, next)
{
    var self = this;

    var redirect = '/auth/confirm';
    if (req.cookies.target && req.cookies.target == 'app') redirect = '/auth/app';

    // Begin process
    console.log('============================================================');
    console.log('[services.auth0] - Triggered authentication process.!.');
    console.log('------------------------------------------------------------');

    // Initalise Auth0 credentials
    var auth0kStrategy = new passportAuth0Strategy(credentials, function(accessToken, refreshToken, profile, done) {
        done(null, {
            accessToken: accessToken,
            refreshToken: refreshToken,
            profile: profile
        });
    });

    // Pass through authentication to Auth0
    passport.use(auth0kStrategy);

    // Save user data once returning from auth0
    if (_.has(req.query, 'code')) {

        console.log('[services.auth0] - Callback workflow detected, attempting to process data...');
        console.log('------------------------------------------------------------');

        passport.authenticate('auth0', { session: false }, function(err, data, info) {

            if (err || !data) {
                console.log("[services.auth0] - Error retrieving auth0 account data - " + JSON.stringify(err));
                return res.redirect('/signin');
            }

            console.log('[services.auth0] - Successfully retrieved auth0 account data, processing...');
            console.log('------------------------------------------------------------');
            
            // Doc od Auth0 profile is here https://auth0.com/docs/user-profile
            // Doc of passport profile is here http://passportjs.org/guide/profile/
            

            var name = data.profile && data.profile.displayName ? data.profile.displayName.split(' ') : [];

            var auth = {
                type: 'auth0',

                name: {
                    first: name.length ? name[0] : '',
                    last: name.length > 1 ? name[1] : ''
                },

                email: data.profile.emails.length ? _.first(data.profile.emails).value : null,

                website: data.profile._json.blog,

                profileId: data.profile.id,

                username: data.profile.username,
                avatar: data.profile.picture,

                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
                

            }
            
            req.session.auth = auth;

            return res.redirect(redirect);

        })(req, res, next);

        // Perform inital authentication request to auth0
    } else {

        console.log('[services.auth0] - Authentication workflow detected, attempting to request access...');
        console.log('------------------------------------------------------------');

        passport.authenticate('auth0', { scope: ['email'] })(req, res, next);

    }

};
