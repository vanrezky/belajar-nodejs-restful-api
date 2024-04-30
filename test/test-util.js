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

export const removeTestContact = async () => {
    await prismaClient.contact.deleteMany({
        where: {
            first_name: 'van',
        },
    });
};

export const createTestContact = async () => {
    const user = await prismaClient.user.findUnique({
        where: {
            username: 'testess',
        },
        select: {
            id: true,
        },
    });

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
