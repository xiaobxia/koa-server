const qiniu = require("qiniu");
const logger = require('./logger');
const globalQiniuConfig = require('../../config/index').qiniu;
/**
 * @param config
 * accessKey
 * secretKey
 * bucketCode
 * fileName
 * bucketHost
 *
 * @returns {{token: *, bucketHost: *, fileName: (*|string)}}
 */
exports.getUploadToken = function (config) {
  //1.创建鉴权对象
  let mac = new qiniu.auth.digest.Mac(config.accessKey, config.secretKey);
  //2.创建上传凭证
  let options = {
    //空间名
    scope: config.bucketCode + ':' + config.fileName,
    expires: 600,
    returnBody: '{"key":"$(key)","hash":"$(etag)","bucket":"$(bucket)","fname":"$(fname)","fsize":"$(fsize)","mimeType":"$(mimeType)"}'
    // callbackBody: '{"key":"$(key)","hash":"$(etag)","bucket":"$(bucket)","fname":"$(fname)","fsize":"$(fsize)","mimeType":"$(mimeType)"}',
    // callbackBodyType: 'application/json'
  };
  let putPolicy = new qiniu.rs.PutPolicy(options);
  let uploadToken = putPolicy.uploadToken(mac);
  return {
    token: uploadToken,
    bucketHost: config.bucketHost,
    fileName: config.fileName
  };
};
/**
 * @param config
 * accessKey
 * secretKey
 * bucketDomain
 * fileName
 * deadline
 *
 * @returns {*}
 */
exports.getPrivateDownloadUrl = function (config) {
  let mac = new qiniu.auth.digest.Mac(config.accessKey, config.secretKey);
  let qiniuConfig = new qiniu.conf.Config();
  let bucketManager = new qiniu.rs.BucketManager(mac, qiniuConfig);
  //deadline 过期的时间戳
  return bucketManager.privateDownloadUrl(config.bucketDomain, config.fileName, config.deadline);
};
/**
 * @param config
 * accessKey
 * secretKey
 * bucketDomain
 * fileName
 *
 * @returns {*}
 */
exports.getPublicDownloadUrl = function (config) {
  let mac = new qiniu.auth.digest.Mac(config.accessKey, config.secretKey);
  let qiniuConfig = new qiniu.conf.Config();
  let bucketManager = new qiniu.rs.BucketManager(mac, qiniuConfig);
  return bucketManager.publicDownloadUrl(config.bucketDomain, config.fileName);
};
/**
 * @param config
 * accessKey
 * secretKey
 * bucketCode
 * fileName
 *
 * @returns {Promise}
 */
//返回的是promise
exports.deleteFile = function (config) {
  //1.创建鉴权对象
  let mac = new qiniu.auth.digest.Mac(config.accessKey, config.secretKey);
  //bucket管理对象
  let bucketConfig = new qiniu.conf.Config();
  //华南
  bucketConfig.zone = qiniu.zone[globalQiniuConfig.zone];
  let bucketManager = new qiniu.rs.BucketManager(mac, bucketConfig);
  return new Promise(function (resolve, reject) {
    bucketManager.delete(config.bucketCode, config.fileName, function (err, respBody, respInfo) {
      if (err) {
        logger.error(err);
        reject(err);
      } else {
        //成功时返回200
        //TODO 以后可以做七牛的日志统计
        if (+respInfo.statusCode === 200) {
          resolve();
        } else {
          let error = null;
          if (respInfo.data && respInfo.data.error) {
            error = new Error(respInfo.data.error);
          } else {
            error = new Error(new Error('qiniu error'));
          }
          logger.error(error);
          reject(error);
        }
      }
    });
  });
};
