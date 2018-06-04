var express = require ('express');
var app = express();
//track the changes
var morgan = require('morgan');
var mongoose = require('mongoose');
//middleware for parsing data into json
var bodyParser = require('body-parser');
var router = express.Router();
var appRoutes = require('./app/routes/api')(router);
var path = require ('path');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));
app.use('/api', appRoutes);


mongoose.connect('mongodb://sanida:sanida1@ds147180.mlab.com:47180/entertaincatdb', function(err){
    if (err){
        console.log("Not connected to the database." + err)
    } else {
        console.log("Connected on the database.");
    }
});

app.get('*', function(req, res){
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

app.listen(process.env.PORT || 8080, function(){
    console.log("Running the server..");
});
