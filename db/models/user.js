const { Sequelize, DataTypes } = require('sequelize');
const db=require('../index').connection
const bcrypt = require('bcrypt');
const crypto = require('../../helpers/crypto');

const User = db.define('User', {
    id:{
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING

        // allowNull defaults to true
    },
    password: {
        type: DataTypes.STRING
        // allowNull defaults to true
    },
    roles: {
        type: DataTypes.JSON,

    },
    token: {
        type: DataTypes.STRING
        // allowNull defaults to true
    },


    // Other model options go here
},{
    hooks:{
        beforeCreate( user, options)
{
    const token = crypto.generateJwtToken({
        sub: user.id,
        email: user.email,
        roles: user.roles,
    });
    user.token = token
}
}
});


User.sync();

module.exports=User
