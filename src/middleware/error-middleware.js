import { ResponseError } from '../error/response-error.js';

const errorMiddleware = async (err, req, res, next) => {
    if (!err) {
        next();
        return;
    }

    console.info('err.message ' + err.message);
    console.info('err.errors ' + err.errors);

    if (err instanceof ResponseError) {
        res.status(err.status)
            .json({
                message: err.message,
                errors: err.errors,
            })
            .end();
    } else {
        res.status(500)
            .json({
                message: 'Internal server error',
                errors: err.errors,
            })
            .end();
    }
};

export { errorMiddleware };
