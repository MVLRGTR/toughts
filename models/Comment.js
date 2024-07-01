const {DataTypes} = require('sequelize')
const db = require('../db/connection')
const User = require('./User')
const Tought = require('./Tought')

const Comment = db.define('Comment',{
    comment:{
        type:DataTypes.STRING,
        require:true
    }
})

Comment.belongsTo(User)
User.hasMany(Comment)

Comment.belongsTo(Tought)
Tought.hasMany(Comment)

module.exports = Comment