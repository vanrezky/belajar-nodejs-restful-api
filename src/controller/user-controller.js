import userService from '../service/user-service.js';
const register = async (req, res, next) => {
    try {
        const result = await userService.register(req.body);
        res.status(200).json({
            message: 'User created successfully',
            data: result,
        });
    } catch (e) {
        next(e);
    }
};

const login = async (req, res, next) => {
    try {
        const result = await userService.login(req.body);
        res.status(200).json({
            message: 'Login success',
            data: result,
        });
    } catch (e) {
        next(e);
    }
};

const profile = async (req, res, next) => {
    try {
        const username = req.user.username;
        const result = await userService.profile(username);
        res.status(200).json({
            message: 'User profile',
            data: result,
        });
    } catch (e) {
        next(e);
    }
};

const update = async (req, res, next) => {
    try {
        const username = req.user.username;
        const result = await userService.update(req.body, username);
        res.status(200).json({
            message: 'User updated',
            data: result,
        });
    } catch (e) {
        next(e);
    }
};

const logout = async (req, res, next) => {
    try {
        const username = req.user.username;
        const result = await userService.logout(username);
        res.status(200).json({
            message: 'Logout success',
        });
    } catch (e) {
        next(e);
    }
};

export default {
    register,
    login,
    profile,
    update,
    logout,
};
