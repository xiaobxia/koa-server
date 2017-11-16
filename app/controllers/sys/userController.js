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
        let code = await userService.register(data);
        this.wrapResult(ctx, {data: {success: true, code}});
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

  registerResult() {
    return async (ctx) => {
      const query = ctx.request.query;
      const code = query.code;
      this.validate(ctx, {
        code: {type: 'string', required: true}
      }, {code});
      let connection = null;
      try {
        connection = await this.mysqlGetConnection();
        const userService = this.services.userService(connection);
        let email = await userService.registerResult(code);
        this.wrapResult(ctx, {data: {success: true, email}});
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

  registerActive() {
    return async (ctx) => {
      const query = ctx.request.query;
      const code = query.code;
      this.validate(ctx, {
        code: {type: 'string', required: true}
      }, {code});
      let connection = null;
      try {
        connection = await this.mysqlGetConnection();
        const userService = this.services.userService(connection);
        let email = await userService.registerActive(code);
        this.wrapResult(ctx, {data: {success: true, email}});
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
