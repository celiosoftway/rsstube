const Sequelize = require('sequelize');
require("dotenv").config();

// npm install sequelize sqlite3
// const sequelize = new Sequelize({ dialect: 'sqlite', storage: './db/users.sqlite' })

const sequelize = new Sequelize('rsstube','rsstube',process.env.BDSENHA,
                                { dialect: 'mysql', host: process.env.HOST });

module.exports = sequelize;