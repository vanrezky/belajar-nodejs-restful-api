import addressService from '../service/address-service';

const get = async (req, res, next) => {
    try {
        const result = await addressService.get(
            parseInt(req.params.contactId, 10),
            req.user.id
        );

        res.status(200).json({
            message: 'Get address successfully',
            data: result,
        });
    } catch (e) {
        next(e);
    }
};

const create = async (req, res, next) => {
    try {
        const result = await addressService.create(
            req.body,
            parseInt(req.params.contactId, 10),
            req.user.id
        );

        res.status(200).json({
            message: 'Address created successfully',
            data: result,
        });
    } catch (e) {
        next(e);
    }
};

const update = async (req, res, next) => {
    try {
        const result = await addressService.update(
            req.body,
            parseInt(req.params.addressId, 10),
            parseInt(req.params.contactId, 10),
            req.user.id
        );

        res.status(200).json({
            message: 'Address updated successfully',
            data: result,
        });
    } catch (e) {
        next(e);
    }
};

const remove = async (req, res, next) => {
    try {
        const result = await addressService.remove(
            parseInt(req.params.addressId, 10),
            parseInt(req.params.contactId, 10),
            req.user.id
        );

        res.status(200).json({
            message: 'Address removed successfully',
        });
    } catch (e) {
        next(e);
    }
};

export default {
    get,
    create,
    update,
    remove,
};
