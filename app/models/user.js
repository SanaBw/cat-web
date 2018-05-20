var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var titlize = require('mongoose-title-case');
var validate = require('mongoose-validator');

var nameValidator = [
    validate({
        validator: 'matches',
        arguments: /^(([a-zA-Z\-]{3,15})+[ ]+([a-zA-Z\-]{3,15})+)+$/,
        message: 'Name is not in the correct format'
    })
];

var emailValidator = [
    validate({
        validator: 'isEmail',
        message: 'Email not valid'
    })
];

var usernamenameValidator = [
    validate({
        validator: 'isLength',
        arguments: [3, 15],
        message: 'Username should be between 3 and 15 characters'
    }),
    validate({
        validator: 'isAlphanumeric',
        message: 'Username can contain letters and numbers'
    })
];

var passwordValidator = [
    validate({
        validator: 'matches',
        arguments: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
        message: 'Password has to contain minimum eight characters, at least one letter, and one number!'
    })
];


var UserSchema = new Schema({
    name: {
        type: String,
        validate: nameValidator,
        required: true        
    },
    username: {
        type: String,
        validate: usernamenameValidator,
        required: true,
        unique: true
    },
    password: {
        type: String,
        validate: passwordValidator,
        required: true
            },
    email: {
        type: String,
        validate: emailValidator,
        required: true,
        lowercase: true,
        unique: true        
    }
});

UserSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, null, null, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
    });
});

//consistent name Title Case
UserSchema.plugin(titlize, {
    paths: ['name']
});

UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);