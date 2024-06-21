const {DataTypes} = require ('sequelize')
const db = require('../db/connection')
const User = require('./User')

const Tought = db.define('Tought',{
    title:{
        type:DataTypes.STRING,
        allowNull:false,
        require:true
    }
})

Tought.belongsTo(User)//um pensamento pertence a um usuario
User.hasMany(Tought)//um usuario tem varios pensamentos ligação 1 -> n

module.exports =Tought