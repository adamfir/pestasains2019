var express = require('express');
var router = express.Router();
var userRouter = require('./users');
var AuthRouter = require('./Auth/authRouter.js');
var StudentRouter = require('./Student/studentRouter');
var ContestRouter = require('./Contest/contestRouter');
var TeamRouter = require('./Team/teamRouter');

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
