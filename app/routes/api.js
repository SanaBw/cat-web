//model for users in db
var User = require('../models/user');

//token
var jwt = require('jsonwebtoken');
var secret = 'gigi';

//sending mails with tokens
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');

//models for videos, audio and species in DB
var Video = require('../models/video');
var Song = require('../models/music');
var Sort = require('../models/species');

module.exports = function (router) {


    //--------------------------SENDGRID MAIL FOR ACTIVATION LINK--------------------------//

    //sendgrid auth
    var options = {
        auth: {
            api_key: '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'
        }
    }
    var client = nodemailer.createTransport(sgTransport(options));

    //path for activation
    router.put('/activate/:token', function (req, res) {
        User.findOne({ temptoken: req.params.token }, function (err, user) {
            if (err) throw err;
            var token = req.params.token;
            jwt.verify(token, secret, function (err, decoded) {
                if (err) {
                    res.json({ success: false, message: 'Activation link expired.' });
                } else if (!user) {
                    res.json({ success: false, message: 'Activation link expired.' });
                } else {
                    user.temptoken = false;
                    user.active = true;
                    user.save(function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.json({ success: true, message: 'Account activated.' });
                        }
                    });
                }
            });
        });
    });

    //check credentials before sending new activation token link
    router.post('/resend', function (req, res) {
        User.findOne({ username: req.body.username }).select('username password active').exec(function (err, user) {
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
                    } else if (user.active) {
                        res.json({ success: false, message: 'Account already activated.' });
                    } else {
                        res.json({ success: true, user: user });
                    };
                };
            };
        });
    });

    //resending new activation token
    router.put('/resend', function (req, res) {
        User.findOne({ username: req.body.username }).select('username name email temptoken').exec(function (err, user) {
            if (err)
                throw err;
            user.temptoken = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' });
            user.save(function (err) {
                if (err) {
                    console.log(err);
                } else {
                    var email = {
                        from: 'sanida.fatic@stu.ibu.edu.ba',
                        to: user.email,
                        subject: 'Activation Link Resent',
                        html: 'Hello <strong>' + user.username + '</strong><br> New activation link. Click here to activate your account:<br><br><a href="http://localhost:8000/activate/' + user.temptoken + '">Here</a>'
                    };
                    client.sendMail(email, function (err, info) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('Message sent: ' + info.response)
                        }
                        res.json({ success: true, message: 'Activation link has been resent to ' + user.email });
                    });
                }
            });
        })
    });


    //--------------------------POST AND GET FOR VIDEOS, MUSIC, AND SPECIES--------------------------//

    //post videos
    router.post('/vid', function (req, res, err) {
        var video = new Video();
        video.name = req.body.name;
        video.source = req.body.source;
        if (req.body.name == null || req.body.name == ''
            || req.body.source == null || req.body.source == '') {
            res.json({ success: false, message: 'Enter name and source' });
        } else {
            video.save(function (err) {
                if (err) {
                    res.json({ success: false, message: err.errors });
                } else {
                    res.json({ success: true, message: 'Video saved' });
                }
            });
        }
    });

    //get video sources
    router.get('/vid', function (req, res) {
        Video.find({}).exec(function (err, Video) {
            if (err) {
                res.json({ success: false, message: 'Cannot get videos' });
            } else {
                res.json({ success: true, message: Video });
            }
        });
    });

    //post audio
    router.post('/audio', function (req, res, err) {
        var song = new Song();
        song.name = req.body.name;
        song.source = req.body.source;
        if (req.body.name == null || req.body.name == ''
            || req.body.source == null || req.body.source == '') {
            res.json({ success: false, message: 'Enter name and source' });
        } else {
            song.save(function (err) {
                if (err) {
                    res.json({ success: false, message: err.errors });
                } else {
                    res.json({ success: true, message: 'Audio saved' });
                }
            });
        }
    });

    //get audio sources
    router.get('/audio', function (req, res) {
        Song.find({}).exec(function (err, Song) {
            if (err) {
                res.json({ success: false, message: 'Cannot get songs' });
            } else {
                res.json({ success: true, message: Song });
            }
        });
    });

    //post kind/species
    router.post('/spec', function (req, res, err) {
        var sort = new Sort();
        sort.name = req.body.name;
        sort.source = req.body.source;
        if (req.body.name == null || req.body.name == ''
            || req.body.source == null || req.body.source == '') {
            res.json({ success: false, message: 'Enter name and source' });
        } else {
            sort.save(function (err) {
                if (err) {
                    res.json({ success: false, message: err.errors });
                } else {
                    res.json({ success: true, message: 'Sort saved' });
                }
            });
        }
    });

    //get species source
    router.get('/spec', function (req, res) {
        Sort.find({}).exec(function (err, Sort) {
            if (err) {
                res.json({ success: false, message: 'Cannot get songs' });
            } else {
                res.json({ success: true, message: Sort });
            }
        });
    });


    //--------------------------USER REGISTRATION AND LOGIN--------------------------//

    //User registration
    router.post('/users', function (req, res) {
        var user = new User();
        user.username = req.body.username;
        user.password = req.body.password;
        user.email = req.body.email;
        user.name = req.body.name;
        user.temptoken = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' });

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
                            res.json({ success: false, message: err });
                        }
                    }
                } else {
                    var email = {
                        from: 'sanida.fatic@stu.ibu.edu.ba',
                        to: user.email,
                        subject: 'Activation Link',
                        html: 'Hello <strong>' + user.username + '</strong><br> Thank you for registering. Click here to activate your account:<br><br><a href="http://localhost:8000/activate/' + user.temptoken + '">Here</a>'
                    };

                    client.sendMail(email, function (err, info) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('Message sent: ' + info.response)
                        }
                    });
                    res.json({ success: true, message: 'Account registered! Please check your email' });
                }
            });
        }
    });


    //User login
    router.post('/authenticate', function (req, res) {
        User.findOne({ username: req.body.username }).select('email username password active').exec(function (err, user) {
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
                    } else if (!user.active) {
                        res.json({ success: false, message: 'Account not activated. Check your email.', expired: true });
                    } else {
                        var token = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' });
                        res.json({ success: true, mesage: 'Logged in', 'token': token });
                    };
                };
            };
        });
    });

    //check session token
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

    //current user token
    router.post('/me', function (req, res) {
        res.send(req.decoded);
    });

    return router;
}