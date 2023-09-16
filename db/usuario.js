const Sequelize = require('sequelize');
const database = require('./dbuser');

// type: Sequelize.DOUBLE
//descricao: Sequelize.STRING

const Usuario = database.define('usuario', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome:  Sequelize.STRING,
    user:  Sequelize.STRING,
    tipo:  Sequelize.STRING,
    tlid: {
        type: Sequelize.STRING,
        unique: true
    }
})
 
module.exports = Usuario;