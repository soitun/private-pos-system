const express = require('express');
const router = express.Router();

var Customer = require('../../src/models/customer');
var Pizza = require('../../src/models/pizza');
var Side = require('../../src/models/side');
var Order = require('../../src/models/order');

// const newPizza = Pizza({
//   name: 'Peperoni',
//   toppings: ['Sauce', 'Cheese', 'Peperoni'],
//   exclude: ['Ground Beef'],
//   extra: ['Pineapple']
// });
//
// const newSide = Side({
//   name: 'Taro Milk Tea'
// });
//
// const newOrder = Order({
//   phone: '778-870-0046',
//   name: 'Lewis2',
//   address: 'Lonsdale',
//   isPickup: true,
//   price: 18.99,
//   finishTime: Date.now(),
//   addInfo: "Nothing Special",
//   pearl: 'Px2'
// });
//
// newPizza.save(function(err) {
//   if (err) throw err;
//
//   console.log('Pizza created!');
// });
// newSide.save(function(err) {
//   if (err) throw err;
//
//   console.log('Side created!');
// });
// // save the user
// newOrder.save(function(err) {
//   if (err) throw err;
//
//   console.log('Order created!');
// });

// const newCustomer = Customer({
//   name: 'Lewis',
//   phone: '778-870-0046',
//   address: '15th Street East',
//   orders: []
// });
//
// // save the user
// newCustomer.save(function(err) {
//   if (err) throw err;
//
//   console.log('Customer created!');
// });

// Customer.findOne({ name: 'Lewis' }, function (err, lewis) {
//   if (err) {
//
//   }
//   else {
//     lewis.orders.push(newOrder);
//     lewis.save( function (err, data) {
//       if (err) {
//
//       }
//       else {
//
//       }
//     })
//   }
// })

// var test;
// Customer.findOne({name: "Lewis"}, function (err, doc) {
//   this.test = doc;
//   console.log(this.test.orders);
// });


router.get('/', (req, res) => {

  Customer.find().exec(function(err, docs) {
      if (err) {
        return res.status(404).json({
          title: 'An error occurred',
          error: err
        });
      }
      res.status(200).json({
        message: 'Success',
        obj: docs
      });
  })
});

router.post('/new', function(req, res, next) {

  var newCustomer = Customer({
    name : req.body.name,
    phone: req.body.phone,
    address: req.body.address,
    description: req.body.description,
    orders: []
  });

  console.log(newCustomer);

  newCustomer.save(function(err, result) {
    if (err) {
      return res.status(404).json({
        title: 'An error occurred',
        error: err
      });
    }
    res.status(201).json({
      message: 'Customer Created!',
      obj: result
    });
  });
});

router.get('/:id', function(req, res, next) {
  Customer.findById(req.params.id, function(err, doc) {
    if (err) {
      return res.status(404).json({
        title: 'An error occurred',
        error: err
      });
    }
    if (!doc) {
      return res.status(404).json({
        title: 'No post found',
        error: {message: 'Post could not be found'}
      });
    }
    res.status(200).json({
      message: 'Success!',
      obj: doc
    });
  });
});

router.get('/:id/orders', (req, res) => {

  Order.find({ customder: req.params.id }).exec(function(err, docs) {
  if (err) {
    return res.status(404).json({
      title: 'An error occurred',
      error: err
    });
  }
  res.status(200).json({
    message: 'Success',
    obj: docs
  });
})
});

// router.post('/search', (req, res) => {
//
//   Customer.find({ $or : [{name: req.params.name}, {phone: req.params.name}, {address: req.params.name}, {date: req.params.date}] }).exec(function(err, docs) {
//   if (err) {
//     return res.status(404).json({
//       title: 'An error occurred',
//       error: err
//     });
//   }
//   res.status(200).json({
//     message: 'Success',
//     obj: docs
//   });
// })
// });

router.patch('/edit', function(req, res, next) {
  // console.log(req.body);
  Customer.findById(req.body._id, function(err, doc) {
    console.log("In request name: " + req.body.name);
    console.log("In request description: " + req.body.description);
    if (err) {
      return res.status(404).json({
        title: 'An error occurred',
        error: err
      });
    }
    if (!doc) {
      return res.status(404).json({
        title: 'No customer found',
        error: {message: 'Customer could not be found'}
      });
    }
    if (req.body.name) {
      doc.name = req.body.name;
      console.log("req name is " + req.body.name);
    }
    if (req.body.phone) {
      doc.phone = req.body.phone;
    }
    if (req.body.address) {
      doc.address = req.body.address;
    }
    if (req.body.description) {
      doc.description = req.body.description;
    }
    console.log("doc after change!" + doc);
    doc.save(function(err, result) {
      if (err) {
        return res.status(404).json({
          title: 'An error occurred',
          error: err
        });
      }
      res.status(200).json({
        message: 'Success',
        obj: result
      });
    });
  });
});

module.exports = router;
