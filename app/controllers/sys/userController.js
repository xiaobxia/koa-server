/**
 * Created by xiaobxia on 2017/11/2.
 */
const BaseController = require('../baseController');

module.exports = class UserController extends BaseController {
  register() {
    return async (ctx) => {
      const query = ctx.request.body;
      const data = {
        userName: query.userName,
        email: query.email,
        password: query.password
      };
      this.validate(ctx, {
        userName: {type: 'string', required: true},
        email: {type: 'string', required: true},
        password: {type: 'string', required: true}
      }, data);
      let connection = null;
      try {
        connection = await this.mysqlGetConnection();
        const userService = this.services.userService(connection);
        let user = await userService.register(data);
        this.wrapResult(ctx, {data: {success: true}});
        this.mysqlRelease(connection);
      } catch (error) {
        this.mysqlRelease(connection);
        if (error.type) {
          this.wrapResult(ctx, {data: {msg: error.message, success: false}});
        } else {
          throw error;
        }
      }
    }
  }
};
