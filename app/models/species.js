var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SpeciesSchema = new Schema({
    name: {
        type: String,
        required: true        
    },
    source: {
        type: String,
        required:true
    }
});

module.exports = mongoose.model('Sort', SpeciesSchema);
