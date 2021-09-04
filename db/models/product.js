const {Sequelize, DataTypes} = require('sequelize');
const User = require('./user')
const db = require('../index').connection
const Product = db.define('Product', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING
    },

    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    seller: {
        type: DataTypes.UUID,
        reference: {
            model: User,
            key: 'id'

        }
    },

});
Product.belongsTo(User, {as: 'User', foreignKey: 'seller'});
Product.sync();

module.exports = Product
