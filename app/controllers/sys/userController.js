/**
 * Created by xiaobxia on 2017/11/2.
 */
const BaseController = require('../baseController');

module.exports = class UserController extends BaseController {
  register() {
    return async (ctx) => {
      const query = ctx.request.body;
      const data = {
        userCode: query.userCode,
        email: query.email,
        pwd: query.pwd
      };
      this.validate(ctx, {
        userCode: {type: 'string', required: true},
        email: {type: 'string', required: true},
        pwd: {type: 'string', required: true}
      }, data);
      let connection = null;
      try {
        connection = await this.mysqlGetConnection();
        const userService = this.services.userService(connection);
        let user = await userService.register(data);
        this.wrapResult(ctx, {data: 'l'});
        this.mysqlRelease(connection);
      } catch (error) {
        this.mysqlRelease(connection);
        if (error.type) {
          this.wrapResult(ctx, {data: {msg: error.message, login: false}});
        } else {
          throw error;
        }
      }
    }
  }
};
