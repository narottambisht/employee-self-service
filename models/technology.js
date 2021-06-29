const Sequelize = require('sequelize');
const User = require('./user');

const sequelize = require('../utils/Database');

const Technology = sequelize.define('technology', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  technologyName: {
    type: Sequelize.STRING,
    allowNull: false
  },
});

User.belongsTo(Technology);

module.exports = Technology;