import { validate } from '../validation/validation.js';
import { prismaClient } from '../application/database.js';
import { ResponseError } from '../error/response-error.js';
import { contactCreateValidation } from '../validation/contact-validation.js';
import { MESSAGES } from '../const/message.js';

const get = async (params, user_id) => {
    const name = params.name;
    const page = params.page ? parseInt(params.page) : 1;
    const size = params.size ? parseInt(params.size) : 10;
    const phone = params.phone;

    console.info('size ' + size);
    console.info('name ' + name);

    let whereCondition = {
        user_id: user_id,
    };

    if (name) {
        whereCondition.OR = [
            {
                first_name: {
                    contains: name,
                },
            },
            {
                last_name: {
                    contains: name,
                },
            },
        ];
    }

    if (phone) {
        if (!whereCondition.OR) {
            whereCondition.OR = [];
        }

        whereCondition.OR.push({
            phone: {
                contains: phone,
            },
        });
    }

    console.info('whereCondition ' + JSON.stringify(whereCondition));

    return prismaClient.contact.findMany({
        where: whereCondition,
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true,
        },
        take: size,
        skip: (page - 1) * size,
    });
};

const create = async (request, user_id) => {
    const data = validate(contactCreateValidation, request);
    data.user_id = user_id;

    return prismaClient.contact.create({
        data: data,
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true,
        },
    });
};

const detail = async (contact_id, username) => {
    const user = await prismaClient.user.findUnique({
        where: {
            username: username,
        },
        select: {
            id: true,
        },
    });

    const contact = prismaClient.contact.findUnique({
        where: {
            id: contact_id,
            user_id: user.id,
        },
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true,
        },
    });

    if (!contact) {
        throw new ResponseError(404, MESSAGES.FORBIDDEN, 'Contact not found');
    }

    return contact;
};

const update = async (request, contact_id, user_id) => {
    const data = validate(contactCreateValidation, request);

    const contact = await prismaClient.contact.findUnique({
        where: {
            id: contact_id,
            user_id: user_id,
        },
        select: {
            id: true,
        },
    });

    if (!contact) {
        throw new ResponseError(404, MESSAGES.FORBIDDEN, 'Contact not found');
    }

    return prismaClient.contact.update({
        where: {
            id: contact_id,
        },
        data: data,
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true,
        },
    });
};

const remove = async (contact_id, user_id) => {
    const contact = await prismaClient.contact.findUnique({
        where: {
            id: contact_id,
            user_id: user_id,
        },
        select: {
            id: true,
        },
    });

    if (!contact) {
        throw new ResponseError(404, MESSAGES.FORBIDDEN, 'Contact not found');
    }

    return prismaClient.contact.delete({
        where: {
            id: contact_id,
        },
    });
};

export default { create, detail, update, remove, get };
