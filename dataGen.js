var log                 = require('./config/log')(module);
var mongoose            = require('mongoose');
var UserModel           = require('./app/models/user').UserModel;
var AccessTokenModel    = require('./app/models/user').AccessTokenModel;
var faker               = require('faker');
var crypto              = require('crypto');

AccessTokenModel.remove({}, function (err) {
    if (err) return log.error(err);
});

UserModel.remove({}, function(err) {
    var user = new UserModel({ username: "paulo", password: "123" });
    user.save(function(err, user) {
        if(err) return log.error(err);
        else log.info("New user - %s:%s",user.username,user.password);
    });

    var tokenValue = crypto.randomBytes(32).toString('base64');

    var token = new AccessTokenModel({ token: tokenValue, userId: user.userId });
    token.save(function(err, token) {
        if(err) return log.error(err);
        else log.info("New token - %s:%s",token.userId, token.token);
    });

    for(i=0; i<4; i++) {
        var user = new UserModel({ username: faker.random.first_name().toLowerCase(), password: faker.Lorem.words(1)[0] });
        user.save(function(err, user) {
            if(err) return log.error(err);
            else log.info("New user - %s:%s",user.username,user.password);
        });

        var tokenValue = crypto.randomBytes(32).toString('base64');

        var token = new AccessTokenModel({ token: tokenValue, userId: user.userId });
        token.save(function(err, token) {
            if(err) return log.error(err);
            else log.info("New token - %s:%s",token.userId, token.token);
        });
    }
});

var database = require('./config/database');
mongoose.connect(database.url);     // connect to mongoDB database on modulus.io

setTimeout(function() {
    mongoose.disconnect();
}, 3000);
