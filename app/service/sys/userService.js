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
    const emailVerifyORM = this.ORMs.emailVerifyORM(this.connection);
    const emailRecord = await emailVerifyORM.getRecordByEmail(userEmail);
    //有邮件记录
    if (emailRecord.length > 0) {
      //验证发送间隔
      if(emailRecord[0].verifyStatus === 2){
        this.throwError(errorMessage.DUPLICATE_EMAIL);
      }
      if(moment(emailRecord[0].updateDate).add(1, 'minutes').isAfter(moment())) {
        this.throwError(errorMessage.FREQUENTLY_OPERATION);
      } else {
        //发送邮件
        const verifyCode = md5(userName + userEmail);
        await this.sendMail(this.localConst.registerVerifyTemplate({
          sender: this.config.email.senderAccount.auth.user,
          userEmail: userEmail,
          verifyCode
        }));
        //记录邮件
        await emailVerifyORM.updateRecordByEmail(userEmail,{
          ...userInfo,
          verifyCode,
          verifyStatus: 1,
          updateDate: moment().format('YYYY-M-D HH:mm:ss')
        });
      }
    } else {
      //验证用户名和邮箱是否被注册
      const userORM = this.ORMs.userORM(this.connection);
      //双边验证，防止一张表出问题
      const verify = await Promise.all([
        userORM.getAllUserByUserName(userName),
        userORM.getAllUserByEmail(userEmail)]
      );
      this.checkDBResult(verify[0], null, errorMessage.DUPLICATE_USER_NAME);
      this.checkDBResult(verify[1], null, errorMessage.DUPLICATE_EMAIL);
      //发送邮件
      const verifyCode = md5(userName + userEmail);
      await this.sendMail(this.localConst.registerVerifyTemplate({
        sender: this.config.email.senderAccount.auth.user,
        userEmail: userEmail,
        verifyCode
      }));
      //记录邮件
      await emailVerifyORM.addRecord({
        ...userInfo,
        verifyCode,
        verifyStatus: 1
      });
    }
  }
};
