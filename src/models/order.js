
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
  name: String,
  phone: String,
  address: String,
  isPickup: Boolean,
  finishTime: Date,
  isFinished: { type: Boolean, default: false, required: true },
  addInfo: String,
  pizzas: [Schema.Types.ObjectId],
  sides: [Schema.Types.ObjectId],
  customer: Schema.Types.ObjectId
});

var Order = mongoose.model('Order', orderSchema);

module.exports = Order;
