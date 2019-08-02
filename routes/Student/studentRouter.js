let express = require('express'),
    router = express.Router(),
    StudentController = require('./StudentController'),
    {validateBody, schemas} = require('./StudentValidation'),
    JWtController = require('../JWT/JWTController');

router.post('/', JWtController.checkToken, JWtController.isSchool, validateBody(schemas.create), StudentController.create);
router.get('/', JWtController.checkToken, StudentController.listBySchool);
router.put('/', JWtController.checkToken, JWtController.isSchool, validateBody(schemas.edit), StudentController.edit);
router.delete('/', JWtController.checkToken, JWtController.isSchool, validateBody(schemas.delete), StudentController.delete);
// router.post('/login', validateBody(schemas.schoolLogin), StudentController.schoolLogin);

module.exports = router;
