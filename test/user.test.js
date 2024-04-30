import supertest from 'supertest';
import { web } from '../src/application/web.js';
import { logger } from '../src/application/logging.js';
import { createTestUser, removeTestUser } from './test-util.js';

describe('POST /api/users', () => {
    afterEach(async () => {
        await removeTestUser();
    });

    it('Should can register new user', async () => {
        const result = await supertest(web).post('/api/users').send({
            username: 'testess',
            name: 'Test Test User',
            password: 'rahasia',
        });

        expect(result.status).toBe(200);
        expect(result.body.message).toBe('User created successfully');
        expect(result.body.data.username).toBe('testess');
        expect(result.body.data.name).toBe('Test Test User');
        expect(result.body.data.password).toBeUndefined();
    });

    it('Should reject if request is invalid', async () => {
        const result = await supertest(web).post('/api/users').send({
            username: '',
            name: '',
            password: '',
        });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it('Should reject if username already registered', async () => {
        let result = await supertest(web).post('/api/users').send({
            username: 'testess',
            name: 'Test Test User',
            password: 'rahasia',
        });

        result = await supertest(web).post('/api/users').send({
            username: 'testess',
            name: 'Test Test User',
            password: 'rahasia',
        });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
});

describe('POST /api/users/login', () => {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it('Should can login', async () => {
        const result = await supertest(web).post('/api/users/login').send({
            username: 'testess',
            password: 'rahasia',
        });

        expect(result.status).toBe(200);
        expect(result.body.message).toBe('Login success');
        expect(result.body.data.token).toBeDefined();
        expect(result.body.data.token).not.toBe('test');
    });

    it('Should reject login if request invalid', async () => {
        const result = await supertest(web).post('/api/users/login').send({
            username: '',
            password: '',
        });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it('Should reject login if username is wrong', async () => {
        const result = await supertest(web).post('/api/users/login').send({
            username: 'salah',
            password: 'salah',
        });

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });
});

describe('GET /api/users/profile', () => {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it('should able to get profile', async () => {
        const result = await supertest(web)
            .get('/api/users/profile')
            .set('Authorization', 'test')
            .send();

        expect(result.status).toBe(200);
        expect(result.body.message).toBe('User profile');
        expect(result.body.data.username).toBe('testess');
        expect(result.body.data.name).toBe('Test Test User');
    });

    it('should reject if token is empty', async () => {
        const result = await supertest(web).get('/api/users/profile').send();

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if token is invalid', async () => {
        const result = await supertest(web)
            .get('/api/users/profile')
            .set('Authrization', 'salah')
            .send();

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });
});

describe('PATCH /api/users/profile', () => {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it('should able to update profile', async () => {
        const result = await supertest(web)
            .patch('/api/users/profile')
            .set('Authorization', 'test')
            .send({
                name: 'Test Test User 2',
            });

        expect(result.status).toBe(200);
        expect(result.body.message).toBe('User updated');
        expect(result.body.data.name).toBe('Test Test User 2');
        expect(result.body.data.username).toBe('testess');
    });

    it('should able to update password', async () => {
        const result = await supertest(web)
            .patch('/api/users/profile')
            .set('Authorization', 'test')
            .send({
                password: 'rahasia',
                confirm_password: 'rahasia',
            });

        expect(result.status).toBe(200);
        expect(result.body.data.name).toBe('Test Test User');
        expect(result.body.data.username).toBe('testess');
        expect(result.body.data.password).toBeUndefined();
    });

    it('should reject if token is empty', async () => {
        const result = await supertest(web).patch('/api/users/profile').send({
            name: 'Test Test User 2',
        });

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if token is invalid', async () => {
        const result = await supertest(web)
            .patch('/api/users/profile')
            .set('Authrization', 'salah')
            .send({
                name: 'Test Test User 2',
            });

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if name request invalid', async () => {
        const result = await supertest(web)
            .patch('/api/users/profile')
            .set('Authorization', 'test')
            .send({
                name: '',
            });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if password and confirm_password request invalid', async () => {
        const result = await supertest(web)
            .patch('/api/users/profile')
            .set('Authorization', 'test')
            .send({
                password: 'rahasia',
                confirm_password: 'salah',
            });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
});

describe('DELETE /api/users/logout', () => {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it('should able to logout', async () => {
        const result = await supertest(web)
            .delete('/api/users/logout')
            .set('Authorization', 'test')
            .send();

        expect(result.status).toBe(200);
        expect(result.body.message).toBe('Logout success');
        expect(result.body.data).toBeUndefined();

        const result2 = await supertest(web)
            .get('/api/users/profile')
            .set('Authorization', 'test')
            .send();

        expect(result2.status).toBe(401);
        expect(result2.body.errors).toBeDefined();
    });

    it('should reject if token is empty', async () => {
        const result = await supertest(web).delete('/api/users/logout').send();

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });
});
