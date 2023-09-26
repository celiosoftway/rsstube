const Sequelize = require('sequelize');
require("dotenv").config();

const sequelize = new Sequelize('rsstube','rsstube',process.env.BDSENHA,
                                { dialect: 'mysql', host: process.env.HOST });

module.exports = sequelize;