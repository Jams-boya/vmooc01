import eventproxy from 'eventproxy';
import _          from 'lodash';
import validator  from 'validator';
import log4js     from 'log4js';
import mongoose   from 'mongoose';
import {EnumCode}    from '../models';

export default {

  gettype(q, callback) {
    EnumCode.find({type: q}, callback);
  },

  /**
   * 获取学习方向、课程类型
   * @author:gs
   */
  getclassify(callback) {
    EnumCode.find({}, callback);
  },

  /**
   * 保存学习方向、课程类型
   * @author:gs
   */
  saveAndUpdate(state, callback) {
    let arr = [];
    let ep =new eventproxy();
    arr.push(state['0']);
    arr.push(state['1']);
    ep.after('finish', arr.length, () => {
      callback;
    });
    arr.map((each) => {
      EnumCode.update({ _id: each._id }, { $set: each }, (err, data) => {
        ep.emit('finish');
      });
    });
  },
  /**
   * 根据code获取枚举信息
   * @author shen
   */
  getEnumCodeByCode(code, callback) {
    EnumCode.findOne({code}, callback);
  }

}

