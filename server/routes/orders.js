
const express = require('express');
const router = express.Router();

var Order = require('../../src/models/order');


router.get('/orders', (req, res) => {
  Order.find().exec(function(err, docs) {
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

router.get('/current', (req, res) => {
  Order.find({ isFinished: false }).exec(function(err, docs) {
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
    res.status(200).json({
      message: 'Success!',
      obj: doc
    });
  });
});

// router.patch('/orders/assign', function(req, res, next) {
//   Order.findById(req.params.id, function(err, doc) {
//     if (err) {
//       return res.status(404).json({
//         title: 'An error occurred',
//         error: err
//       });
//     }
//     if (!doc) {
//       return res.status(404).json({
//         title: 'No post found',
//         error: {message: 'Post could not be found'}
//       });
//     }
//     doc.customer = req.body.customer;
//
//   })
// })

module.exports = router;
