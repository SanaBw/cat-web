//model for users in db
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var secret = 'gigi';

module.exports = function (router) {
    //User registration
    router.post('/users', function (req, res) {
        var user = new User();
        user.username = req.body.username;
        user.password = req.body.password;
        user.email = req.body.email;
        user.name = req.body.name;

        if (req.body.username == null || req.body.username == '' 
        || req.body.password == null || req.body.password == '' 
        || req.body.email == null || req.body.email == '' 
        || req.body.name == null || req.body.name == '') {           
            res.json({ success: false, message: 'Ensure username, email, and password were provided' });
        } else {            
            user.save(function (err) {
                if (err) {
                    if (err.errors != null) {
                        if (err.errors.name) {
                            res.json({ success: false, message: err.errors.name.message });
                        } else if (err.errors.email) {
                            res.json({ success: false, message: err.errors.email.message });
                        } else if (err.errors.username) {
                            res.json({ success: false, message: err.errors.username.message });
                        } else if (err.errors.password) {
                            res.json({ success: false, message: err.errors.password.message });
                        } else {
                            res.json({ success: false, message: err });
                        }
                    } else if (err) {
                        // Check if duplication error exists
                        if (err.code == 11000) {
                            res.json({ success: false, message: 'Username or e-mail is already taken' });
                        } else {
                            res.json({ success: false, message: err});
                        }
                    }
                } else {
                    res.json({ success: true, message: 'Account registered!' });
                }
            });
        }
    });


    //User login
    router.post('/authenticate', function (req, res) {
        User.findOne({ username: req.body.username }).select('email username password').exec(function (err, user) {
            if (err) {
                throw err;
            } else {
                if (!user) {
                    res.json({ success: false, message: 'No such user is found' });
                } else if (user) {
                    if (req.body.password) {
                        var validPassword = user.comparePassword(req.body.password);
                    } else {
                        res.json({ success: false, message: 'Please provide a password' });
                    };
                    if (!validPassword) {
                        res.json({ success: false, message: 'Incorrect password' });
                    } else {
                        var token = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' });
                        res.json({ success: true, mesage: 'Logged in', 'token': token });
                    };
                };
            };
        });
    });

    router.use(function (req, res, next) {
        var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];

        if (token) {
            jwt.verify(token, secret, function (err, decoded) {
                if (err) {
                    res.json({ success: false, message: 'Token invalid' });

                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.json({ success: false, message: 'No token' });
        }
    });

    router.post('/me', function (req, res) {
        res.send(req.decoded);
    });

    return router;
}