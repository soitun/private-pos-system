
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pizzaSchema = new Schema({
  name: String,
  size: String,
  exclude: String,
  extra: String,
  order: Schema.Types.ObjectId
});

var Pizza = mongoose.model('Pizza', pizzaSchema);

module.exports = Pizza;
