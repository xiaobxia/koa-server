/**
 * Created by xiaobxia on 2017/11/1.
 */
const BaseService = require('../baseService');


module.exports = class UserService extends BaseService {
  constructor(connection) {
    super(connection);
  }

  async register(userInfo) {
    console.log(this.connection === null)
  }
};