/**
 * Created by xiaobxia on 2017/11/15.
 */
const BaseORM = require('../baseORM');
module.exports = class EmailVerifyORM extends BaseORM {
  constructor(connection) {
    super(connection);
    this.defaultTable = 'sys_email_verify';
  }

  addRecord(data) {
    return this.insert({
      data
    });
  }

  updateRecordByVerifyCode(verifyCode, data) {
    return this.update({
      data: data,
      where: {
        verifyCode
      }
    });
  }

  updateRecordByEmail(email, data) {
    return this.update({
      data: data,
      where: {
        email
      }
    });
  }

  getRecordByEmail(email) {
    return this.select({
      where: {
        email,
      }
    });
  }

  getRecordByVerifyCode(verifyCode) {
    return this.select({
      where: {
        verifyCode
      }
    });
  }

  getRecordByUserName(userName) {
    return this.select({
      where: {
        userName,
      }
    });
  }
};
