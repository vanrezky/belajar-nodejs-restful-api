import { MESSAGES } from '../const/message.js';
import { ResponseError } from '../error/response-error.js';

const validate = (schema, request) => {
    const result = schema.validate(request, {
        abortEarly: false,
        allowUnknown: false,
    });

    if (result.error) {
        throw new ResponseError(
            400,
            MESSAGES.ERROR_VALIDATOR,
            result.error.message
        );
    } else {
        return result.value;
    }
};

export { validate };
