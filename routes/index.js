var express = require('express');
var router = express.Router();
var userRouter = require('./users');
var AuthRouter = require('./Auth/AuthRouter');
var StudentRouter = require('./Student/Router');
var ContestRouter = require('./Contest/Router');
var TeamRouter = require('./Team/Router');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.use('/users',userRouter);
router.use('/auth',AuthRouter);
router.use('/students',StudentRouter);
router.use('/contests',ContestRouter);
router.use('/teams',TeamRouter);

module.exports = router;
