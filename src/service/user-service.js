import {
    userRegistrationValidation,
    userLoginValidation,
    userGetValidation,
    userUpdateValidation,
} from '../validation/user-validation.js';
import { validate } from '../validation/validation.js';
import { prismaClient } from '../application/database.js';
import { ResponseError } from '../error/response-error.js';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { MESSAGES } from '../const/message.js';

const register = async (request) => {
    // validate
    const user = validate(userRegistrationValidation, request);

    // check username exists
    const countUser = await prismaClient.user.count({
        where: {
            username: user.username,
        },
    });

    // username allready exists
    if (countUser === 1) {
        throw new ResponseError(
            400,
            MESSAGES.ERROR_VALIDATOR,
            'Username already exists!'
        );
    }

    // hash password
    user.password = await bcrypt.hash(user.password, 10);

    return prismaClient.user.create({
        data: user,
        select: {
            username: true,
            name: true,
        },
    });
};

const login = async (request) => {
    // validate
    const loginRequest = validate(userLoginValidation, request);

    const user = await prismaClient.user.findFirst({
        where: {
            username: loginRequest.username,
        },
        select: {
            username: true,
            password: true,
        },
    });

    if (!user) {
        throw new ResponseError(
            401,
            MESSAGES.FORBIDDEN,
            'Username or password wrong'
        );
    }

    const isPasswordValid = await bcrypt.compare(
        loginRequest.password,
        user.password
    );

    if (!isPasswordValid) {
        throw new ResponseError(
            401,
            MESSAGES.FORBIDDEN,
            'Username or password wrong'
        );
    }

    const token = uuid().toString();

    // insert token
    return prismaClient.user.update({
        where: {
            username: user.username,
        },
        data: {
            token: token,
        },
        select: {
            token: true,
        },
    });
};

const profile = async (username) => {
    username = validate(userGetValidation, username);

    const user = await prismaClient.user.findUnique({
        where: {
            username: username,
        },
        select: {
            username: true,
            name: true,
        },
    });

    if (!user) {
        throw new ResponseError(404, MESSAGES.NOT_FOUND, 'User not found');
    }

    return user;
};

const update = async (request, username) => {
    const payload = validate(userUpdateValidation, request);
    username = validate(userGetValidation, username);

    const data = {
        name: payload.name,
    };

    //if password not empty
    if (payload.password) {
        data.password = await bcrypt.hash(payload.password, 10);
    }

    return prismaClient.user.update({
        where: {
            username: username,
        },
        data: data,
        select: {
            name: true,
            username: true,
        },
    });
};

const logout = async (username) => {
    username = validate(userGetValidation, username);

    return prismaClient.user.update({
        where: {
            username: username,
        },
        data: {
            token: null,
        },
    });
};

export default {
    register,
    login,
    profile,
    update,
    logout,
};
