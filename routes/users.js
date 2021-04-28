var express = require('express');
var router = express.Router();
const passportJWT = require('../middleware/passportJWT')
const userController = require("../controllers/userController");
const { body } = require('express-validator')
/* GET users listing. */
// http://localhost:3000/users
router.get('/', userController.index);


// http://localhost:3000/users/me
router.get('/me',[passportJWT.isLogin], userController.me);

// http://localhost:3000/users/login
router.post('/login',[
 
  body('email').not().isEmpty().withMessage("Please Input Email").isEmail().withMessage("Patten Email"),
  body('password').not().isEmpty().withMessage("InputPassWord").isLength({min : 3}).withMessage("3")

],userController.login);

router.post('/register',/*[
  body('name').not().isEmpty().withMessage("Pless input email"),
  body('email').not().isEmpty().withMessage("Please Input Email").isEmail().withMessage("Patten Email"),
  body('password').not().isEmpty().withMessage("InputPassWord").isLength({min : 3}).withMessage("3")

],*/userController.register);


module.exports = router;
