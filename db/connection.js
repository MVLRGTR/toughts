const {Sequelize} = require('sequelize')

const sequelize = new Sequelize(`${process.env.MYSQL_DB}`,`${process.env.MYSQL_USER}`,`${process.env.MYSQL_PASSWORD}`,{
    host : process.env.MYSQL_HOST,
    dialect: process.env.DIALECT,
    port :process.env.MYSQL_PORT
})

// try{
//     sequelize.authenticate()
//     console.log('Autenticação com o banco feita com sucesso !!!')
// }catch(erro){
//     console.log('A autenticação não foi feita com sucesso , erro :',erro)
// }

module.exports = sequelize