
const express = require('express');
const router = express.Router();

var Order = require('../../src/models/order');
var Customer = require('../../src/models/customer');
var Pizza = require('../../src/models/pizza');
var Side = require('../../src/models/side');
var async = require('async');
var moment = require('moment');


router.get('/orders', (req, res) => {
  Order.find().sort({finishTime: -1}).exec(function(err, docs) {
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
    ], function (err) {
      if (err)
        console.log(err);
      res.status(200).json({
        message: 'Success',
        obj: [docs, jsonObj]
      });
    })
  })
});

router.get('/current', (req, res) => {
  Order.find({ isFinished: false }).sort({finishTime: 1}).exec(function(err, docs) {
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
  ], function (err) {
    if (err)
      console.log(err);
    res.status(200).json({
      message: 'Success',
      obj: [docs, jsonObj]
    });
  })
  })
});

router.patch('/current/:id', function(req, res, next) {
  Order.findById(req.params.id, function(err, doc) {
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
    doc.isFinished = true;
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

router.get('/orders/:id', function(req, res, next) {
  Order.findById(req.params.id, function(err, doc) {
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
    // Initialize JSON Object to be returned.
    jsonObj = {'pizzaObjs' : [], 'sideObjs' : []};

    async.each(doc.pizzas, function(pizza, callback1) {
      Pizza.findById(pizza, function(err, foundPizza) {
        if (err)
          console.log(err);
        jsonObj.pizzaObjs.push(foundPizza);
        callback1();
      })
    }, function(err) {
      if (err)
        console.log(err);
      async.each(doc.sides, function(side, callback2) {
        Side.findById(side, function(err, foundSide) {
          if (err)
            console.log(err);
          jsonObj.sideObjs.push(foundSide);
          callback2();
        })
      }, function(err) {
        if (err)
          console.log(err);
        res.status(200).json({
          message: 'Success!',
          obj: [doc, jsonObj]
        });
      })
    })
  });
});

router.post('/orders/new', function(req, res, next) {
  var isPickup = (req.body.isPickup == "P") ? true : false;
  var finishTime = new Date();
  if (req.body.timeLeft)
    finishTime = new Date(finishTime.getTime() + req.body.timeLeft*60000);
  var pizzas = [];
  var sides = [];
  var customer = "";
  var order = "";

  // Try to find customer using the phone number in req.
  // If found, assign the order to the found customer.
  Customer.findOne({phone: req.body.phone}, function(err, doc) {
    customer = (!doc) ? "" : doc;

    // Create a new order and save.
    var newOrder = Order({
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
      isPickup: isPickup,
      finishTime: finishTime,
      isFinished: false,
      addInfo: req.body.description,
      pizzas: [],
      sides: []
    });
    // If we found a customer, assign it.
    if (customer) {
      newOrder.name = customer.name;
      newOrder.address = customer.address;
      newOrder.customer = customer;
    }

    // Save the new order
    newOrder.save(function (err, doc) {
      if (err) {
        console.log(err);
        throw err;
      }

      if (customer) {
        customer.orders.push(doc);
        customer.save(function(err) {
          if (err)
            console.log(err);
        })
      }

      // Create Pizzas and Sides and assign them to the order.
      // Assign new Pizzas and Sides to the order.
      async.each(req.body.menus, function (menu, callback) {
        if (menu.type == "pizza") {
          var newPizza = Pizza({
            name: menu.name,
            size: menu.size,
            exclude: menu.exclude,
            extra: menu.extra,
            order: doc
          })
          newPizza.save(function(err, obj) {
            if (err) {
              console.log(err);
              throw err;
            }
            pizzas.push(obj);
            callback();
          })
        } else if (menu.type == "side") {
          var newSide = Side({
            name: menu.name,
            pearl: menu.pearl,
            order: doc
          })
          newSide.save(function(err, obj) {
            if (err) {
              console.log(err);
              throw err;
            }
            sides.push(obj);
            callback();
          })
        }
      }, function(err) {
        if (err) {
          console.log(err);
        }
        doc.pizzas = pizzas;
        doc.sides = sides;
        doc.save(function(err, result) {
          if (err) {
            console.log(err);
          }
        })
      });
      res.status(201).json({
        message: 'Order Created!'
      });
    });
  });
});

router.patch('/orders/edit', function(req, res, next) {
  Order.findById(req.body._id, function(err, doc) {
    if (err) {
      return res.status(404).json({
        title: 'An error occurred',
        error: err
      });
    }
    if (!doc) {
      return res.status(404).json({
        title: 'No order found',
        error: {message: 'Order could not be found'}
      });
    }
    var isPickup = (req.body.isPickup == "P") ? true : false;
    var isFinished = (req.body.isFinished == "T") ? true: false;
    var oldPhone = doc.phone;
    if (req.body.name) {
      doc.name = req.body.name;
    }
    if (req.body.address) {
      doc.address = req.body.address;
    }
    if (req.body.isPickup != "") {
      doc.isPickup = isPickup;
    }
    if (req.body.timeLeft) {
      var finishTime = new Date();
      finishTime = new Date(finishTime.getTime() + req.body.timeLeft*60000);
      doc.finishTime = finishTime;
    }
    if (req.body.addInfo) {
      doc.addInfo = req.body.addInfo;
    }
    if (req.body.isFinished != "") {
      doc.isFinished = isFinished;
    }
    if (req.body.phone) {
      doc.phone = req.body.phone;
      doc.save(function (err, result) {
        if (err)
          console.log(err);
        async.waterfall([
          function(callback) {
            Customer.findOne({ phone: result.phone }).exec(function(err, newCustomer) {
              if (newCustomer) {
                result.customer = newCustomer;
                result.save();
                newCustomer.orders.push(result);
                newCustomer.save(function (err) {
                  if (err)
                    console.log(err);
                  callback();
                })
              }
            })
          },
          function(callback) {
            Customer.findOne({ phone: oldPhone }).exec(function(err, oldCustomer) {
              if (oldCustomer) {
                var index = oldCustomer.orders.indexOf(result);
                oldCustomer.orders.splice(index, 1);
                oldCustomer.save(function (err) {
                  if (err)
                    console.log(err);
                  callback();
                })
              }
            })
          }
        ], function(err) {
          if (err)
            console.log(err);
          res.status(201).json({
            message: 'Customer Created!',
            obj: doc
          });
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

router.post('/orders/search', (req, res, next) => {
  if (!req.body.address) {
  Order.find({phone: {$regex : ".*"+req.body.phone+".*"}}).sort({finishTime: -1}).exec(function(err, docs) {
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
    ], function (err) {
      if (err)
        console.log(err);
      res.status(200).json({
        message: 'Success',
        obj: [docs, jsonObj]
      });
    })
  })
  } else {
  Order.find({address: {$regex : ".*"+req.body.address+".*"}}).sort({finishTime: -1}).exec(function(err, docs) {
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
    ], function (err) {
      if (err)
        console.log(err);
      res.status(200).json({
        message: 'Success',
        obj: [docs, jsonObj]
      });
    })
  })
  }
});

router.post('/charts', (req, res, next) => {
  Order.find({finishTime: {$gt: req.body.startDate, $lt: req.body.endDate}}).exec(function(err, docs) {

  // Create Date Objects
  var startYear = req.body.startDate.substring(0, 4);
  var startMonth = parseInt(req.body.startDate.substring(5, 7))-1;
  var startDate = req.body.startDate.substring(8, 10);
  var from = new Date(startYear, startMonth, startDate);
  var endYear = req.body.endDate.substring(0, 4);
  var endMonth = parseInt(req.body.endDate.substring(5, 7))-1;
  var endDate = req.body.endDate.substring(8, 10);
  var to = new Date(endYear, endMonth, endDate);

  // Create Arrays to be returned
  var monthly = [12];
  for (i=0; i<12; i++) {
    monthly[i] = {"pizzaCount" : 0, "sideCount" : 0};
  }
  var timeDiff = Math.abs(to.getTime() - from.getTime());
  var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
  diffDays = (diffDays > 30) ? 31 : diffDays;
  var daily = [];
  for (i=0; i<diffDays; i++) {
    daily[i] = {"pizzaCount" : 0, "sideCount" : 0};
  }
  var pie = {"pizzaCount" : 0, "sideCount" : 0};
  var doughnut = {"Peperoni" : 0, "Cheese" : 0,
    "Supreme" : 0, "Vegetarian" : 0, "Hawaiian" : 0,
    "Greek" : 0, "Mexican" : 0, "Meat Lover" : 0,
    "Chicken" : 0, "Canadian" : 0, "Sweet Potato" : 0, "Custom" : 0};

  // Create Date Objects
  var startYear = req.body.startDate.substring(0, 4);
  var startMonth = parseInt(req.body.startDate.substring(5, 7))-1;
  var startDate = req.body.startDate.substring(8, 10);
  var from = new Date(startYear, startMonth, startDate);
  from = new Date(from.getTime() - 7*3600000 - 1)
  var endYear = req.body.endDate.substring(0, 4);
  var endMonth = parseInt(req.body.endDate.substring(5, 7))-1;
  var endDate = req.body.endDate.substring(8, 10);
  var to = new Date(endYear, endMonth, parseInt(endDate));

  async.waterfall([
    // Retrieving Monthly Data
    function(callback) {
      async.forEachOfSeries(monthly, function(month, i, callback2) {
        var firstDate = new Date(to.getFullYear(), to.getMonth()-i, 1);
        var lastDate = new Date(to.getFullYear(), to.getMonth()+1-i, 0);
        var pizzaCount = 0;
        var sideCount = 0;
        Order.find({finishTime : { "$gte" : firstDate, "$lte" : lastDate }}).exec(function(err, result) {
          async.eachSeries(result, function(order, callback3) {
            pizzaCount += order.pizzas.length;
            sideCount += order.sides.length;
            callback3();
          }, function(err) {
            if (err)
              console.log(err);
            monthly[i].pizzaCount = pizzaCount;
            monthly[i].sideCount = sideCount;
            callback2();
          })
        })
      }, function(err) {
        if (err)
          console.log(err);
      })
      callback();
    },
    // Retrieving Daily Data
    function(callback) {
      async.forEachOfSeries(daily, function(day, i, callback2) {
        var today = new Date(to.getFullYear(), to.getMonth(), to.getDate()-i, 0, 0, 0);
        var tomorrow = new Date(to.getFullYear(), to.getMonth(), to.getDate()+1-i, 0, 0, 0);
        var pizzaCount = 0;
        var sideCount = 0;
        Order.find({finishTime: { "$gte" : today, "$lt" : tomorrow }}).exec(function(err, result) {
          async.eachSeries(result, function(order, callback3) {
            pizzaCount += order.pizzas.length;
            sideCount += order.sides.length;
            callback3();
          }, function(err) {
            if (err)
              console.log(err);
            daily[i].pizzaCount = pizzaCount;
            daily[i].sideCount = sideCount;
            callback2();
          })
        })
      }, function(err) {
        if (err)
          console.log(err);
        callback()
      })
    },
    // Retrieving Pizza vs Side Data
    function(callback) {
      var pizzaCount = 0;
      var sideCount = 0;
      var tomorrow = new Date(to.getFullYear(), to.getMonth(), to.getDate()+1, 0, 0, 0);
      Order.find({finishTime: { "$gte" : from, "$lt" : tomorrow }}).exec(function(err, result) {
        async.eachSeries(result, function(order, callback2) {
          pizzaCount += order.pizzas.length;
          sideCount += order.sides.length;
          callback2();
        }, function(err) {
          if (err)
            console.log(err);
          pie.pizzaCount = pizzaCount;
          pie.sideCount = sideCount;
          callback();
        })
      })
    },
    // Retrieving Pizza Types Data
    function(callback) {
      var tomorrow = new Date(to.getFullYear(), to.getMonth(), to.getDate()+1, 0, 0, 0);
      Order.find({finishTime: { "$gte" : from, "$lt" : tomorrow }}).exec(function(err, result) {
        async.eachSeries(result, function(order, callback2) {
          async.eachSeries(order.pizzas, function(pizzaId, callback3) {
            Pizza.findById(pizzaId, function(err, pizzaFound) {
              if (pizzaFound) {
                doughnut[pizzaFound.name]++;
              }
              callback3();
            })
          }, function(err) {
            if (err)
              console.log(err);
            callback2();
          })
        }, function(err) {
          if (err)
            console.log(err);
          callback();
        })
      })
    }
  ], function(err) {
    if (err)
      console.log(err);
    res.status(200).json({
      message: 'Success',
      obj: [monthly, daily, pie, doughnut]
    });
  })

  })
});

module.exports = router;
