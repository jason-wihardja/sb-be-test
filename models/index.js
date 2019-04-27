'use strict';

const fs = require('fs');
const path = require('path');

const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(process.cwd(), 'data.sqlite')
});

const models = { Sequelize, sequelize };

// eslint-disable-next-line arrow-body-style
fs.readdirSync(path.join(__dirname)).filter((file) => {
    return (file.indexOf('.') !== 0) && (path.extname(file) === '.js') && (file !== 'index.js');
}).forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    models[model.name] = model;
});

exports.getModels = () => models;

exports.seed = async () => {
    // Initialize Seed Data
    if (!fs.existsSync(path.join(process.cwd(), 'data.sqlite'))) {
        await sequelize.sync();

        const trx = await sequelize.transaction({
            isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
        });

        try {
            await models.Customers.bulkCreate([
                { name: 'Susan' },
                { name: 'Manda' }
            ], {
                transaction: trx
            });

            await models.Fruits.bulkCreate([
                { name: 'Apple', quantity: 5 },
                { name: 'Papaya', quantity: 1 },
                { name: 'Mango', quantity: 4 }
            ], {
                transaction: trx
            });

            await trx.commit();
        } catch (err) {
            await trx.rollback();
            throw err;
        }
    }
};

module.exports = exports;
