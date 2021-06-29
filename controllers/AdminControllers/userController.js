const User = require('../../models/user');
const Roles = require('../../models/roles');
const Technology = require('../../models/technology');

exports.getUsers = (req, res, next) => {
  User.findAll({
    raw: true,
    include: [{
      model: Roles,
      required: false,
      attributes: ['role']
    }, {
      model: Technology,
      required: false,
      attributes: ['technologyName']
    }]
  }).then(users => {
    res.render('admin/user/users', { users });
  }).catch(err => {
    console.log(err);
  });
}

exports.getAddUser = (req, res, next) => {
  Technology.findAll()
    .then(technology => {
      res.render('admin/user/addUser', { technology })
    })
    .catch(err => {
      console.log(err);
    })
};

/**
 * Post function to handle both add user and update user post requests
 */
exports.postUpdateOrCreateUser = async (req, res, next) => {
  const { firstName, lastName, email, designation, type, experience, technology, id } = req.body;

  let userRole = await Roles.findOne({ where: { role: type } });
  let userTechnology = await Technology.findOne({ where: { technologyName: technology } });

  if (id === '') {
    User.create({
      firstName, lastName, email, designation, experience, password: 'jftdefault', technologyId: userTechnology.id, roleId: userRole.id
    }).then(user => {
      if (user)
        res.redirect('/admin/users');
    }).catch(err => {
      console.log(err);
    });
  } else {
    User.update({
      firstName, lastName, email, experience, designation, technologyId: userTechnology.id, roleId: userRole.id
    }, { where: { id } })
      .then(result => {
        if (result.length)
          res.redirect('/admin/users');
      })
      .catch(err => {
        console.log('error', err);
      });
  }
}

/**
 * controller to delete users from user's list page.
 */
exports.deleteUser = async (req, res, next) => {
  let rowId = req.params.id;
  let result = await User.destroy({ where: { id: rowId } });
  res.send({ status: result });
}

/**
 * Constroller to satisfy get request of update user's page
 */
exports.updateUser = async (req, res, next) => {
  let userId = req.params.id;
  let userById = await User.findOne({
    raw: true,
    where: { id: userId },
    include: [{
      model: Roles,
      required: false,
      attributes: ['role']
    }, {
      model: Technology,
      required: false,
      attributes: ['technologyName']
    }]
  });

  Technology.findAll()
    .then(technology => {
      res.render('admin/user/addUser', { technology, user: userById })
    })
    .catch(err => {
      console.log(err);
    });
};
