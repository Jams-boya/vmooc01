import eventproxy from 'eventproxy';
import _          from 'lodash';
import validator  from 'validator';
import fs         from 'fs';
import py         from '../middlewares/pinyin'; 
import log4js     from 'log4js';
import mongoose   from 'mongoose';
import models 		from '../models';


export default { 
  isExist(tblname, keyfield, keyvalue, valuefiled, value, valueName, callback) {  

    var condition = {};
    if(mongoose.Types.ObjectId.isValid(keyvalue)) {
      condition[keyfield] = {$ne: keyvalue};
    }
    condition[valuefiled] = value;

    models[tblname].count(condition, function (err, result) {
      callback(err, {cnt: result, name: valueName});
    });
  }, 

  isExistByCompanyId(tblname, companyId, keyfield, keyvalue, valuefiled, value, valueName, callback) {  

    var condition = {};

    console.log(keyvalue + ' valid objectid' +mongoose.Types.ObjectId.isValid(keyvalue));
    //id
    if(mongoose.Types.ObjectId.isValid(keyvalue)) {
      condition[keyfield] = {$ne: keyvalue};
    }
    //companyId
    condition['companyId'] = companyId;

    //valueid
    condition[valuefiled] = value;

    models[tblname].count(condition, function (err, result) {
      callback(err, {cnt: result, name: valueName});
    });
  },

  /**
   *  生成 与 模糊匹配条件
   * @param {any} keyword
   * @param {any} fields
   * @returns
   */
  buildAndMatchConditions(fields, data) {
    if (!data)
      return {};
    let conditions = {};
    fields.map(f => {
      
      if (data[f]) {
        data[f] = decodeURIComponent(data[f]);
        conditions[f] = new RegExp(RegExp.escape(data[f].trim()));
      }
        
    });

    return conditions;
  },

  /**
   * 生成模糊匹配查询条件
   * @param {Object} keyword 查询关键字 
   * @param {Array} fields 匹配的字段
   */ 
  buildReMathConditions(keyword, fields) {
    if (!keyword) {
      return {};
    }

    let conditions = {
      '$or': [],
    };

    const re = new RegExp(RegExp.escape(keyword.trim()));
    fields.map(field => conditions.$or.push({[field]: re}));

    return conditions;
  },

  buildLike(keyword, field) {
    if(!keyword || !field) {
      return {};
    }

    const re = new RegExp(RegExp.escape(keyword.trim()));

    return {[field]: re};
  },

  /**
   * 生成分页查询及排序选项
   * @param {Object} 包含查询limit, offset, sort等的对象 
   * @param {Object} defaultOptions  默认配置， 例如 {sort: {name: 1}, lean: false}
   */ 
  buildPageAndOrderOptions({limit, offset, sort}, defaultOptions) {

    let options = {
      limit: 1000,
      skip: 0,
      lean: true,
    };

    defaultOptions && Object.assign(options, defaultOptions);

    if (sort) {
      let sortDecode = decodeURIComponent(sort); 

      let sortArr = _.split(sortDecode, new RegExp('^[+-]')); 

      options.sort = {[sortArr[1]]: _.startsWith(sortDecode, '+') ? 1 : -1};
    }

    if (!validator.isInt(String(limit), {min: 1}) 
      || !validator.isInt(String(offset), {min: 0})) {

      return options;
    }

    return Object.assign(options, {
      limit: Number(limit),
      skip: Number(offset),
    });
  }
}
