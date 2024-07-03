const {DataTypes} = require ('sequelize')
const db = require('../db/connection')
const User = require('./User')

const Token = db.define('Token',{
    token:{
        type:DataTypes.FLOAT,
    }
})

Token.belongsTo(User) //Um token pertence a um usuario
User.hasOne(Token) // Um Usuraio tem um token por vez

module.exports = Token