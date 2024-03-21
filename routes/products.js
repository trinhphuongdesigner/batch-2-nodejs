var express = require('express');
var router = express.Router();
let products = require('../data/products.json');

/* GET home page. */
router.get('/all', function(req, res, next) {
  res.json(products);
});

router.get('/first', function(req, res, next) {
  const newList = products.filter((item, index) => {
    if (index < 2) return item;
  });

  res.json(newList);
});

router.get('/:id', function(req, res, next) {
  console.log('««««« req.params »»»»»', req.params);
  console.log('««««« req.query »»»»»', req.query);
  let find = {};

  products.forEach((item) => {
    if (item.id == req.params.id) {
      find = item;
    };
  });

  res.json(find);
});


module.exports = router;
