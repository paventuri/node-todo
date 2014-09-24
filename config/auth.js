// config/passport.js
var security                = require('./security');
var passport                = require('passport');
var LocalStrategy           = require('passport-local').Strategy;
var BearerStrategy          = require('passport-http-bearer').Strategy;
var UserModel               = require('../app/models/user').UserModel;
var AccessTokenModel        = require('../app/models/user').AccessTokenModel;

passport.use(new LocalStrategy(
    function(username, password, done) {
        console.log('Local');
        console.log(username);
        console.log(password);
        console.log(done);
        UserModel.findOne({username: username}, function(err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false, { message: 'Invalid user' }); }
            if (!user.checkPassword(password)) { return done(null, false, { message: 'Invalid password' }); }
            

            AccessTokenModel.findOne({userId: user.userId}, function(err, token) {
                if (err) { return done(err); }
                if (!token) { return done(null, false, { message: 'No token found' }); }
                
                return done(null, {username: user.username, token: token.token});
            });
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.username);
});

passport.deserializeUser(function(id, done) {
    UserModel.findOne({username: id}, function (err, user) {
        AccessTokenModel.findOne({userId: user.userId}, function(err, token) {
            done(err, {username: user.username, token: token.token});
        });
    });
});

passport.use('token', new BearerStrategy(
    function(accessToken, done) {
        console.log('Bearer');
        console.log(accessToken);
        AccessTokenModel.findOne({ token: accessToken }, function(err, token) {
            if (err) { return done(err); }
            if (!token) { return done(null, false); }

            // if( Math.round((Date.now()-token.created)/1000) > security.tokenLife ) {
            //     AccessTokenModel.remove({ token: accessToken }, function (err) {
            //         if (err) return done(err);
            //     });
            //     return done(null, false, { message: 'Token expired' });
            // }

            UserModel.findById(token.userId, function(err, user) {
                if (err) { return done(err); }
                if (!user) { return done(null, false, { message: 'Unknown user' }); }

                var info = { scope: '*' }
                done(null, user, info);
            });
        });
    }
));

exports.isAuthenticated = passport.authenticate(['token'], { session : false });

