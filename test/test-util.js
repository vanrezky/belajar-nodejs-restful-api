import { prismaClient } from '../src/application/database';
import bcrypt from 'bcrypt';

export const removeTestUser = async () => {
    await prismaClient.user.deleteMany({
        where: {
            username: 'testess',
        },
    });
};

export const createTestUser = async () => {
    const password = await bcrypt.hash('rahasia', 10);
    await prismaClient.user.create({
        data: {
            username: 'testess',
            password: password,
            name: 'Test Test User',
            token: 'test',
        },
    });
};

export const getTestUser = async () => {
    return prismaClient.user.findUnique({
        where: {
            username: 'testess',
        },
    });
};

export const removeTestContact = async () => {
    const user = await getTestUser();
    await prismaClient.contact.deleteMany({
        where: {
            user_id: user.id,
        },
    });
};

export const createTestContact = async () => {
    const user = await getTestUser();

    return prismaClient.contact.create({
        data: {
            first_name: 'van',
            last_name: 'nababan',
            email: 'vanrezky@gmail.com',
            phone: '6282268261012',
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
};

export const getTestContact = async () => {
    const user = getTestUser();
    return prismaClient.contact.findFirst({
        where: {
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
};

export const removeTestAddress = async () => {
    const contact = await getTestContact();
    await prismaClient.address.deleteMany({
        where: {
            contact_id: contact.id,
        },
    });
};

export const craeteTestAddress = async () => {
    const contact = await getTestContact();

    await prismaClient.address.create({
        data: {
            street: 'Jl. Kebon Jeruk No. 10',
            city: 'Jakarta',
            province: 'DKI Jakarta',
            country: 'Indonesia',
            postal_code: 12345,
            contact_id: contact.id,
        },
    });
};

export const getTestAddress = async () => {
    const contact = await getTestContact();
    return prismaClient.address.findFirst({
        where: {
            contact_id: contact.id,
        },
    });
};
