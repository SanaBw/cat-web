var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FavoritesSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    source: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Fav', FavoritesSchema);