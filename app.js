/**
 * Author: Narottam Singh Bisht
 * Date: 18th August, 19
 */

/**
 * Node imports
 */
require('dotenv').config();
const path = require('path');
const express = require("express");
const bodyParser = require('body-parser');
// const expressValidator = require('express-validator');
const sequelize = require('./utils/Database');
const session = require('express-session');
const mySqlSessionStorage = require('express-mysql-session')(session);
var flash = require('connect-flash');
const bcrypt = require('bcryptjs');

/**
 * In app imports
 */
const authRoutes = require('./routes/authRoute');
const adminRoutes = require('./routes/adminRoute');

const Roles = require('./models/roles'),
  Users = require('./models/user'),
  Technology = require('./models/technology');

const { roles, technology } = require('./utils/dataFile');

var sessionStore = new mySqlSessionStorage({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname + '/public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
  secret: 'mySecret',
  resave: false,
  saveUninitialized: false,
  store: sessionStore
}));

app.use(flash());

app.use(authRoutes);
app.use(adminRoutes);

const ADMINPWD = 'admin';

/**
 * function to execute on node server start
 */
bootstrapFunction = async () => {

  /**
   * IF ROLES ARE NOT PRESENT CREATE ROLES IN DB.
   */

  let rolesCount = await Roles.count();
  if (rolesCount === 0)
    Roles.bulkCreate(roles);

  /**
   * IF TECHNOLOGIES ARE NOT PRESENT IN DB CREATE ALL
   */

  let technologyArr = [];
  technology.forEach(tech => {
    let techObj = {
      technologyName: tech
    }
    technologyArr.push(techObj);
  });

  let technologyCount = await Technology.count();
  if (technologyCount === 0)
    Technology.bulkCreate(technologyArr);

  /**
   * IF NO USER EXISTS WITH ADMIN ROLE CREATE A USER WITH ROLE - ADMIN.
   */

  let adminRole = await Roles.findOne({ where: { role: 'ADMIN' } });
  if (adminRole) {
    let adminUser = await Users.findOne({ where: { roleId: adminRole.id } });
    if (!adminUser) {
      let createUser = await Users.create({
        firstName: 'Admin',
        lastName: 'Admin',
        userName: 'Admin',
        designation: 'PROJECT MANAGER',
        email: 'admin@admin.com',
        password: ADMINPWD,
        roleId: adminRole.id
      });

      if (createUser)
        console.log('USER CREATED WITH ADMIN ROLE');
    }
  }
}


sequelize.sync().then(result => {
  app.listen(8000, () => console.log("NODE SERVER RUNNING..."));
  bootstrapFunction();
}).catch(err => {
  console.log(err);
});