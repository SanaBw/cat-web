var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MusicSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    source: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Song', MusicSchema);
