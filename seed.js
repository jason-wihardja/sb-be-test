'use strict';

/* eslint-disable no-console */

const Logger = require('./logger');
Logger.setup();

const models = require('./models');
models.seed().then(() => {
    console.log('Done Seeding');
});
