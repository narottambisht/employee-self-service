const Sequelize = require('sequelize');
const sequelize = require('../utils/Database');
const Users = require('./user');
const Projects = require('./projects');

const UsersProjects = sequelize.define('userProjects', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  }
});

Users.belongsToMany(Projects, {
  through: UsersProjects,
  foreignKeyConstraint: true,
  foreignKey: 'userId'
});

Projects.belongsToMany(Users, {
  through: UsersProjects,
  foreignKeyConstraint: true,
  foreignKey: 'projectId'
})

module.exports = UsersProjects;