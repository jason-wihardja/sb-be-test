'use strict';

/* eslint-disable no-console */

global.Promise = require('bluebird');

const exitHook = require('async-exit-hook');
exitHook.hookEvent('SIGUSR2', 0);

const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const Errors = require('./errors');
const Logger = require('./logger');

// eslint-disable-next-line import/order
const expressPino = require('express-pino-logger')({
    logger: Logger.setup()
});
app.use(expressPino);

const models = require('./models');

process.on('message', (msg) => {
    if (msg === 'shutdown') {
        process.kill(process.pid, 'SIGTERM');
    }
});

let server = null;
exitHook(async (callback) => {
    if (server) {
        await server.close();
        console.debug('Server Closed');
    }

    await models.getModels().sequelize.close();
    console.debug('Disconnected from Database');

    process.send('shutdown');
    console.info(`Worker Process ${process.pid} Shutdown`);

    return callback();
});

(async () => {
    app.use(require('./routes'));

    app.use((req, res, next) => {
        next(Errors.NotFound());
    });

    app.use((err, req, res, next) => {
        res.status(err.statusCode).json({
            statusCode: err.statusCode,
            message: err.message
        });
    });

    server = app.listen(process.env.PORT || '3000', () => {
        console.debug(`Listening on port ${server.address().port}!`);
        process.send('ready');
    });
})();
