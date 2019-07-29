let express = require('express'),
    router = express.Router(),
    AuthController = require('./AuthController'),
    {validateBody, schemas} = require('./Validation');

router.post('/registration', validateBody(schemas.schoolRegistration), AuthController.schoolRegistration);
router.post('/login', validateBody(schemas.schoolLogin), AuthController.schoolLogin);

module.exports = router;
