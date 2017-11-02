/**
 * Created by xiaobxia on 2017/11/1.
 */
const UserORM = require('./sys/userORM');
const LogAuditORM = require('./sys/logAuditORM');

module.exports = {
  userORM(connection) {
    return new UserORM(connection);
  },
  logAuditORM(connection) {
    return new LogAuditORM(connection);
  }
};
