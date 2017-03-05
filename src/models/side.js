
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sideSchema = new Schema({
  name: { type: String, required: true },
  pearl : String
});

var Side = mongoose.model('Side', sideSchema);

module.exports = Side;
