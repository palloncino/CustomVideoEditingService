var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/video', function(req, res, next) {
  res.json({ title: 'Hello' });
});

module.exports = router;
