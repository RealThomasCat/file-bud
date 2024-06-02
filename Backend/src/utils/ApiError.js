/*
    -> Making a custom error class that extends the built-in Error class.
    -> This class will make our debugging easier by providing more standa information about the error.
    -> API errors will come in this format defined by this class.
*/

class ApiError extends Error {
    // Overriding the default Error class constructor
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };
