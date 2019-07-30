var express = require('express');
var router = express.Router();
var userRouter = require('./users');
var AuthRouter = require('./Auth/router');
var StudentRouter = require('./Student/router');
var ContestRouter = require('./Contest/router');
var TeamRouter = require('./Team/router');

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
