let joi = require('joi');

module.exports = {
    validateBody: (schema) => {
        return (req, res, next) => {
            const result = joi.validate(req.body, schema);
            if (result.error){
                return res.status(400).json(result.error);
            }
            if (!req.value) {
                req.value = {};
            }
            req.value['body'] = result.value;
            next();
        }
    },
    schemas:{
        create: joi.object().keys({
            name: joi.string().required(),
            quota: joi.number().required(),
            pricePerNight: joi.number().required(),
        }),
        edit: joi.object().keys({
            _id: joi.string().required(),
            name: joi.string().optional(),
            quota: joi.number().optional(),
            pricePerNight: joi.number().optional(),
        }),
        delete: joi.object().keys({
            _id: joi.string().required(),
        }),
    }
}