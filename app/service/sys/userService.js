/**
 * Created by xiaobxia on 2017/11/1.
 */
const md5 = require('md5');
const moment = require('moment');
const BaseService = require('../baseService');


module.exports = class UserService extends BaseService {
  constructor(connection) {
    super(connection);
  }

  async register(userInfo) {
    const userEmail = userInfo.email;
    const userName = userInfo.userName;
    const errorMessage = this.localConst.errorMessage;
    //验证用户名和邮箱是否被注册
    const userORM = this.ORMs.userORM(this.connection);
    const verify = await Promise.all([
      userORM.getAllUserByUserName(userName),
      userORM.getAllUserByEmail(userEmail)]
    );
    this.checkDBResult(verify[0], null, errorMessage.DUPLICATE_USER_NAME);
    this.checkDBResult(verify[1], null, errorMessage.DUPLICATE_EMAIL);
    //没有被注册
    const emailVerifyORM = this.ORMs.emailVerifyORM(this.connection);
    const emailRecord = await emailVerifyORM.getRecordByEmail(userEmail);
    //有邮件记录
    if (emailRecord.length > 0) {
      //已被验证成功，两边都验证
      if (emailRecord[0].verifyStatus === 2) {
        this.throwError(errorMessage.DUPLICATE_EMAIL);
      }
      //验证发送间隔
      if (moment(emailRecord[0].updateDate).add(1, 'minutes').isAfter(moment())) {
        this.throwError(errorMessage.FREQUENTLY_OPERATION);
      } else {
        //发送邮件
        const verifyCode = md5(userName + userEmail);
        await this.sendMail(this.localConst.registerVerifyTemplate({
          sender: this.config.email.senderAccount.auth.user,
          address: this.config.project.remoteAddress + '/user/active',
          userEmail: userEmail,
          verifyCode
        }));
        //更新记录
        await emailVerifyORM.updateRecordByEmail(userEmail, {
          ...userInfo,
          verifyCode,
          verifyStatus: 1,
          updateDate: moment().format('YYYY-M-D HH:mm:ss')
        });
        return verifyCode;
      }
    } else {
      //发送邮件
      const verifyCode = md5(userName + userEmail);
      await this.sendMail(this.localConst.registerVerifyTemplate({
        sender: this.config.email.senderAccount.auth.user,
        address: this.config.project.remoteAddress + '/user/active',
        userEmail: userEmail,
        verifyCode
      }));
      //添加记录
      await emailVerifyORM.addRecord({
        ...userInfo,
        verifyCode,
        verifyStatus: 1
      });
      //新增用户
      await userORM.addUser({
        ...userInfo
      });
      return verifyCode;
    }
  }

  async registerResult(verifyCode) {
    const errorMessage = this.localConst.errorMessage;
    const emailVerifyORM = this.ORMs.emailVerifyORM(this.connection);
    //id容易被猜出
    const emailRecord = await emailVerifyORM.getRecordByVerifyCode(verifyCode);
    this.checkDBResult(emailRecord, errorMessage.NO_EMAIL_RECORD);
    //发送状态异常
    if(emailRecord[0].verifyStatus !== 1) {
      this.throwError(errorMessage.EMAIL_OVERDUE)
    }
    return emailRecord[0].email;
  }

  async registerActive(verifyCode) {
    const errorMessage = this.localConst.errorMessage;
    const emailVerifyORM = this.ORMs.emailVerifyORM(this.connection);
    //id容易被猜出
    const emailRecord = await emailVerifyORM.getRecordByVerifyCode(verifyCode);
    this.checkDBResult(emailRecord, errorMessage.NO_EMAIL_RECORD);
    //发送状态异常
    if(emailRecord[0].verifyStatus !== 1) {
      this.throwError(errorMessage.EMAIL_OVERDUE);
    }
    //邮件过期
    if(moment(emailRecord[0].updateDate).add(1, 'days').isAfter(moment())) {
      this.throwError(errorMessage.EMAIL_OVERDUE);
    }
    //激活用户
    const nowTime = moment().format('YYYY-M-D HH:mm:ss');
    await emailVerifyORM.updateRecordByVerifyCode(verifyCode, {
      verifyStatus: 2,
      updateDate: nowTime
    });
    const userORM = this.ORMs.userORM(this.connection);
    await userORM.updateUserByEmail(emailRecord[0].email, {
      active: 'Y',
      activeDate: nowTime,
      updateDate: nowTime
    });
    return emailRecord[0].email;
  }
};
