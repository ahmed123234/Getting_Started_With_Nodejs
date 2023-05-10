const {Router} = require('express');
const authController = require('../controllers/authController');

// create a new instance of Route 
const router = Router();

// render the signup view
router.get('/signup', authController.signup_get);

// craete a new user in db
router.post('/signup', authController.signup_post);

// render the login page
router.get('/login', authController.login_get);

// authunticate the login user
router.post('/login', authController.login_post);

TODO:
// create logout router
router.get('/logout', authController.logout);

module.exports = router;
