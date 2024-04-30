import Joi from 'joi';

const userRegistrationValidation = Joi.object({
    name: Joi.string().min(5).max(25),
    username: Joi.string().min(5).max(20).required(),
    password: Joi.string().min(5).max(20).required(),
});

const userLoginValidation = Joi.object({
    username: Joi.string().min(5).max(20).required(),
    password: Joi.string().min(5).max(20).required(),
});

const userGetValidation = Joi.string().max(100).required();

const userUpdateValidation = Joi.object({
    name: Joi.string().min(5).max(25),
    password: Joi.string().min(5).max(20),
    confirm_password: Joi.string()
        .valid(Joi.ref('password'))
        .when('password', {
            is: Joi.exist(),
            then: Joi.required(),
        })
        .label('Confirm password')
        .messages({
            'any.only': '{{#label}} does not match the password',
        }),
});

export {
    userRegistrationValidation,
    userLoginValidation,
    userGetValidation,
    userUpdateValidation,
};
