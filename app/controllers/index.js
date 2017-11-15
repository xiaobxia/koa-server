/**
 * Created by xiaobxia on 2017/10/31.
 */
const AuthController = require('./sys/authController');
const UserController = require('./sys/userController');
module.exports = {
  authController: new AuthController(),
  userController: new UserController()
};
