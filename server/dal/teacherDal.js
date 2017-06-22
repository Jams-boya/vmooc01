import _ from 'lodash';
import eventproxy from 'eventproxy';
import log4js from 'log4js';
import mongoose from 'mongoose';
import validator from 'validator';

import commonDal from './commonDal';
import userapp from '../user/userapp';
import { teacherApply } from '../models';

function findUserInfo(userId) {
  return new Promise((resolve, reject) => {
    userapp.getPersonInfo(
      userId,
      (err, data) => {
        if (err) {
          console.log('err', err);
          return reject(err);
        }
        return resolve(data);
      }
    )
  });

}
export default {

  //56316d2c6d6d8d108496314b
  /**
   * -- {新增合作讲师} --
   * callback:
   * - err, 数据库异常
   * - result, 操作结果
   * @param {Object}  具体对象
   * @param {Function} callback 回调函数
   * @author:ls
   */
  add(content, callback) {
    const t = new teacherApply(content);
    t.save(callback);
  },

  /**
   * -- {再次提交申请合作} --
   * callback:
   * - err, 数据库异常
   * - result, 操作结果
   * @param {Object}  具体对象
   * @param {Function} callback 回调函数
   * @author:ls
   */
  update(id, content, callback) {
    let {name, phone, skilled, email, userName
      , updateAt, updateId, state, myself} = content;
      console.log('content=-=-=-=-=-=-',content);
    teacherApply.findOneAndUpdate({ _id: id },
      {
        $set: {
          name, phone, skilled, email, userName,
          updateAt, updateId, state, myself
        }
      }, { new: true }).exec(callback);
  },

  /**
   * -- {查询教师合作列表} --
   * callback:
   * - err, 数据库异常
   * - result, 操作结果
   * @param {String} params 查询条件
   * @param {Function} callback 回调函数
   * @author:ls
   */
  search(domain, params, callback) {


    let qry = [];
    qry.push({ phone: new RegExp(RegExp.escape(params.val)) });
    qry.push({ email: new RegExp(RegExp.escape(params.val)) });
    qry.push({ name: new RegExp(RegExp.escape(params.val)) });

    const ep = new eventproxy();
    ep.all('count', 'list', (c, l) => {
      callback(null, { count: c, list: l });
    });

    let state = []; //只查询数组内的状态
    params.rule.map((val, idx) => {
      state.push(Number(val));
    });

    if (params.fetch_total) {
      teacherApply.find({ state: { $in: state }, $or: qry, domain }).count().exec((err, count) => {
        ep.emit('count', count);
      });
    } else {
      ep.emit('count', null);
    }

    teacherApply.find({ state: { $in: state }, $or: qry, domain }, null,
      commonDal.buildPageAndOrderOptions(params, { sort: { _id: -1 } })).lean().sort
      ({ createAt: -1 }).exec(async (err, list) => {
        for (let i = 0; i < list.length; i++) {
          let userInfo = await findUserInfo(list[i].userId);
          list[i].user = userInfo;
        }
        ep.emit('list', list);
      });
  },
  /**
   * -- {修改审批状态} --
   * callback:
   * - err, 数据库异常
   * - result, 操作结果
   * @param {Object} content 具体集合
   * @param {Function} callback 回调函数
   * @author:ls
   */
  through(content, callback) {

    teacherApply.findOneAndUpdate({ _id: content.id },
      {
        $set:
        {
          state: content.num,
          updateId: content.updateId,
          updateAt: content.updateAt,
          professional: content.professional
        }
      }, { new: true }).exec(callback);
  },

  /**
   * -- {修改生活照} --
   * callback:
   * - err, 数据库异常
   * - result, 操作结果
   * @param {Object} content 具体修改对象
   * @param {Function} callback 回调函数
   * @author:ls
   */
  uplifePhoto(content, callback) {
    teacherApply.findOneAndUpdate({ _id: content.id },
      {
        $set:
        {
          lifePhoto: content.path,
          updateId: content.userid,
          updateAt: content.updateAt
        }
      },
      { new: true }).exec(callback);
  },
  /**
   * -- {已用户id查询申请讲师} --
   * callback:
   * - err, 数据库异常
   * - result, 操作结果
   * @param {String}  userId 用户id
   * @param {Function} callback 回调函数
   * @author:ls
   */
  findOneUserIdByTeacher(userId, callback) {
    teacherApply.findOne({ userId: userId }).lean().exec(callback);
  },
  /**
   * -- {是否在使用} --
   * callback:
   * - err, 数据库异常
   * - result, 操作结果
   * @param {Object}  具体对象
   * @param {Function} callback 回调函数
   * @author:ls
   */
  employ(content, callback) {
    teacherApply.findOneAndUpdate({ _id: content.id },
      {
        $set:
        {
          state: content.num,
          updateId: content.updateId,
          updateAt: content.updateAt,
        }
      }, { new: true }).exec(callback);
  },
  /**
  * -- {完成状态用来判断下一次用户进入申请合作时直接跳转新页面} --
  * callback:
  * - err, 数据库异常
  * - result, 操作结果
  * @param {String}  userId 用户id
  * @param {Number}  state 0= 第一次进入，1 =第二次进入
  * @param {Function} callback 回调函数
  * @author:ls
  */
  isState(userId, state, state1, callback) {
    teacherApply.findOneAndUpdate({ userId },
      {
        $set: {
          isState1: state,
          isState2: state1
        }
      }, { new: true }).lean().exec(callback);
  }
}


