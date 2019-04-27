/* eslint-disable no-console */

'use strict';

const pino = require('pino');

const originalImplementation = {};

exports.setup = () => {
    const logger = pino({
        level: (process.env.LOG_LEVEL || 'TRACE').toLowerCase(),
        prettyPrint: { colorize: true }
    });

    originalImplementation.debug = console.debug;
    console.debug = logger.debug.bind(logger);

    originalImplementation.error = console.error;
    console.error = logger.error.bind(logger);

    originalImplementation.info = console.info;
    console.info = logger.info.bind(logger);

    originalImplementation.log = console.log;
    console.log = logger.info.bind(logger);

    originalImplementation.trace = console.trace;
    console.trace = logger.trace.bind(logger);

    originalImplementation.warn = console.warn;
    console.warn = logger.warn.bind(logger);

    console.fatal = logger.fatal.bind(logger);

    return logger;
};

exports.getOriginalImplementation = () => originalImplementation;

module.exports = exports;
