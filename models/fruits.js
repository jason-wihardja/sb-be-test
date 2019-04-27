'use strict';

module.exports = function FruitsModel(Sequelize, DataTypes) {
    const Fruits = Sequelize.define('Fruits', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'fruits',
        freezeTableName: true,
        underscored: true
    });

    return Fruits;
};
