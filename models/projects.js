const Sequelize = require('sequelize');
const UUID = require('uuid');
const sequelize = require('../utils/Database');
const Clients = require('./clients');
const Users = require('./user');

const Projects = sequelize.define('projects', {
  id: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: () => UUID.v4()
  },
  projectName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  projectType: {
    type: Sequelize.STRING,
    values: Sequelize.ENUM('Hourly', 'Fixed Price')
  },
  status: {
    type: Sequelize.STRING,
    values: Sequelize.ENUM('Running', 'On Hold', 'Delivered')
  },
  hourlyRate: {
    type: Sequelize.STRING
  }
});

Projects.belongsTo(Clients, { foreignKeyConstraint: true, foreignKey: 'clientId' });
Projects.belongsTo(Users, { foreignKeyConstraint: true, foreignKey: 'projectLead' });

module.exports = Projects;