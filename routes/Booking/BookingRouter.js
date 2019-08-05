let express = require('express'),
    router = express.Router(),
    BookingController = require('./BookingController'),
    {validateBody, schemas} = require('./BookingValidation'),
    JWtController = require('../JWT/JWTController');

router.post('/', JWtController.checkToken, JWtController.isSchool, validateBody(schemas.create), BookingController.create);
router.get('/',  JWtController.checkToken, BookingController.list);
router.delete('/', JWtController.checkToken, JWtController.isSchool, validateBody(schemas.delete), BookingController.delete);

module.exports = router;
