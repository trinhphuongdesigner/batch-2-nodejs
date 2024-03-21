var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ title: 'Trinh Phuong', name: "Trịnh Phương"})
  // res.render('index', { title: 'Trinh Phuong', content: 'Phuong Dep Zai' });
});

module.exports = router;
