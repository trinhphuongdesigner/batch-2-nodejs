var express = require('express');
var router = express.Router();
let products = require('../data/products.json');

/* GET home page. */
router.get('/all', function(req, res, next) {
  res.json(products);
});

router.get('/first', function(req, res, next) {
  const newList = products.filter((item, index) => {
    if (index < 3) return item;
  });

  res.json(newList);
});

module.exports = router;
