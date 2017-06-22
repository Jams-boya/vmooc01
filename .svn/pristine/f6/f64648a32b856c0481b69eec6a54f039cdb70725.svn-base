import _ from 'lodash';
import commonDal from './commonDal';
import mongoose from 'mongoose';
import {Answer, Expert} from '../models';

export default {
  /**
   * 查询讲师信息
   * callback:
   * - Expert, 专家对象
   * @param {Function} callback 回调函数
   * @author gs
   * @author:gs
   */
  findExpert(userId, callback) {
    Expert.findOne({ userId: userId }, {}, {lean: true}, callback);
  },

  /**
   * 更新保存问答管理
   * callback:
   * - Answer: 回答对象
   * - userId: 讲师id
   * @param {Function} callback 回调函数
   * @author:gs
   */
  findExpertInfo(userId, setup, callback) {
    setup = setup.setup;
    Expert.update({userId: userId}, {$set:{money: setup.money, emailMsg: setup.emailMsg, systemMsg: setup.systemMsg}}, (err, data) => {
      console.log("err", err);
      callback(err, data);
    });
  },

}