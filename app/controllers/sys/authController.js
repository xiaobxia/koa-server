const BaseController = require('../baseController');

module.exports = class AuthController extends BaseController {
  login() {
    return async (ctx) => {
      const query = ctx.request.body;
      const data = {
        userCode: query.userCode,
        pwd: query.pwd
      };
      this.validate(ctx, {
        userCode: {type: 'string', required: true},
        pwd: {type: 'string', required: true}
      }, data);
      let connection = null;
      try {
        connection = await this.mysqlGetConnection();
        const authService = this.services.authService(connection);
        let user = await authService.login(data.userCode, data.pwd);
        let userInfo = {userId: user.userId, userCode: user.userCode, userName: user.userName};
        this.setSessionUser(ctx.session, userInfo);
        this.wrapResult(ctx, {data: {login: true, ...userInfo}});
        this.mysqlRelease(connection);
      } catch (error) {
        this.mysqlRelease(connection);
        if (error.type) {
          this.wrapResult(ctx, {data: {msg: error.message, login: false}});
        } else {
          throw error;
        }
      }
    };
  }

  checkLogin() {
    return async (ctx) => {
      let user = this.getSessionUser(ctx.session);
      let data = {};
      // session的id一般只有在使用缓存层的时候会用到
      data.isLogin = !!user;
      this.wrapResult(ctx, {data: data});
    }
  }

  logout() {
    return async (ctx) => {
      let userInfo = this.getSessionUser(ctx.session);
      if (userInfo) {
        let connection = null;
        try {
          connection = await this.mysqlGetConnection();
          this.mysqlBeginTransaction(connection);
          const authService = this.services.authService(connection);
          await authService.logout(userInfo);
          this.mysqlCommit(connection);
          this.mysqlRelease(connection);
        } catch (error) {
          this.mysqlRollback(connection);
          this.mysqlRelease(connection);
          throw error;
        }
      }
      ctx.session = null;
      this.wrapResult(ctx);
    }
  }
};
