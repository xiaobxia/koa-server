const BaseController = require('../baseController');

module.exports = class AuthController extends BaseController {
  login() {
    return async (ctx) => {
      const query = ctx.request.body;
      const data = {
        account: query.account,
        pwd: query.pwd
      };
      this.validate(ctx, {
        account: {type: 'string', required: true},
        pwd: {type: 'string', required: true}
      }, data);
      let connection = null;
      try {
        connection = await this.mysqlGetConnection();
        const authService = this.services.authService(connection);
        let user = await authService.login(data.account, data.pwd);
        let userInfo = {userId: user.userId, userName: user.userName};
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
      let userInfo = this.getSessionUser(ctx.session);
      // session的id一般只有在使用缓存层的时候会用到
      this.wrapResult(ctx, {data: {
        isLogin: !!userInfo,
        ...userInfo
      }});
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
