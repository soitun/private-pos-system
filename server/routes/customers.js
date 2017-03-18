const express = require('express');
const router = express.Router();

var Customer = require('../../src/models/customer');
var Pizza = require('../../src/models/pizza');
var Side = require('../../src/models/side');
var Order = require('../../src/models/order');
var async = require('async');

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

  newCustomer.save(function(err, result) {
    if (err) {
      return res.status(404).json({
        title: 'An error occurred',
        error: err
      });
    }
    Order.find({ phone: result.phone }).exec(function(err, docs) {
      if (err)
        console.log(err);
      async.each(docs, function(order, callback) {
        result.orders.push(order);
        order.customer = result;
        order.name = result.name;
        order.address = result.address;
        order.save(function(err) {
          if (err)
            console.log(err);
          callback();
        })
      }, function(err) {
        if (err)
          console.log(err);
        result.save(function(err) {
          res.status(201).json({
            message: 'Customer Created!',
            obj: result
          });
        })
      })
    })
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
  Order.find({ customer: req.params.id }).exec(function(err, docs) {
    if (err) {
      return res.status(404).json({
        title: 'An error occurred',
        error: err
      });
    }
  // Initialize JSON Object to be returned.
  jsonObj = {};
  for (var i=0; i<docs.length; i++) {
    jsonObj[i] = {},
      jsonObj[i]['pizzaObjs'] = [],
      jsonObj[i]['sideObjs'] = []
  }

  var jsonObj2 = JSON.parse(JSON.stringify(jsonObj));

  async.waterfall([
    function(callback) {
      for (var i=0; i<docs.length; i++) {
        jsonObj2[i].pizzaObjs = docs[i].pizzas;
        jsonObj2[i].sideObjs = docs[i].sides;
      }
      callback();
    },
    function(callback) {
      async.forEachOfSeries(docs, function(doc, key, callback2) {
        async.forEachOfSeries(jsonObj2[key].pizzaObjs, function(pizza, index, callback3) {
          Pizza.findById(pizza, function(err, result) {
            if (err)
              console.log(err);
            if (result) {
              jsonObj[key].pizzaObjs.push(result);
            }
            callback3();
          })
        }, function(err) {
          console.log(err);
          async.forEachOfSeries(jsonObj2[key].sideObjs, function(side, index, callback4) {
            Side.findById(side, function(err, result2) {
              if (err)
                console.log(err);
              if (result2) {
                jsonObj[key].sideObjs.push(result2);
              }
              callback4();
            })
          }, function(err) {
            callback2();
          })
        })
      }, function(err) {
        callback();
      })
    }
  ], function(err) {
    res.status(200).json({
      message: 'Success',
      obj: [docs, jsonObj]
    });
  })
  })
});

router.patch('/edit', function(req, res, next) {
  Customer.findById(req.body._id, function(err, doc) {
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
    }
    if (req.body.address) {
      doc.address = req.body.address;
    }
    if (req.body.description) {
      doc.description = req.body.description;
    }
    if (req.body.phone) {
      Order.find({ phone: doc.phone }).exec(function(err, oldOrders) {
        if (err)
          console.log(err);
        async.each(oldOrders, function(oldOrder, callback) {
          oldOrder.customer = undefined;
          oldOrder.save(function(err) {
            if (err)
              console.log(err);
            callback();
          })
        }, function(err) {
          if (err)
            console.log(err);
          doc.phone = req.body.phone;
          doc.orders = [];
          Order.find({ phone: req.body.phone }).exec(function(err, orders) {
            if (err)
              console.log(err);
            async.each(orders, function(order, callback2) {
              doc.orders.push(order);
              order.customer = doc;
              order.name = doc.name;
              order.address = doc.address;
              order.save(function(err) {
                if (err)
                  console.log(err);
                callback2();
              })
            }, function(err) {
              if (err)
                console.log(err);
              doc.save(function(err) {
                res.status(201).json({
                  message: 'Customer Created!',
                  obj: doc
                });
              })
            })
          })
        })
      })
    } else {
      doc.save(function(err) {
        if (err)
          console.log(err);
        res.status(201).json({
          message: 'Customer Created!',
          obj: doc
        });
      })
    }
  });
});

module.exports = router;
