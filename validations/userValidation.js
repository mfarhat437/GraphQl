const Joi = require('joi')

module.exports = {
    loginSchema: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().min(1).required(),

    }).options({stripUnknown: true}),
    registrationSchema: Joi.object().keys({
        email: Joi.string().email().required(),
        name: Joi.string().min(3).required(),
        password: Joi.string().min(6).required(),

    }).options({stripUnknown: true}),

};
