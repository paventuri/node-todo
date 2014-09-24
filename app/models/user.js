var crypto = require('crypto');
var mongoose = require('mongoose');

// User
var User = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

User.methods.encryptPassword = function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
    //more secure – return crypto.pbkdf2Sync(password, this.salt, 10000, 512);
};

User.virtual('userId').get(function () {
    return this.id;
});

User.virtual('password').set(function(password) {
    this._plainPassword = password;
    this.salt = crypto.randomBytes(32).toString('base64');
    //more secure - this.salt = crypto.randomBytes(128).toString('base64');
    this.hashedPassword = this.encryptPassword(password);
}).get(function() { 
    return this._plainPassword; 
});


User.methods.checkPassword = function(password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

var UserModel = mongoose.model('User', User);

// AccessToken
var AccessToken = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    token: {
        type: String,
        unique: true,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

var AccessTokenModel = mongoose.model('AccessToken', AccessToken);


module.exports.UserModel = UserModel;
module.exports.AccessTokenModel = AccessTokenModel;
