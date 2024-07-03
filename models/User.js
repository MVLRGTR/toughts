const {DataTypes} = require ('sequelize')
const db = require('../db/connection')

const User = db.define('User',{
    name:{
        type:DataTypes.STRING,
        require:true
    },
    email:{
        type:DataTypes.STRING,
        require:true
    },
    password:{
        type:DataTypes.STRING,
        require:true
    },
    primarylogin:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    }
})

module.exports = User