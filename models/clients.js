const Sequelize = require('sequelize');
const sequelize = require('../utils/Database');
const UUID = require('uuid');

const Client = sequelize.define('client', {
  id: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: () => UUID.v4()
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  country: {
    type: Sequelize.STRING,
  }
});

module.exports = Client;