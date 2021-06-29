const express = require('express');
const router = express.Router();

const isLoggedIn = require('../policies/isLoggedIn');
const userController = require('../controllers/AdminControllers/userController');
const clientController = require('../controllers/AdminControllers/clientController');
const projectController = require('../controllers/AdminControllers/projectController');

/**
 * Admin users listing, update user, add users etc... routes
 */
router.get('/admin/users', isLoggedIn, userController.getUsers);
router.get('/admin/user/add', isLoggedIn, userController.getAddUser);
router.get('/admin/user/delete/:id', userController.deleteUser);
router.get('/admin/user/edit/:id', userController.updateUser);
router.post('/admin/user/add', isLoggedIn, userController.postUpdateOrCreateUser);

router.get('/admin/client/sync', isLoggedIn, clientController.getClients);
router.get('/admin/clients', isLoggedIn, clientController.getClientsList);
router.get('/admin/client/edit/:id', clientController.updateClient);
router.get('/admin/client/delete/:id', isLoggedIn, clientController.deleteClient);
router.post('/admin/client/sync', isLoggedIn, clientController.syncClients);

router.get('/admin/projects', isLoggedIn, projectController.getProjectList);
router.get('/admin/project/sync', isLoggedIn, projectController.addProject)
router.post('/admin/project/sync', isLoggedIn, projectController.syncProjects)

module.exports = router;