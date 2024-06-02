// Creating a custom response class to send back to the client

class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400; // Error codes are 400 and above
    }
}

export { ApiResponse };
