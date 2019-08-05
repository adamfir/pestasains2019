let express = require('express'),
    router = express.Router(),
    BillController = require('./BillController'),
    {validateBody, schemas} = require('./BillValidation'),
    JWtController = require('../JWT/JWTController');

router.post('/', JWtController.checkToken, JWtController.isSchool, validateBody(schemas.create), BillController.create);
router.post('/callback', BillController.callback);

module.exports = router;
