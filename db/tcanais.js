const Sequelize = require('sequelize');
const database = require('./dbuser');

const canais = database.define('canais', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome: Sequelize.STRING,
    cid: Sequelize.STRING,
    chave:{   //cid + chatid
        type: Sequelize.STRING,
        unique: true
    },
    chatid: Sequelize.STRING,
})
 
module.exports = canais;