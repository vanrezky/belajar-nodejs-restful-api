import Joi from 'joi';
import JoiPhone from 'joi-phone-number';

const contactCreateValidation = Joi.object({
    first_name: Joi.string().max(100).required(),
    last_name: Joi.string().max(100).required(),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .max(100)
        .required(),
    phone: Joi.extend(JoiPhone).string().phoneNumber().allow(''),
});

export { contactCreateValidation };
