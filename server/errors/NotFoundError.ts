export class NotFoundError extends Error {
    statusCode = 404;
    
    constructor (message= 'Resource not found' ) {
        super(message);
    }
}