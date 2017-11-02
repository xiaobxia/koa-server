const mysql = require('mysql');
const config = require('../config');
const localConst = require('./const');
const localUtil = require('./util');
const logger = require('./common/logger');
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
}
