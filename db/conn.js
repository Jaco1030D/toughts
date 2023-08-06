const Sequelize = require('sequelize')

const sequelize = new Sequelize('toughts', 'root', '',{
    host:'localhost',
    dialect: 'mysql' //n por virgula no ultim elemento
    
})

    try {
      sequelize.authenticate()
      console.log('Conectado com sucesso')
    } catch (error) {
       console.log(error)
    }

module.exports = sequelize;