let express = require('express'),
    router = express.Router(),
    SchoolController = require('./SchoolController'),
    // {validateBody, schemas} = require('./ContestValidation'),
    JWTController = require('../JWT/JWTController');

router.get('/', SchoolController.list);
router.get('/:_id', SchoolController.get);
router.get('/search', SchoolController.search);

module.exports = router;
