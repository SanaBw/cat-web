//model for users in db
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var secret = 'gigi';
//model for videos in db
var Video = require('../models/video');
//model for audio in db
var Song = require('../models/music');
//model for audio in db
var Sort = require('../models/species');

module.exports = function (router) {

    //post videos
    router.post('/vid', function(req,res,err){
        var video = new Video();
        video.name = req.body.name;
        video.source = req.body.source;   
        if (req.body.name == null || req.body.name =='' 
            || req.body.source == null || req.body.source=='') {
                res.json({success:false, message: 'Enter name and source'});
            } else {
                video.save(function(err){
                    if (err){
                        res.json({success:false, message:err.errors});
                    } else {
                        res.json({success:true, message:'Video saved'});
                    }
                });
            }   
    });

    //get video sources
    router.get('/vid', function(req, res){
        Video.find({}).exec(function(err, Video){
            if (err){
                res.json({success:false, message:'Cannot get videos'});
            } else {
                res.json({success:true, message: Video});
                
            }
        });
        
    });

    //post audio
    router.post('/audio', function(req,res,err){
        var song = new Song();
        song.name = req.body.name;
        song.source = req.body.source;   
        if (req.body.name == null || req.body.name =='' 
            || req.body.source == null || req.body.source=='') {
                res.json({success:false, message: 'Enter name and source'});
            } else {
                song.save(function(err){
                    if (err){
                        res.json({success:false, message:err.errors});
                    } else {
                        res.json({success:true, message:'Audio saved'});
                    }
                });
            }   
    });

    //get audio sources
    router.get('/audio', function(req, res){
        Song.find({}).exec(function(err, Song){
            if (err){
                res.json({success:false, message:'Cannot get songs'});
            } else {
                res.json({success:true, message: Song});
                
            }
        });
        
    });

    //post kind
    router.post('/spec', function(req,res,err){
        var sort = new Sort();
        sort.name = req.body.name;
        sort.source = req.body.source;   
        if (req.body.name == null || req.body.name =='' 
            || req.body.source == null || req.body.source=='') {
                res.json({success:false, message: 'Enter name and source'});
            } else {
                sort.save(function(err){
                    if (err){
                        res.json({success:false, message:err.errors});
                    } else {
                        res.json({success:true, message:'Sort saved'});
                    }
                });
            }   
    });

    //get species src
    router.get('/spec', function(req, res){
        Sort.find({}).exec(function(err, Sort){
            if (err){
                res.json({success:false, message:'Cannot get songs'});
            } else {
                res.json({success:true, message: Sort});
                
            }
        });
        
    });

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