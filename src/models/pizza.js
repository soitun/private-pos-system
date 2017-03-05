
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pizzaSchema = new Schema({
  name: { type: String, required: true },
  size: String,
  toppings: [String],
  exclude: [String],
  extra: [String]
});

var Pizza = mongoose.model('Pizza', pizzaSchema);

module.exports = Pizza;
