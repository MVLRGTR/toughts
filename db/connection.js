const {Sequelize} = require('sequelize')

const sequelize = new Sequelize('toughts','toughts','pensamentos',{
    host : '127.0.0.1',
    dialect: 'mysql',
    port :'3380'
})

try{
    sequelize.authenticate()
    console.log('Conexão com o banco feita com sucesso !!!')
}catch(erro){
    console.log('A conexão não foi estabelecida com sucesso , erro :',erro)
}

module.exports = sequelize