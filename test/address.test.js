import supertest from 'supertest';
import { web } from '../src/application/web.js';
import { logger } from '../src/application/logging.js';

import {
    createTestUser,
    removeTestUser,
    removeTestContact,
    createTestContact,
    getTestContact,
    removeTestAddress,
    craeteTestAddress,
    getTestAddress,
} from './test-util.js';

describe('GET /api/:contactId/addresses', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
        await craeteTestAddress();
    });

    afterEach(async () => {
        await removeTestAddress();
        await removeTestContact();
        await removeTestUser();
    });
    it('should get addresses', async () => {
        const contact = await getTestContact();
        const result = await supertest(web)
            .get(`/api/contacts/${contact.id}/addresses`)
            .set('Authorization', 'test')
            .send();

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(1);
    });

    it('should reject if contact not found', async () => {
        const result = await supertest(web)
            .get('/api/contacts/87877/addresses')
            .set('Authorization', 'test')
            .send();

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });
});

describe('POST /api/:contactId/addresses', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    });

    afterEach(async () => {
        await removeTestAddress();
        await removeTestContact();
        await removeTestUser();
    });

    it('should able to create address', async () => {
        const contact = await getTestContact();

        const result = await supertest(web)
            .post(`/api/contacts/${contact.id}/addresses`)
            .set('Authorization', 'test')
            .send({
                street: 'jalan raya',
                city: 'jakarta',
                province: 'DKI Jakarta',
                country: 'Indonesia',
                postal_code: 12345,
            });

        expect(result.status).toBe(200);
        expect(result.body.message).toBeDefined();
        expect(result.body.data.street).toBe('jalan raya');
        expect(result.body.data.city).toBe('jakarta');
        expect(result.body.data.province).toBe('DKI Jakarta');
        expect(result.body.data.country).toBe('Indonesia');
        expect(result.body.data.postal_code).toBe(12345);
    });

    it('should reject if request is invalid', async () => {
        const contact = await getTestContact();
        const result = await supertest(web)
            .post(`/api/contacts/${contact.id}/addresses`)
            .set('Authorization', 'test')
            .send({
                street: '',
                city: '',
                province: '',
                country: '',
                postal_code: 12345,
            });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
});

describe('PUT /api/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
        await craeteTestAddress();
    });

    afterEach(async () => {
        await removeTestAddress();
        await removeTestContact();
        await removeTestUser();
    });

    it('should able to update address', async () => {
        const contact = await getTestContact();
        const address = await getTestAddress();

        const result = await supertest(web)
            .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set('Authorization', 'test')
            .send({
                street: 'jalan raya bukit',
                city: 'jakarta',
                province: 'DKI Jakarta',
                country: 'Indonesia',
                postal_code: 11111,
            });

        expect(result.status).toBe(200);
        expect(result.body.message).toBeDefined();
        expect(result.body.data.street).toBe('jalan raya bukit');
        expect(result.body.data.city).toBe('jakarta');
        expect(result.body.data.province).toBe('DKI Jakarta');
        expect(result.body.data.country).toBe('Indonesia');
        expect(result.body.data.postal_code).toBe(11111);
    });

    it('should reject if request is invalid', async () => {
        const contact = await getTestContact();
        const address = await getTestAddress();

        const result = await supertest(web)
            .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set('Authorization', 'test')
            .send({});

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
});

describe('DELETE /api/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
        await craeteTestAddress();
    });

    afterEach(async () => {
        await removeTestAddress();
        await removeTestContact();
        await removeTestUser();
    });

    it('should able to delete address', async () => {
        const contact = await getTestContact();
        const address = await getTestAddress();

        const result = await supertest(web)
            .delete(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set('Authorization', 'test')
            .send();

        expect(result.status).toBe(200);
        expect(result.body.message).toBeDefined();
    });

    it('should reject if request is invalid', async () => {
        const result = await supertest(web)
            .delete('/api/contacts/123/addresses/123')
            .set('Authorization', 'test')
            .send();

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });
});
