//model for users in db
var User = require('../models/user');

module.exports = function(router) {
    //User registration
    router.post('/users', function(req, res){
        var user = new User();
        user.username = req.body.username;
        user.password = req.body.password;
        user.email = req.body.email;
        if (req.body.username==null || req.body.username=="" || req.body.password==null || req.body.password=="" || req.body.email==null || req.body.email==""){
            res.json({success: false, message:'Provide username, email, and password!'});
        } else {
            user.save(function(err) {
                if (err){
                    res.json({success: false, message:'Username or Email already exists!'});
                } else{
                    res.json({success:true, message: 'User created!' });
                }      
            });
        }
    });

    //User login
    router.post('/authenticate', function(req,res){
       User.findOne({username: req.body.username}).select('email username password').exec(function(err, user){
           if (err){
               throw err;
           } else {
               if (!user){
                   res.json({success: false, message: 'No such user is found'});
               } else if (user){
                   if (req.body.password){
                    var validPassword = user.comparePassword(req.body.password);
                    } else {
                        res.json({success: false, message:'Please provide a password'});
                    };                   
                    if (!validPassword){
                        res.json({success:false, message: 'Incorrect password'});
                    } else {
                        res.json({success: true, mesage: 'Logged in'});
                    };
               };
           };
       });
    });

return router;
}