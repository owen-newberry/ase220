class ErrorResponse extends Error {
    /**
     * Create custom ErrorResponse
     * @param {string} message Error message
     * @param {number} statusCode HTTP status code
     */
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true; // Distinguish operational errors from programming errors
  
      // Capture stack trace (excluding constructor call from it)
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  module.exports = ErrorResponse;