const BaseModel = require('../baseModel');


module.exports = class BaseORM extends BaseModel {
  constructor(connection) {
    super();
    this.connection = connection;
    this.defaultTable = 'table';
    this.defaultSelect = ['*'];
    this.defaultWhere = {};
    this.defaultWhereType = 'AND';
  }

  tranceSql(sql) {
    if (this.isDebug) {
      this.logger.trace('sql: ' + sql);
    }
  }

  getConnection() {
    return this.connection;
  }

  query(sqlOption) {
    let connection = this.getConnection();
    return new Promise((resolve, reject) => {
      let query = connection.query(
        sqlOption,
        (error, results, fields) => {
          if (error) {
            this.logger.error(error.stack);
            reject(error);
          } else {
            let _result = this.listToCamelCase(results);
            resolve(_result);
          }
        }
      );
      this.tranceSql(query.sql);
    });
  }

  /**
   * 连字符转驼峰
   * @param data
   * @returns {Array}
   */
  listToCamelCase(data) {
    let tempData = [];
    for (let k = 0, len = data.length; k < len; k++) {
      let tempItem = {};
      for (let str in data[k]) {
        if (data[k].hasOwnProperty(str)) {
          tempItem[this.localUtil.hyphenToCamelCase(str)] = data[k][str];
        }
      }
      tempData.push(tempItem);
    }
    return tempData;
  }

  keyToCamelCase(data) {
    let tempItem = {};
    for (let str in data) {
      if (data.hasOwnProperty(str)) {
        tempItem[this.localUtil.hyphenToCamelCase(str)] = data[str];
      }
    }
    return tempItem;
  }

  /**
   * 驼峰转连字符
   * @param data
   * @returns {{}}
   */
  listToHyphen(data) {
    let tempItem = {};
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        tempItem[this.localUtil.camelCaseToHyphen(key)] = data[key];
      }
    }
    return tempItem;
  }

  keyToHyphen(data) {
    let tempItem = {};
    for (let str in data) {
      if (data.hasOwnProperty(str)) {
        tempItem[this.localUtil.camelCaseToHyphen(str)] = data[str];
      }
    }
    return tempItem;
  }

  formatWhere(sql, where, whereType) {
    let values = [];
    let str = '';
    for (let key in where) {
      if (where.hasOwnProperty(key)) {
        values.push(this.localUtil.camelCaseToHyphen(key), where[key]);
        if (str === '') {
          str += 'WHERE ??=?';
        } else {
          str += ` ${whereType} ??=?`;
        }
      }
    }
    return {
      sql: sql.replace('{WHERE}', str),
      values: values
    };
  }

  select(option) {
    let _option = option || {};
    let _select = _option.select || this.defaultSelect;
    let _where = _option.where || this.defaultWhere;
    let _whereType = _option.whereType || this.defaultWhereType;
    let _table = _option.table || this.defaultTable;
    let queryObj = this.formatWhere(`SELECT ?? FROM ${_table} {WHERE}`, _where, _whereType);
    return this.query({
      sql: queryObj.sql,
      values: [_select, ...queryObj.values]
    });
  }


  count(option) {
    let _option = option || {};
    let _where = _option.where || this.defaultWhere || {};
    let _whereType = _option.whereType || this.defaultWhereType;
    let _table = _option.table || this.defaultTable;
    let queryObj = this.formatWhere(`SELECT COUNT(*) AS count FROM ${_table} {WHERE}`, _where, _whereType);
    return this.query({
      sql: queryObj.sql,
      values: queryObj.values
    });
  }

  update(option) {
    let _option = option || {};
    let _data = _option.data || {};
    let _whereType = _option.whereType || this.defaultWhereType;
    let _where = _option.where || this.defaultWhere;
    let _table = _option.table || this.defaultTable;
    _data = this.keyToHyphen(_data);
    let queryObj = this.formatWhere(`UPDATE ${_table} SET ? {WHERE}`, _where, _whereType);
    return this.query({
      sql: queryObj.sql,
      values: [_data, ...queryObj.values]
    });
  }

  insert(option) {
    let _option = option || {};
    let _data = _option.data || {};
    let _table = _option.table || this.defaultTable;
    _data = this.keyToHyphen(_data);
    return this.query({
      sql: `INSERT INTO ${_table} SET ?`,
      values: _data
    });
  }
};
