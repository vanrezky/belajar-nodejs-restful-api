import supertest from 'supertest';
import { web } from '../src/application/web.js';
import { logger } from '../src/application/logging.js';
import {
    createTestUser,
    removeTestUser,
    removeTestContact,
    createTestContact,
    getTestContact,
} from './test-util.js';

describe('POST /api/contacts', () => {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestContact();
        await removeTestUser();
    });

    it('should able to create contact', async () => {
        const result = await supertest(web)
            .post('/api/contacts')
            .set('Authorization', 'test')
            .send({
                first_name: 'van',
                last_name: 'nababan',
                email: 'vanrezky@gmail.com',
                phone: '6282268261012',
            });

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.first_name).toBe('van');
        expect(result.body.data.last_name).toBe('nababan');
        expect(result.body.data.email).toBe('vanrezky@gmail.com');
        expect(result.body.data.phone).toBe('6282268261012');
    });

    it('should able to create contact if phone number is empty', async () => {
        const result = await supertest(web)
            .post('/api/contacts')
            .set('Authorization', 'test')
            .send({
                first_name: 'van',
                last_name: 'nababan',
                email: 'vanrezky@gmail.com',
                phone: '',
            });

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.first_name).toBe('van');
        expect(result.body.data.last_name).toBe('nababan');
        expect(result.body.data.email).toBe('vanrezky@gmail.com');
        expect(result.body.data.phone).toBe('');
    });

    it('should reject if request is invalid', async () => {
        const result = await supertest(web)
            .post('/api/contacts')
            .set('Authorization', 'test')
            .send({
                first_name: '',
                last_name: '',
                email: '',
                phone: '',
            });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if token is empty', async () => {
        const result = await supertest(web).post('/api/contacts').send({
            first_name: 'van',
            last_name: 'nababan',
            email: 'vanrezky@gmail.com',
            phone: '6282268261012',
        });

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });
});

describe('PUT /api/contacts/:contactId', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    });

    afterEach(async () => {
        await removeTestContact();
        await removeTestUser();
    });

    it('should able to update contact', async () => {
        const contact = await getTestContact();

        const result = await supertest(web)
            .put(`/api/contacts/${contact.id}`)
            .set('Authorization', 'test')
            .send({
                first_name: 'van',
                last_name: 'nababan sadewa',
                email: 'vanrezkysadewa@gmail.com',
                phone: '6282268261012',
            });

        expect(result.status).toBe(200);
        expect(result.body.data).toEqual({
            id: contact.id,
            first_name: 'van',
            last_name: 'nababan sadewa',
            email: 'vanrezkysadewa@gmail.com',
            phone: '6282268261012',
        });
    });

    it('should reject if request is invalid', async () => {
        const contact = await getTestContact();

        const result = await supertest(web)
            .put(`/api/contacts/${contact.id}`)
            .set('Authorization', 'test')
            .send({
                first_name: '',
                last_name: '',
                email: '',
                phone: '',
            });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if contact_id is invalid', async () => {
        const result = await supertest(web)
            .put('/api/contacts/021222')
            .set('Authorization', 'test')
            .send({
                first_name: 'van',
                last_name: 'nababan sadewa',
                email: 'vanrezkysadewa@gmail.com',
                phone: '6282268261012',
            });

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if token is empty', async () => {
        const contact = await getTestContact();

        const result = await supertest(web)
            .put(`/api/contacts/${contact.id}`)
            .set('Authorization', '')
            .send({
                first_name: 'van',
                last_name: 'nababan sadewa',
                email: 'vanrezkysadewa@gmail.com',
                phone: '6282268261012',
            });

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });
});

describe('DELETE /api/contacts/:contactId', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    });

    afterEach(async () => {
        await removeTestContact();
        await removeTestUser();
    });

    it('should able to delete contact', async () => {
        const contact = await getTestContact();

        const result = await supertest(web)
            .delete(`/api/contacts/${contact.id}`)
            .set('Authorization', 'test')
            .send();

        expect(result.status).toBe(200);
        expect(result.body.message).toBe('Contact removed');
    });

    it('should reject if contact_id is invalid', async () => {
        const result = await supertest(web)
            .delete('/api/contacts/021222')
            .set('Authorization', 'test')
            .send();

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if token is empty', async () => {
        const contact = await getTestContact();

        const result = await supertest(web)
            .delete(`/api/contacts/${contact.id}`)
            .send();

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if token is invalid', async () => {
        const contact = await createTestContact();

        const result = await supertest(web)
            .delete(`/api/contacts/${contact.id}`)
            .set('Authorization', 'salah')
            .send();

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });
});

describe('GET /api/contacts', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    });

    afterEach(async () => {
        await removeTestContact();
        await removeTestUser();
    });

    it('should able to get contacts', async () => {
        const result = await supertest(web)
            .get('/api/contacts')
            .set('Authorization', 'test')
            .send();

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(1);
    });

    it('should able to filter by name', async () => {
        const contact = await getTestContact();

        const result = await supertest(web)
            .get('/api/contacts')
            .set('Authorization', 'test')
            .query({
                name: contact.first_name,
            })
            .send();

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(1);
    });

    it('should able filter by name and limit', async () => {
        const contact = await getTestContact();

        const result = await supertest(web)
            .get('/api/contacts')
            .set('Authorization', 'test')
            .query({
                name: contact.first_name,
                size: 1,
            })
            .send();

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(1);
    });

    it('should able to filter using name and phone', async () => {
        const contact = await getTestContact();

        const result = await supertest(web)
            .get('/api/contacts')
            .set('Authorization', 'test')
            .query({
                name: 'va',
                phone: contact.phone,
                size: 1,
            })
            .send();

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(1);
        expect(result.body.data[0]).toEqual(contact);
    });
});
