const Router = require('koa-router');
const controllers = require('../controllers');
const config = require('../../config/index');

const projectName = config.project.projectName;
if (!projectName) {
  console.error('projectName is required');
  process.exit();
}
const router = new Router({
  prefix: `/${projectName}`
});
//登录
router.post('/sys/login', controllers.authController.login());
router.get('/sys/checkLogin', controllers.authController.checkLogin());
router.get('/sys/logout', controllers.authController.logout());


module.exports = router;
