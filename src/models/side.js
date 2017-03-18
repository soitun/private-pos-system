
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sideSchema = new Schema({
  name: String,
  pearl: String,
  order: Schema.Types.ObjectId
});

var Side = mongoose.model('Side', sideSchema);

module.exports = Side;
