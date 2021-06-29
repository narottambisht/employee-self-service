const Sequelize = require('sequelize');
const sequelize = require('../utils/Database');
const User = require('./user');

const Roles = sequelize.define('roles', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  role: {
    type: Sequelize.STRING,
    allowNull: false,
    values: Sequelize.ENUM('ADMIN', 'MANAGER', 'USER')
  },
});

User.belongsTo(Roles);

module.exports = Roles;