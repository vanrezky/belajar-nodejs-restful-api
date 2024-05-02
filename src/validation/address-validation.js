import Joi from 'joi';

const addressCreateValidation = Joi.object({
    street: Joi.string().max(100).required(),
    city: Joi.string().max(100).required(),
    province: Joi.string().max(100).required(),
    country: Joi.string().max(100).required(),
    postal_code: Joi.number().max(99999).optional(),
});

export { addressCreateValidation };
