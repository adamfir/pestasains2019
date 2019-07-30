let express = require('express'),
    router = express.Router(),
    ContestController = require('./ContestController'),
    {validateBody, schemas} = require('./validation'),
    JWTController = require('../JWT/JWTController');

router.post('/', JWTController.checkToken, validateBody(schemas.create), ContestController.create);
router.get('/', ContestController.list);
router.put('/', JWTController.checkToken, validateBody(schemas.edit), ContestController.edit);
router.delete('/', JWTController.checkToken, validateBody(schemas.delete), ContestController.delete);

module.exports = router;
