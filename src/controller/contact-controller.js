import contactService from '../service/contact-service.js';

const getAll = async (req, res, next) => {
    try {
        const result = await contactService.get(req.query, req.user.id);
        res.status(200).json({
            message: 'Get all contacts successfully',
            data: result,
        });
    } catch (e) {
        next(e);
    }
};
const create = async (req, res, next) => {
    try {
        const result = await contactService.create(req.body, req.user.id);
        res.status(200).json({
            message: 'Contact created successfully',
            data: result,
        });
    } catch (e) {
        next(e);
    }
};

const detail = async (req, res, next) => {
    try {
        const result = await contactService.detail(
            parseInt(req.params.contactId, 10),
            req.user.username
        );

        res.status(200).json({
            message: 'Contact detail',
            data: result,
        });
    } catch (e) {
        next(e);
    }
};

const update = async (req, res, next) => {
    try {
        const result = await contactService.update(
            req.body,
            parseInt(req.params.contactId, 10),
            req.user.id
        );
        res.status(200).json({
            message: 'Contact updated',
            data: result,
        });
    } catch (e) {
        next(e);
    }
};

const remove = async (req, res, next) => {
    try {
        await contactService.remove(
            parseInt(req.params.contactId, 10),
            req.user.id
        );
        res.status(200).json({
            message: 'Contact removed',
        });
    } catch (e) {
        next(e);
    }
};

export default {
    getAll,
    create,
    detail,
    update,
    remove,
};
