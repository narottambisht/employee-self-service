const Sequelize = require('sequelize');
const UUID = require('uuid');
const bcrypt = require('bcryptjs');
const sequelize = require('../utils/Database');

const User = sequelize.define('user', {
  id: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: () => UUID.v4()
  },
  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  experience: {
    type: Sequelize.INTEGER,
  },
  designation: {
    type: Sequelize.STRING,
    values: Sequelize.ENUM('DEVELOPER', 'DESIGNER', 'QA', 'LEAD', 'PROJECT MANAGER'),
    allowNull: false
  }
}, {
  hooks: {
    beforeCreate: async (user) => {
      user.password = await bcrypt.hash(user.password, 12);
    }
  }
});

module.exports = User;