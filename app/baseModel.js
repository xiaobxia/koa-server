const mysql = require('mysql');
const config = require('../config');
const localConst = require('./const');
const localUtil = require('./util');
const logger = require('./common/logger');
const mailer = require('nodemailer');
const emailConfig = config.email;
const mysqlPool = mysql.createPool(config.mysql);

module.exports = class BaseModel {
  constructor() {
    this.config = config;
    this.localUtil = localUtil;
    this.logger = logger;
    this.localConst = localConst;
    this.mysqlPool = mysqlPool;
    this.isDebug = config.server.debug;
  }

  sendMail(option) {
    //防止timeout
    let transporter = mailer.createTransport(emailConfig.senderAccount);
    return new Promise((resolve, reject) => {
      transporter.sendMail(option, (err, info) => {
        if (err) {
          reject(err);
        } else {
          resolve(info);
        }
      });
    });
  }
};
