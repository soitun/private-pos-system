
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var customerSchema = new Schema({
  name: {type: String, required: true},
  phone: {type: String, required: true},
  address: String,
  description: String,
  orders: [Schema.Types.ObjectId]
});

var Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
