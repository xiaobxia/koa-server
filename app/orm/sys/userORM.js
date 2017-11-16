/**
 * Created by xiaobxia on 2017/6/26.
 */
const BaseORM = require('../baseORM');
module.exports = class UserORM extends BaseORM {
  constructor(connection) {
    super(connection);
    this.defaultTable = 'sys_user';
    this.defaultSelect = ['user_id', 'user_name'];
  }

  getAllUserRawByAccount(account) {
    return this.query({
      sql: `SELECT * FROM ${this.defaultTable} WHERE (email=? OR mobile=? OR user_name=?)`,
      values: [account, account, account]
    });
  }

  getUserRawByAccount(account) {
    return this.query({
      sql: `SELECT * FROM ${this.defaultTable} WHERE state="A" AND (email=? OR mobile=? OR user_name=?)`,
      values: [account, account, account]
    });
  }

  getAllUserByUserId(userId) {
    return this.select({
      where: {
        userId
      }
    });
  }

  getUserByUserId(userId) {
    return this.select({
      where: {
        state: 'A',
        userId
      }
    });
  }

  getAllUserByUserName(userName) {
    return this.select({
      where: {
        userName
      }
    });
  }

  getUserByUserName(userName) {
    return this.select({
      where: {
        state: 'A',
        userName
      }
    });
  }

  getAllUserByEmail(email) {
    return this.select({
      where: {
        email
      }
    });
  }

  getUserByEmail(email) {
    return this.select({
      where: {
        state: 'A',
        email
      }
    });
  }

  addUser(userInfo) {
    return this.insert({
      data: userInfo
    });
  }

  updateUserByUserId(userId, data) {
    return this.update({
      data: data,
      where: {
        userId
      }
    });
  }

  updateUserByEmail(email, data) {
    return this.update({
      data: data,
      where: {
        email
      }
    });
  }

  /*
   getUsersByIds(ids) {
   return this.query({
   sql: `SELECT * FROM ${this.table} WHERE USER_ID IN (?)`,
   values: [ids]
   });
   }


   getUsers(start, offset) {
   return this.query({
   sql: `SELECT USER_ID FROM ${this.table} WHERE STATE="A" LIMIT ?,?`,
   values: [start, offset]
   }).then((results) => {
   if (!results.length) {
   //为空的话直接返回空数组
   return results;
   } else {
   let ids = [];
   for (let k = 0, len = results.length; k < len; k++) {
   ids.push(results[k]['USER_ID']);
   }
   return this.getUsersByIds(ids);
   }
   });
   }

   addUser(userInfo) {
   return this.query({
   sql: `INSERT INTO ${this.table} SET ?`,
   values: userInfo
   });
   }

   checkUserCodeExist(userCode) {
   return this.query({
   sql: `SELECT USER_ID FROM ${this.table} WHERE STATE="A" AND USER_CODE= ?`,
   values: [userCode]
   });
   }

   lockUserById(userId) {
   return this.updateUserByUserId(userId, {
   'IS_LOCKED': 'Y'
   });
   }

   unlockUserById(userId) {
   return this.updateUserByUserId(userId, {
   'IS_LOCKED': 'N'
   });
   }

   deleteUserByWhere(where) {
   let queryObj = this.formatWhere(`DELETE FROM ${this.table} {WHERE}`, where);
   return this.query({
   sql: queryObj.sql,
   values: queryObj.values
   });
   }

   deleteUserById(id) {
   return this.query({
   sql: `DELETE FROM ${this.table} WHERE USER_ID= ?`,
   values: id
   });
   }
   */
};
