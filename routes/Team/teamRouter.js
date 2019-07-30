let express = require('express'),
    router = express.Router(),
    TeamController = require('./TeamController'),
    {validateBody, schemas} = require('./validation'),
    JWtController = require('../JWT/JWTController');

router.post('/', JWtController.checkToken, validateBody(schemas.create), TeamController.create);
router.get('/', JWtController.checkToken, TeamController.list);
router.put('/', JWtController.checkToken, validateBody(schemas.edit), TeamController.edit);
router.delete('/', JWtController.checkToken, validateBody(schemas.delete), TeamController.delete);
router.get('/:_id', JWtController.checkToken, TeamController.get);


module.exports = router;
