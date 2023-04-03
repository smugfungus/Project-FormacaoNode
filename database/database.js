const Sequelize = require("sequelize");

const connection = new Sequelize('questions', 'root', 'rafa123', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;
