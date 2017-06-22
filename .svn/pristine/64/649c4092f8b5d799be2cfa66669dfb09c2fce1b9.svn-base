import _ from 'lodash';
import eventproxy from 'eventproxy';
import fs from 'fs';
import log4js from 'log4js';
import mongoose from 'mongoose';
import validator from 'validator';

import commonDal from './commonDal';
import models from '../models';
import py from '../middlewares/pinyin';
import { Expert } from '../models';

/** 搜索条件 */
function buildSearchCondition(query) {
  let condition = {};
  const fields = ["name", "type"];
  condition = commonDal.buildAndMatchConditions(fields, query);
  condition['domain'] = query.domain;
  if (query.isRecommend)
    condition["isRecommend"] = true;
  return condition;
}

export default {
  /**
   * 根据专家id查询专家信息
   * @params: (userId) 专家id
   * @params: (callback) 回调函数
   * @author: wac
   */
  expertInfo(userId, callback) {
    let ep = new eventproxy();
    ep.all('expert', 'answer', 'course', (expert, count, c) => {
      if (!expert) {
        expert = {};
      }
      expert.count = count;
      expert.ownCount = c;
      callback(null, expert);
    });
    models.Expert.findOne({ $or: [{ usEerId: userId }, { createId: userId }] }, {}, { lean: true }, (error, data) => {
      if (!data.viewedCount) {
        data.viewedCount = 0;
      }
      data.viewedCount++;
      models.Expert.update({ $or: [{ userId: userId }, { createId: userId }] }, { viewedCount: data.viewedCount }, false).exec((exerr, exinfo) => {
        ep.emit('expert', data);
      });
    });
    models.Answer.count({ answererId: userId }, (err, count) => {
      ep.emit('answer', count);
    });
    models.Course.count({ teacherId: userId, state: 1 }, (e, c) => {
      ep.emit('course', c);
    });
  },

  /**
   * 根据专家id查询专家的回答信息
   * @params: (answererId) 专家id
   * @params: (listCount) 显示条数
   * @params: (cur_page) 页数
   * @params: (callback) 回调函数
   * @author: wac
   */
  myAnswer(answererId, listCount, cur_page, callback) {
    let ep = new eventproxy();
    models.Answer.find({ answererId: answererId }, {}, { lean: true }, (err, data) => {
      if (!data) {
        return callback(null, data);
      }

      if (data.length > 0) {
        ep.after('loadanswer', data.length, (answers) => {
          return callback(null, data);
        });
        data.map((val, index) => {
          models.Question.findOne({ _id: mongoose.Types.ObjectId(data[index].questionId) }, (error, question) => {
            val.title = question.title;
            val.askerId = question.askerId;
            ep.emit('loadanswer', val);
          });
        });
      } else {
        return callback(null, data)
      }
    }).limit(listCount).skip((cur_page - 1) * listCount)
  },

  /**
   * 根据专家id查询专家课程
   * @params: (answererId) 专家id
   * @params: (callback{(error) 错误，(data) 查询数据}) 回调函数
   * @author: wac
   */
  ownCourse(answererId, callback) {
    models.Course.find({ teacherId: answererId }, callback);
  },

  /**
   * 根据课程id查询课程信息和专家信息
   * @params: (courseId) 课程id
   * @params: (callback{(error) 错误，(data) 查询数据}) 回调函数
   * @author: wac
   */
  playAbuot(courseId, callback) {
    models.Course.findOne({ _id: courseId }, {}, { lean: true }).select('_id name purchaseCount cover techerId').exec((err, course) => {
      models.Expert.findOne({ _id: course.techerId }).select('_id, name avatar professionalTitle').exec(() => { });
    });
  },
  /**
   * 课程首页获取专家信息
   * @params: (callback{(err) 错误，(data) 查询数据}) 回调函数
   * @author: bs
   */
  getExpert(domain, callback) {
    models.Expert.find({domain, isRecommend: true }).select('_id userId name avatar professionalTitle, lifePhoto').limit(4).exec(callback);

  },

  /** 读取专家数量 */
  count(query, callback) {
    const condition = buildSearchCondition(query);
    models.Expert.count(condition, callback);
  },
  /** 读取专家列表 */
  list(query, callback) {
    const condition = buildSearchCondition(query);
    models.Expert.find(condition, null, commonDal.buildPageAndOrderOptions(query, {sort: {_id: -1}}), callback);
  },

  /** 课程推荐修改 */
  applyrecommendcourse(cId, isRecommend, callback) {
    models.Expert.findOneAndUpdate({ _id: cId }, { $set: { isRecommend: isRecommend } }, { new: true }, callback);
  },

  /**
   * 测试
   * @author:gs
   */
  savePerInfo(perInfo, callback) {
    perInfo = new Expert(perInfo);
    perInfo(callback);
  },

  addExpert(obj, callback) {
    let o = new models.Expert(obj);
    o.save(callback);
  },
  /**
   * 根据专家id查询专家课程
   * @params: (answererId) 专家id
   * @params: (callback{(error) 错误，(data) 查询数据}) 回调函数
   * @author: wac
   */
  // ownCourse(answererId, callback) {
  //   models.Course.find({ techerId: answererId }, callback);
  // },
  /**
   * 查询专家的信息
   * @author:gs
   */
  findExpertOther(userId, callback) {
    Expert.findOne({ userId }, callback);
  },
  /**
   * 通过teacherId查询讲师信息
   * @param {string} teacherId
   * @param {callback} callback
   */
  findExpert(teacherId, callback) {
    Expert.findOne({ userId: teacherId }, callback);
  },
  /**
   * 个人资料保存讲师信息
   * @param {object} query 讲师信息
   * @param {callback} callback
   */
  saveExpertPerInfo(userId, query, callback) {
    Expert.update({ userId }, { $set: { name: query.name, nickName: query.nickName, avatar: query.avatar, phone: query.phone, lifePhoto: query.lifePhoto, professionalTitle: query.professionalTitle, briefDescription: query.briefDescription,money: query.money } }, { new: true, upsert: true }, callback);
  },

}