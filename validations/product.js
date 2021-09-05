const Joi = require('joi')
module.exports = {
    productSchema: Joi.object().keys({
        name: Joi.string().min(1).required(),
        price: Joi.number().min(1).required(),

    }).options({stripUnknown: true}),
    productsFilterSchema: Joi.object().keys({
        seller: Joi.string(),
        priceOrder: Joi.string().valid('DESC','ASC'),

    }).options({stripUnknown: true}),

};
