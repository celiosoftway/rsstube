const Sequelize = require('sequelize');
const database = require('./dbapi');

const api = database.define('api', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    api: Sequelize.STRING,
    chatid:{  
        type: Sequelize.STRING,
        unique: true
    }
})
 
module.exports = api;