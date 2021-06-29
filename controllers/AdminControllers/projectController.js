const { Op } = require('sequelize');
const Users = require('../../models/user');
const Clients = require('../../models/clients');
const Project = require('../../models/projects');
const UsersProjects = require('../../models/userProjects');

exports.addProject = async (req, res, next) => {
  let clients = await Clients.findAll({ raw: true });
  let users = await Users.findAll({ raw: true, where: { roleId: { [Op.ne]: 1 } } });
  res.render('admin/projects/syncProjects', { clients, users });
};



exports.getProjectList = async (req, res, next) => {
  try {
    let projects = await Project.findAll({
      raw: true,
      include: [{
        model: Clients,
        required: false,
        attributes: ['name']
      }, {
        model: Users,
        required: false,
        attributes: ['firstName', 'lastName']
      }, {
        model: Users,
        through: {
          model: UsersProjects
        }
      }]
    });
    console.log('project***', projects);
    res.render('admin/projects/projectList', { clients: {}, projects: {} });
  } catch (error) {
    console.log('error**', error);
  }
};

exports.syncProjects = async (req, res, next) => {
  try {
    const { client, developers, hourlyRate, projectLead, projectName, projectStatus, projectType } = req.body;
    let project = await Project.create({ projectName, projectType, hourlyRate, projectLead, status: projectStatus, clientId: client });

    if (typeof developers === 'string') {
      let user = await Users.findOne({ where: { id: developers } })
      let associatedUser = await project.addUser(user);
    } else {
      developers.forEach(async developer => {
        let user = await Users.findOne({ where: { id: developer } })
        let associatedUser = await project.addUser(user);
      });
    }
  } catch (error) {
    console.log("LOG*******: error", error);
  }
};