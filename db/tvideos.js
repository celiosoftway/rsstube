const Sequelize = require('sequelize');
const database = require('./dbvideos');

const Videos = database.define('videos', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    idvideo:  Sequelize.STRING,
    urlvideo:  Sequelize.STRING,
    idcanal:  Sequelize.STRING,
    codcanal:  Sequelize.STRING, 
    dtvideo:  Sequelize.STRING,
    idchat:  Sequelize.STRING,
    chave: {    //idchat + idcanal + idvideo
        type: Sequelize.STRING,
        unique: true
    } 
})
 
module.exports = Videos;