import { prismaClient } from '../application/database';
import { MESSAGES } from '../const/message';

export const authMiddleware = async (req, res, next) => {
    const token = req.get('Authorization');

    if (!token) {
        res.status(401)
            .json({
                errors: {
                    message: MESSAGES.UNAUTHORIZED,
                },
            })
            .end();
    } else {
        const user = await prismaClient.user.findFirst({
            where: {
                token: token,
            },
        });

        if (!user) {
            res.status(401)
                .json({
                    errors: {
                        message: MESSAGES.UNAUTHORIZED,
                    },
                })
                .end();
        } else {
            req.user = user;
            next();
        }
    }
};
