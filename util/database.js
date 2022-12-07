const Sequelize = require('sequelize');

// console.log(process.env)
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    dialect: 'mysql',
    host: process.env.DB_HOST
});


module.exports = sequelize;
