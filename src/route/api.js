import express from 'express';
import userController from '../controller/user-controller.js';
import contactController from '../controller/contact-controller.js';
import addressController from '../controller/address-controller.js';
import { authMiddleware } from '../middleware/auth-middleware.js';

const userRouter = new express.Router();
userRouter.use(authMiddleware);
userRouter.get('/api/users/profile', userController.profile);
userRouter.patch('/api/users/profile', userController.update);
userRouter.delete('/api/users/logout', userController.logout);

userRouter.get('/api/contacts', contactController.getAll);
userRouter.post('/api/contacts', contactController.create);
userRouter.get('/api/contacts/:contactId', contactController.detail);
userRouter.put('/api/contacts/:contactId', contactController.update);
userRouter.delete('/api/contacts/:contactId', contactController.remove);

userRouter.get('/api/contacts/:contactId/addresses', addressController.get);
userRouter.post('/api/contacts/:contactId/addresses', addressController.create);
userRouter.put(
    '/api/contacts/:contactId/addresses/:addressId',
    addressController.update
);
userRouter.delete(
    '/api/contacts/:contactId/addresses/:addressId',
    addressController.remove
);
export { userRouter };
