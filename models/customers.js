'use strict';

module.exports = function CustomersModel(Sequelize, DataTypes) {
    const Customers = Sequelize.define('Customers', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'customers',
        freezeTableName: true,
        underscored: true
    });

    return Customers;
};
