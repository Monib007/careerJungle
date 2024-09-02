
const express = require('express')
const {register, login, updateProfile} = require('../controllers/user-controller')
const isAuthenticated = require('../middlewares/isAuthenticated')

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/profile/update').post(isAuthenticated, updateProfile);

export default router;