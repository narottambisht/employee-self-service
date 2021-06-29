const bcrypt = require('bcryptjs')
const User = require('../models/user');
const Sequelize = require('sequelize');
const { body, validationResult } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'createUser': {
      return [
        body('email').isEmail(),
        body('email').custom(value => {
          return User.findOne({ where: { email: value } })
            .then((user) => {
              if (user) {
                return Promise.reject("Email already in use");
              }
            })
        }),
        body('userName').custom(value => {
          return User.findOne({ where: { userName: value } })
            .then((user) => {
              if (user) {
                return Promise.reject("Username already in use");
              }
            })
        })
      ]
    }
  }
}

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    message: req.flash('notLoggedIn')
  });
};

exports.getLogout = (req, res, next) => {
  req.flash('logoutSuccesfull', 'You have succesfully logged out !')
  req.session.destroy(() => {
    res.redirect('/login')
  });
}

exports.postLogin = (req, res, next) => {
  const { email, password: reqPassword } = req.body;


  User.findOne({
    where: {
      email
    }
  }).then(user => {
    if (user) {
      const { password } = user.dataValues;
      bcrypt.compare(reqPassword, password, (err, result) => {
        if (result) {
          req.session.isLoggedIn = true;
          res.redirect('/admin/users')
        } else {
          req.flash('loginFailureMsg', 'Email or password invalid. Please login again.');
          res.render('auth/login', { message: req.flash('loginFailureMsg') });
        }
      })
    } else {
      req.flash('noUserFoundMsg', 'No user found with this email');
      res.render('auth/login', { message: req.flash('noUserFoundMsg') });
    }
  }).catch(error => {
    console.log('user not found', error);
  })
}

exports.getRegister = (req, res, next) => {
  res.render('auth/register', ({ errors: [] }));
}

exports.postUserRegistered = (req, res, next) => {
  const { userName, email, password, name } = req.body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('auth/register', ({ errors: errors.array() }));
  }

  bcrypt.hash(password, 12)
    .then(hashedPassword => {
      return User.create({
        name,
        userName,
        email,
        password: hashedPassword,
      })
    })
    .then(user => {
      if (user) {
        res.redirect('/login');
      }
    })
    .catch(error => {
      console.log(error);
    })
};

