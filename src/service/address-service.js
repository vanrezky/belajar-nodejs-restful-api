import { prismaClient } from '../application/database.js';
import { ResponseError } from '../error/response-error.js';
import { validate } from '../validation/validation.js';
import { addressCreateValidation } from '../validation/address-validation.js';
import { MESSAGES } from '../const/message.js';

const get = async (contact_id, user_id) => {
    if (await checkContact(contact_id, user_id)) {
        throw new ResponseError(404, MESSAGES.FORBIDDEN, 'Contact not found');
    }
    return prismaClient.address.findMany({
        where: {
            contact_id: contact_id,
        },
    });
};

const create = async (request, contact_id, user_id) => {
    if (await checkContact(contact_id, user_id)) {
        throw new ResponseError(404, MESSAGES.FORBIDDEN, 'Contact not found');
    }

    const address = validate(addressCreateValidation, request);
    address.contact_id = contact_id;

    return prismaClient.address.create({
        data: address,
        select: {
            id: true,
            street: true,
            city: true,
            province: true,
            country: true,
            postal_code: true,
        },
    });
};

const update = async (request, address_id, contact_id, user_id) => {
    // count contact first
    if (await checkContact(contact_id, user_id)) {
        throw new ResponseError(404, MESSAGES.FORBIDDEN, 'Contact not found');
    }

    if (await checkAddress(address_id, contact_id)) {
        throw new ResponseError(404, MESSAGES.FORBIDDEN, 'Address not found');
    }

    const address = validate(addressCreateValidation, request);

    return prismaClient.address.update({
        where: {
            id: address_id,
        },
        data: address,
        select: {
            id: true,
            street: true,
            city: true,
            province: true,
            country: true,
            postal_code: true,
        },
    });
};

const remove = async (address_id, contact_id, user_id) => {
    if (await checkContact(contact_id, user_id)) {
        throw new ResponseError(404, MESSAGES.FORBIDDEN, 'Contact not found');
    }

    if (await checkAddress(address_id, contact_id)) {
        throw new ResponseError(404, MESSAGES.FORBIDDEN, 'Address not found');
    }

    return prismaClient.address.delete({
        where: {
            id: address_id,
        },
    });
};

const checkContact = async (contact_id, user_id) => {
    const countContactInDatabase = await prismaClient.contact.count({
        where: {
            id: contact_id,
            user_id: user_id,
        },
    });

    return countContactInDatabase != 1;
};

const checkAddress = async (address_id, contact_id) => {
    const totalAddressInDatabase = await prismaClient.address.count({
        where: {
            id: address_id,
            contact_id: contact_id,
        },
    });
    return totalAddressInDatabase != 1;
};

export default { get, create, update, remove };
