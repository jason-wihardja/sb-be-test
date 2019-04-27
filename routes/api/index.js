'use strict';

/* eslint-disable no-console */

const _ = require('lodash');
const Joi = require('joi');

const express = require('express');
const router = express.Router();

const Errors = require('../../errors');
const models = require('../../models').getModels();

router.get('/kill', async (req, res, next) => {
    console.error('Process will be killed');
    process.kill(process.pid, 'SIGTERM');
});

router.get('/fruits', async (req, res, next) => {
    const fruits = await models.Fruits.findAll({
        where: {
            name: {
                [models.Sequelize.Op.in]: req.query.items.split(',')
            }
        },
        order: [['name', 'ASC']]
    });

    return res.json(fruits);
});

router.post('/order', async (req, res, next) => {
    let input = req.body;

    try {
        input = await Joi.validate(req.body, Joi.object().keys({
            customer: Joi.string().required(),
            items: Joi.array().items(Joi.object().keys({
                name: Joi.string().required(),
                quantity: Joi.number().integer().required()
            })).required()
        }));

        input.items = _.sortBy(input.items, ['name']);
    } catch (err) {
        return next(Errors.BadRequest(err.message));
    }

    const trx = await models.sequelize.transaction({
        isolationLevel: models.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
    });

    try {
        const customer = await models.Customers.findOne({
            where: {
                name: input.customer
            }
        });

        if (!customer) {
            throw Errors.BadRequest('Invalid Customer');
        }

        const fruits = await models.Fruits.findAll({
            where: {
                name: {
                    [models.Sequelize.Op.in]: input.items.map(i => i.name)
                }
            },
            order: [['name', 'ASC']]
        });

        if (fruits.length !== input.items.length) {
            throw Errors.BadRequest('Invalid Items in Cart');
        }

        await Promise.map(fruits, async (fruit, index) => {
            if (input.items[index].quantity > fruit.quantity) {
                throw Errors.UnprocessableEntity('Order is greater than stock amount');
            }

            fruit.set('quantity', fruit.get('quantity') - input.items[index].quantity);
            await fruit.save({
                transaction: trx
            });
        });

        await trx.commit();

        return res.json(fruits);
    } catch (err) {
        console.error(err.stack);
        await trx.rollback();
        return next(err);
    }
});

module.exports = router;
