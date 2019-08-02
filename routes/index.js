var express = require('express');
var router = express.Router();
var userRouter = require('./users');
var AuthRouter = require('./Auth/authRouter');
var StudentRouter = require('./Student/studentRouter');
var ContestRouter = require('./Contest/contestRouter');
var TeamRouter = require('./Team/teamRouter');
var SchoolRouter = require('./School/schoolRouter');
var ParamRouter = require('./Params/ParamRouter');
var TeacherRouter = require('./Teacher/TeacherRouter');

/* GET home page. */
router.get('/', function(req, res, next) {
  return res.json({message:"Hello friend!"});
});
router.use('/users',userRouter);
router.use('/auth',AuthRouter);
router.use('/students',StudentRouter);
router.use('/contests',ContestRouter);
router.use('/teams',TeamRouter);
router.use('/schools',SchoolRouter);
router.use('/params',ParamRouter);
router.use('/teachers',TeacherRouter);

module.exports = router;
