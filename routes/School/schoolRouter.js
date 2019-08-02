let express = require('express'),
    router = express.Router(),
    SchoolController = require('./SchoolController'),
    // {validateBody, schemas} = require('./ContestValidation'),
    JWTController = require('../JWT/JWTController');

router.get('/', SchoolController.list);

module.exports = router;
