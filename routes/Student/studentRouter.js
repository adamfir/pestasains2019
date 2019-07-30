let express = require('express'),
    router = express.Router(),
    StudentController = require('./StudentController'),
    {validateBody, schemas} = require('./StudentValidation'),
    JWtController = require('../JWT/JWTController');

router.post('/', JWtController.checkToken, validateBody(schemas.create), StudentController.create);
router.get('/', JWtController.checkToken, StudentController.listBySchool);
router.put('/', JWtController.checkToken, validateBody(schemas.edit), StudentController.edit);
router.delete('/', JWtController.checkToken, validateBody(schemas.delete), StudentController.delete);
// router.post('/login', validateBody(schemas.schoolLogin), StudentController.schoolLogin);

module.exports = router;
