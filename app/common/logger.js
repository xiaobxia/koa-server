const log4js = require('log4js');
const path = require('path');
const config = require('../../config');
const loggerConfig = config.logger;
const isDebug = config.server.debug;

log4js.configure({
  appenders: {
    file: {
      type: 'file',
      filename: path.resolve(loggerConfig.dir, loggerConfig.fileName),
      encoding: 'utf-8'
    },
    console: { type: 'console' }
  },
  categories: {
    default: { appenders: [ 'console' ], level: 'all' },
    sysError: {appenders: ['file'], level: 'error'}
  },
  pm2: !isDebug
});
const log = log4js.getLogger('app');
module.exports = log;

// 级别
// logger.trace('Entering cheese testing');
// logger.debug('Got cheese.');
// logger.info('Cheese is Gouda.');
// logger.warn('Cheese is quite smelly.');
// logger.error('Cheese is too ripe!');
// logger.fatal('Cheese was breeding ground for listeria.');
