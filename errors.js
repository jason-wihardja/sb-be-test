'use strict';

const errorFactory = require('error-factory');

const errors = [
    { name: 'BadRequest', statusCode: 400, message: 'Bad Request' },
    { name: 'NotAuthorized', statusCode: 401, message: 'Not Authorized' },
    { name: 'Forbidden', statusCode: 403, message: 'Forbidden' },
    { name: 'NotFound', statusCode: 404, message: 'Not Found' },
    { name: 'UnprocessableEntity', statusCode: 422, message: 'Unprocessable Entity' },
    { name: 'InternalServerError', statusCode: 500, message: 'Internal Server Error' },
    { name: 'NotImplemented', statusCode: 501, message: 'Not Implemented' },
    { name: 'ServiceUnavailable', statusCode: 503, message: 'Service Unavailable' }
];

errors.forEach((e) => {
    exports[e.name] = errorFactory(e.name, {
        message: e.message,
        statusCode: e.statusCode
    });
});

module.exports = exports;
