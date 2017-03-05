
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
  phone: { type: String, required: true },
  name: String,
  address: String,
  isPickup: Boolean,
  price: Number,
  finishTime: Date,
  isFinished: { type: Boolean, default: false, required: true },
  addInfo: String,
  pizzas: [Schema.Types.ObjectId],
  sides: [Schema.Types.ObjectId],
  pearl: String,
  customer: Schema.Types.ObjectId
});

var Order = mongoose.model('Order', orderSchema);

module.exports = Order;
