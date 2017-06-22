import eventproxy from 'eventproxy';
import _ from 'lodash';
import validator from 'validator';
import log4js from 'log4js';
import mongoose from 'mongoose';
import { Course } from '../models';
import { Expert } from '../models';
import { MyCourse } from '../models';
import { Answer } from '../models';
import { Question } from '../models';
import { Peeker } from '../models';
import { Like } from '../models';
import { Messages } from '../models';

export default {
  /**
   * 讲师问答--根据问题id获取问题信息
   * callback:
   * - err, 数据库异常
   * - question, 问题对象
   * @param {String} id 问题id
   * @param {Function} callback 回调函数
   * @author gs
   */
  getExpertQa(id, callback) {
    Question.findOne({ _id: id }, {}, { lean: true }, callback);
  },

  /**
   * 讲师回答--根据问题id获取问题信息
   * callback:
   * - err, 数据库异常
   * - answer, 问题对象
   * @param {String} id 问题id
   * @param {Function} callback 回调函数
   * @author gs
   * @updateAuthor: wac
   */
  answer(userId, id, callback) {
    Answer.findOne({ questionId: id }, {}, { lean: true }, (err, answer) => {
      Question.findOne({ _id: answer.questionId }, {}, { lean: true }, (err, question) => {
        if (answer.answererId && userId == answer.answererId || userId == question.askerId) {
        answer.content = answer.content;
        answer.isPeek = true;
        callback(null, answer);
      } else {
        Peeker.findOne({ answerId: answer._id, userId: userId }, {}, { lean: true }, (err, peeker) => {
          if (peeker != null) {
            answer.content = answer.content;
            answer.isPeek = true;
          } else {
            answer.content = answer.content.substring(0, 30) + "...";
            answer.isPeek = false;
          }
          callback(null, answer);
        });
       }
      });
    });
  },

  /**
   * 查询问题（未登录）
   * @param {any} id
   * @param {any} callback
   */
  answerNoGuser(id, callback) { 
    Answer.findOne({ questionId: id }, {}, { lean: true }, callback);
  },
  /**
   * 推荐问答--根据课程id获取推荐问答信息
   * callback:
   * - err, 数据库异常
   * - question, 问题对象
   * - answer, 回答对象
   * @param {String} courseId 课程id
   * @param {String} questionId 问题id
   * @param {Function} callback 回调函数
   * @author gs
   */
  coursesQa(id, callback) {
    let ep = new eventproxy();
    Question.find({ courseId: id, state: 2 }, {}, { lean: true }, (err, questions) => {
      if (!questions) { 
        return callback(null, []);
      }
      let arr = [];
      ep.after('newList', questions.length, () => {
        for (let i = 0; i < arr.length - 1; i++) {
          let temp;
          if (arr[i].peekCount < arr[i + 1].peekCount) {
            temp = arr[i];
            arr[i] = arr[i + 1];
            arr[i + 1] = temp;
          }
        }
        callback(null, arr);
      });
      questions.map((q) => {
        Answer.find({ questionId: q._id }, {}, { lean: true }).exec((error, answers) => {
          answers.map((a, i) => {
            q.peeker = a.peeker;
            q.peekCount = a.peekCount;
            q.liker = a.liker;
            q.likeCount = a.likeCount;
          });
          arr.push(q);
          ep.emit('newList');
        });
      });
    });
  },

  /**
   * 统计点赞个数
   * @author:gs
   */
  countlike(id, likeCount, callback) {
    Answer.update({ questionId: id }, { $set: { likeCount: Number(likeCount)+1 } }, { upsert: true, lean: true }, callback);
  },
  /**
   * 查询是否点赞
   * @author:gs
   */
  findIsLike(userId, answerId, callback) {
    Like.findOne({ userId: userId, answerId: answerId }, {}, { lean: true }, (err, like) => {
      if (err) {
        console.log('err', err);
      }
      callback(null, like);
    });
  },
  /**
   *
   * 更新偷看
   * @param {any} answers
   * @param {any} callback
   */
  updateLike(id, orderId, callback) {
    Peeker.update({ userId: id, orderId: orderId }, { $set: { isLike: true } }, callback);
  },

  /**
   *
   * 保存点赞者
   *
   * @param {any} answers
   * @param {any} callback
   */
  addLiker(like, callback) {
    let l = new Like(like);
    l.save(callback);
  },
  /**
   * 通过讲师的Id获取讲师问答的价格
   * @author:gs
   */
  selsetMoney(guserId, callback){
    Expert.findOne({userId: guserId}, { lean: true }).select('money').exec(callback);
  },

  /**
   * 专家回答
   * wac
   */
  expertAnswerPay(answers, callback) {
    let answer = new Answer(answers);
    answer.save((err, data) => {
      if (err) {
        callback(err, null)
      } else {
        Question.update({ _id: mongoose.Types.ObjectId(data.questionId) }, { $set: { state: 2 } }, callback);
      }
    });
  },

  /**
 * 新增问题
 * callback:
 * - err, 数据库异常
 * - question, 问题对象
 * @param {Object} question 问题
 * @param {Function} callback 回调函数
 * @author gs
 */
  addQusetion(question, callback) {
    let newQuestion = new Question(question);
    newQuestion.save(callback);
  },

  /**
   * 问题关联问题订单
   * callback:
   * - err, 数据库异常
   * - question, 问题对象
   * @param {String} qId 问题id
   * @param {String} orderId 订单id
   * @param {String} orderSn 订单Sn
   * @param {Function} callback 回调函数
   * @author bs
   */
  addQusetionOrder(qId, orderId, orderSn, callback) {
    Question.update({ _id: qId }, { $set: { ordersId: orderId, ordersCode: orderSn } }, callback);
  },

  /**
  * 问题已支付状态变更
  * callback:
  * - err, 数据库异常
  * - question, 问题对象
  * @param {object} order 问题订单
  * @param {Function} callback 回调函数
  * @author bs
  */
  payQusetionOrder(order, callback) {
    //更新问题状态为已付费
    Question.update({ _id: order.itemId }, { $set: { state: 1 } }, callback);
  },

  /*** 读取专家的回答数 ***/
  loadAnswerCountByExpert(answererId, callback) {
    Answer.count({answererId}, callback);
  }
}