let express = require('express'),
    router = express.Router(),
    AccomodationController = require('./AccomodationController'),
    {validateBody, schemas} = require('./AccommodationValidation'),
    JWtController = require('../JWT/JWTController');

router.post('/', JWtController.checkToken, JWtController.isAdmin, validateBody(schemas.create), AccomodationController.create);
router.put('/', JWtController.checkToken, JWtController.isAdmin, validateBody(schemas.edit), AccomodationController.edit);
router.get('/', AccomodationController.list);
router.delete('/', JWtController.checkToken, JWtController.isAdmin, validateBody(schemas.delete), AccomodationController.delete);

module.exports = router;
