class ResponseError extends Error {
    constructor(status, message, errors) {
        if (typeof status === 'undefined' || status === null) {
            throw new Error('Status is required');
        }

        if (typeof message === 'undefined' || message === null) {
            throw new Error('Message is required');
        }

        super(message);
        this.errors = errors;
        this.status = status;
    }
}

export { ResponseError };
