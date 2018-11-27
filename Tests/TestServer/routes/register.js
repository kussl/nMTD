var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/1', function(req, res, next) {
  res.render('index1', { title: 'Express' });
});
router.get('/10', function(req, res, next) {
  res.render('index10', { title: 'Express' });
});
router.get('/50', function(req, res, next) {
  res.render('index50', { title: 'Express' });
});
router.get('/100', function(req, res, next) {
  res.render('index100', { title: 'Express' });
});

module.exports = router;
