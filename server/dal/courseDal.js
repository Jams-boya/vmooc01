import eventproxy from 'eventproxy';
import _ from 'lodash';
import validator from 'validator';
import log4js from 'log4js';
import mongoose from 'mongoose';
import { Course } from '../models';
import { Expert } from '../models';
import { MyCourse } from '../models';
import { EnumCode } from '../models';
import { Answer } from '../models';
import { Peeker } from '../models';
import { Question } from '../models';
import { Recommend } from '../models';
import { teacherApply } from '../models';
import { ExamTpl } from '../models';
import { StudentExam } from '../models';
import { Enshrine } from '../models';
import commonDal from './commonDal';
import moment from 'moment';
import userapp from '../user/userapp.js';
import config from '../config';
import request from 'request';
/** 搜索条件 */
function buildSearchCondition(query) {
  let condition = {};
  const fields = ["name", "type"];
  condition = commonDal.buildAndMatchConditions(fields, query);
  if (query.isRecommend)
    condition["isRecommend"] = true;

  condition['state'] = 1;
  condition['domain'] = query.domain;
  return condition;
}
/**
 * 数字转中文
 * @param {Number} num 数字
 * @returns 
 */
function convertToChinese(num) {
  const N = [
    "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"
  ];
  let str = num.toString();
  let len = num.toString().length;
  console.log(str + "-----------" + len);
  let C_Num = [];
  if(len == 1){
    for (let i = 0; i < len; i++) {
      C_Num.push(N[str.charAt(i)]);
    }
  }else if(len > 1){
    for (let i = 0; i < len; i++) {
        C_Num.length = 0;
        C_Num.push('十'); 
        C_Num.push(N[str.charAt(i)]);
      }
  }
  return C_Num.join('');
}

export default {
  /**
  * 偷看我的--根据筛选条件获取问答信息(总数)
  * callback:
  * - err, 数据库异常
  * - question, 偷看对象
  * @param {INT} curPage 当前页码
  * @param {Object} sortBy 排序方式
  * @param {Object} filter 筛选信息
  * @param {Function} callback 回调函数
  * @author gs
  */
  getPeekMeCount(userId, callback) {
    Answer.count({ answererId: userId }, callback);
  },
  /**
  * 查询问题
  * @author gs
  */
  getMyQuestion(answersId, callback) {
    Answer.findOne({ _id: answersId }, callback);
  },
  /**
   * 根据课程id获取课程
   * callback:
   * - err, 数据库异常
   * - course, 课程对象
   * - question, 问题对象
   * - answer, 回答对象
   * @param {String} id 课程id
   * @param {String} questionId 回答id
   * @param {Function} callback 回调函数
   * @author gs
   */

  getCourse(id, callback) {
    let ep = new eventproxy();
    ep.all('course', 'answer', (course, answer) => {
      let newarr = [];
      newarr.push(course);
      newarr.push(answer);
      callback(null, newarr);
    });

    Course.findOne({ _id: mongoose.Types.ObjectId(id) }, {}, { lean: true }, (error, data) => {
      let totalTime = 0;
      data.price = data.price.toFixed(2);
      data.toc.map(toc => {
        toc.clazz.map(clazz => {
          totalTime += clazz.time;
        });
      });
      data.totalTime = totalTime;
      ep.emit('course', data);
    });

    Question.find({ courseId: id, state: 2 }, (error, question) => {
      let queArr = [];
      if (question.length !== 0) {
        question.map((val, idx) => {
          queArr.push(val._id);
        });
      }

      Answer.find({ 'questionId': { $in: queArr } }).count().exec((err, data) => {
        if (err) {
          console.log(err);
        }
        ep.emit('answer', data);
      })
    });
  },
  // 查询是否是已购买课程(课程)
  findIsBuy(userId, courseId, callback) {
    MyCourse.findOne({ userId: userId, courseId: courseId }, callback);
  },
  // 查询是否购买过课程(问答)
  findIsBuyCourse(userId, questionid, callback) {
    Question.find({ _id: questionid }, (err, data) => {
      let { courseId } = data;
      if (err) {
        return next(err);
      }
      MyCourse.find({ courseId: data[0].courseId, userId: userId }).exec(callback);
    });
  },
  /**
   * 根据课程id获取课程学习人数和学员
   * callback:
   * - err, 数据库异常
   * - course, 课程对象
   * - myCourse, 我的课程对象
   * @param {String} id 课程id
   * @param {String} purchaseCount 学习人数
   * @param {String} studentName 学员姓名
   * @param {Function} callback 回调函数
   * @author gs
   */

  learners(id, callback) {
    Course.findOne({ _id: id }, (err, data) => {
      if (err) {
        return next(err);
      }
      let dataArr = [];
      MyCourse.find({ courseId: data._id })
        .select('userId nickName userAvatar')
        .limit(12)
        .exec((err, mycourse) => {
          dataArr.push(data);
          dataArr.push(mycourse);
          callback(null, dataArr);
        });
    });
  },

  /**
   * 根据课程classify获取相关课程
   * callback:
   * - err, 数据库异常
   * - course, 课程对象
   * @param {String} classify 课程分类
   * @param {String} name 课程名
   * @param {String} price 课程价格
   * @param {Function} callback 回调函数
   * @author gs
   */
  relevantCourse(classify, callback) {
    Course.find({ 'classify': classify, state: 1 }, { lean: true }).select('name price cover').limit(3).exec(callback);
  },

  /**
   *
   * 查询所有课程
   * @param {callback} 回调
   */
  findAllCourse(callback) {
    Course.find({ state: 1 }, { lean: true }).select('name price cover').limit(3).exec(callback);
  },

  /**
   * 根据课程id获取课程介绍信息
   * callback:
   * - err, 数据库异常
   * - course, 课程对象
	 * - expert, 专家对象
   * @param {String} suitableCrowd 适用人群
   * @param {String} preliminary 预备能力
   * @param {String} target 授课目标
   * @param {String} teacherId 教师Id
	 * @param {String} name 专家姓名
	 * @param {String} avatar 专家头像
	 * @param {String} professionalTitle 专家职称
	 * @param {String} briefDescription 专家简介
   * @param {Function} callback 回调函数
   * @author gs
   */
  courseIntro(id, callback) {
    Course.findOne({ _id: id }, (err, data) => {
      if (err) {
        return next(err);
      }
      teacherApply.findOne({ userId: data.teacherId })
        .exec((err, expertData) => {
          let dataArr = [];
          dataArr.push(data);
          dataArr.push(expertData);
          callback(null, dataArr);
        });
    });
  },

  /**
   * 根据课程id获取课程目录信息
   * callback:
   * - err, 数据库异常
   * - course, 课程对象
   * @param {String} id 课程id
   * @param {Function} callback 回调函数
   * @author gs
   */
  courseCatalog(id, callback) {
    Course.find({ _id: id }, callback);
  },

  /**
   * 根据课程id获取问题下的相对应的问答信息
   * callback:
   * - err, 数据库异常
   * - course, 课程对象
   * - Question, 问题对象
   * - Answer, 回答对象
   * @params: {String} courseId 课程id
   * @params: {String} question_id 问题id
   * @params: (callback) 回调函数
   * @author: gs
   */
  courseQa(id, callback) {
    let ep = new eventproxy();
    Question.find({ courseId: id, state: 2 }, {}, { lean: true }, (err, data) => {
      let arr = [];
      ep.after('newList', data.length, () => {
        callback(null, arr);
      });
      for (let i = 0; i < data.length; i++) {
        Answer.findOne({ questionId: data[i]._id }, (error, data2) => {
          if (data2) {
            data[i].peeker = data2.peeker;
            data[i].peekCount = data2.peekCount;
            data[i].liker = data2.liker;
            data[i].likeCount = data2.likeCount;
            arr.push(data[i]);
            ep.emit('newList');
          } else {
            ep.emit('newList');
          }

        });
      }
    });
  },

  /**
   * 课程列表页--根据筛选条件获取总课程数
   * callback:
   * - err, 数据库异常
   * - course, 课程对象
   * @param {Object} filter 筛选信息
   * @param {Function} callback 回调函数
   * @author bs
   */
  courseListCount(filter, callback) {
    Course.count(filter)
      .select('_id name')
      .exec(callback);
  },

  /**
   * 课程列表页--根据筛选条件获取课程信息(分页)
   * callback:
   * - err, 数据库异常
   * - course, 课程对象
   * @param {INT} curPage 当前页码
   * @param {Object} sortBy 排序方式
   * @param {Object} filter 筛选信息
   * @param {Function} callback 回调函数
   * @author bs
   */
  courseList(filter, sortBy, curPage, limit, callback) {
    Course.find(filter)
      .lean()
      .sort(sortBy)
      .skip((curPage - 1) * limit)
      .limit(limit)
      .exec(callback);
  },

  /**
   * 学生端已购买课程--根据筛选条件获取总课程数
   * callback:
   * - err, 数据库异常
   * - course, 课程对象
   * @param {Object} filter 筛选信息
   * @param {Function} callback 回调函数
   * @author bs
   */
  boughtCourseCount(filter, callback) {
    MyCourse.count(filter)
      .select('_id name')
      .exec(callback);
  },

  /**
   * 学生端已购买课程--根据筛选条件获取课程信息(分页)
   * callback:
   * - err, 数据库异常
   * - course, 课程对象
   * @param {INT} curPage 当前页码
   * @param {Object} sortBy 排序方式
   * @param {Object} filter 筛选信息
   * @param {Function} callback 回调函数
   * @author bs
   */
  boughtCourse(filter, sortBy, curPage, limit, callback) {
    let ep = new eventproxy();
    MyCourse.find(filter)
      .lean()
      .sort({ _id: -1 })
      .skip((curPage - 1) * limit)
      .limit(limit)
      .exec((err, courses) => {
        ep.after('findName', courses.length, () => {
          callback(null, courses);
        });
        courses.map(course => {
          Course.findOne({ _id: mongoose.Types.ObjectId(course.courseId) }, (err, data) => {
            if (data) {
              course.name = data.name;
              course.cover = data.cover;
            }

            ep.emit("findName");
          });
        });

      });
  },

  /**
   * 他人赠送课程
   * callback:
   * - err, 数据库异常
   * - course, 课程对象
   * @param {Object} filter 筛选信息
   * @param {Function} callback 回调函数
   * @author bs
   */
  giveNewGiveCourse(filter, callback) {
    MyCourse.find(filter)
      .sort({ _id: -1 })
      .exec((err, courses) => {
        courses.map(course => {
          course.new = false;
          let newMyCourse = new MyCourse(course);
          newMyCourse.save();
        });
        callback(null, courses);
      });
  },

  /**
   * 查询课程分类信息
   * @author: wac
   */
  courseMenuList(callback) {
    EnumCode.find({}, callback);
  },

  /**
   * 随机获取推荐讲师信息
   * @params: reCount 推荐个数
   * @author: wac
   */
  recommend(reCount, callback) {
    let ep = new eventproxy();
    let recommendList = [];
    Expert.find({ isRecommend: true }, (err, relist) => {
      let len = relist.length;
      let randomArr = [];
      function ran() {
        let iflog = 0;
        let index = parseInt(Math.random() * (parseInt(len)));
        for (let j = 0; j < randomArr.length; j++) {
          if (randomArr[j] == index) {
            ran();
            iflog = 1;
            break;
          }
        }
        if (iflog == 0) {
          randomArr.push(index);
        }
      }


      let iLength = len <= reCount ? len : reCount;
      ep.after('repush', iLength, () => {
        callback(null, recommendList);
      });
      for (let i = 0; i < iLength; i++) {
        ran();
        let idx = randomArr[i];
        Expert.findOne({ _id: relist[idx]._id }, (err, data) => {
          recommendList.push(data);
          ep.emit('repush');
        });
      }

    });
  },

  /**
   * 获取人气课程信息(点击次数)
   * @author: wac
   */
  popCourse(domain, type, callback) {
    let condition = { isRecommend: true, state: 1 };
    if (type == 'home') {
      condition['domain'] = domain;
    }
    Course.find(condition).sort({ clickCount: -1 })
      .lean()
      .select('_id name teacherId cover teacherName')
      .limit(10)
      .exec((err, courses) => {
        let $or = [];
        courses.map(course => {
          $or.push({ userId: course.teacherId });
        });
        Expert.find({ $or: $or }, (err, experts) => {
          courses.map(course => {
            if (_.find(experts, { userId: course.teacherId })) {

              course.teacherName = _.find(experts, { userId: course.teacherId }).name;
            }
          });
          callback(null, courses);
        })
      });
  },

  /**
   * 根据Id获取课程详细信息
   * @params: id 课程id
   * @author: wac
   */
  courseDetails(_id, callback) {
    Course.findOne({ _id }, callback);
  },
  // 随机排序
  autoSort(a, b) {
    return Math.random() >= 0.5 ? 1 : -1;
  },
  // 查寻当前的测试结果
  /**
   * 
   * @param {any} examTplId 试题id
   * @param {any} userId 用户id
   * @param {any} courseId 课程id
   * @param {any} tidx 章节id
   * @param {any} cidx 课时id
   * @param {any} callback
   * result: 0 => 未观看或者数据库查询报错
   *         1 => 观看且未测试
   *         2 => 考试未通过60分
   *         3 => 考试通过
   */
  isHasTest(examTplId, userId, courseId, tidx, cidx, callback) {
    const ep = new eventproxy();
    ep.all('studentExam', 'examTpl', 'myCourse', (studentExam, examTpl, myCourse) => {
      let looked = !!_.find(myCourse.speedStu.lookedCourses, looked => looked.cidx == tidx && looked.index == cidx);
      examTpl = _.slice(examTpl.questions.sort(this.autoSort), 0, 10);
      if (studentExam.length === 0 && !looked) {
        callback(null, { result: 0, examData: examTpl });
      } else if (studentExam.length === 0 && looked) {
        callback(null, { result: 1, examData: examTpl });
      } else if (studentExam.length > 0 && _.every(studentExam, res => res.score < 60)) {
        callback(null, { result: 2, examData: examTpl });
      } else {
        callback(null, { result: 3, examData: studentExam });
      }
    });
    StudentExam.find({ examTplId, studentId: userId }, ep.done('studentExam'));
    ExamTpl.findOne({ _id: examTplId }, ep.done('examTpl'));
    MyCourse.findOne({ courseId, userId }, ep.done('myCourse'));
  },
  /**
   * 校验用户是否已购买当前课程
   * @author: bs
   */
  courseCheck(userId, courseId, callback) {
    MyCourse.count({ 'userId': userId, 'courseId': courseId }, callback);
  },

  /**
   * 通过讲师id进入讲师的发布课程页面
   * callback:
   * - course, 课程对象
   * @param {String} id 讲师id
   * @param {Function} callback 回调函数
   * @author gs
   */
  PublishCourse(id, callback) {
    Course.findOne({ teacherId: id }, callback);
  },

  /**
   * 通过讲师id查找讲师的发布的课程
   * callback:
   * - course, 课程对象
   * @param {String} id 讲师id
   * @param {Function} callback 回调函数
   * @author gs
   */
  findToc(id, callback) {
    Course.find({ teacherId: id, state: { $ne: 5 } }, callback);
  },
  /**
   * 添加系列课程信息
   * callback:
   * - course, 课程对象
   * @param {Function} callback 回调函数
   * @author gs
   */
  addCourse(course, callback) {
    if (course._id) {
      Course.update({ _id: mongoose.Types.ObjectId(course._id) }, { $set: course }, (err, data) => {
        if (err) {
          console.log("------err-----", err);
        }
        callback(err, course._id);
      });
    } else {
      course = new Course(course);
      course.save((err, data) => {
        if (err)
          return next(err);
        callback(err, data._id);
      });
    }
  },

  /**
   * 根据专家ID获取专家的回答
   * @author: wac
   */
  expertAnswer(state, curPage, limit, callback) {
    Question.find(state).sort({ '_id': -1 }).lean().skip((Number(curPage) - 1) * Number(limit)).limit(Number(limit)).exec((err, data) => {
      if (data && data.length > 0) {
        let ep = eventproxy();
        ep.after('dataVal', data.length, (valInfo) => {
          callback(null, data);
        })
        data.map((val, idx) => {
          userapp.getPersonInfo(val.askerId, (er, da) => {
            if (da == null) {
              val.nickName = val.askerName;
            } else {
              val.nickName = da.nickName;
            }
            val.money = '￥' + val.money.toFixed(2);
            Answer.findOne({ questionId: val._id }).select('peekCount').exec((error, peekCount) => {
              if (!peekCount) {
                peekCount = {};
                peekCount.peekCount = 0;
              }
              // data.createAt = new Date(data.createAt).toDateString();
              val.createAt = moment(val.createAt).format("YYYY-MM-DD HH:mm:ss");
              val.payAt = moment(val.payAt).format("YYYY-MM-DD HH:mm:ss");
              val.updateAt = moment(val.updateAt).format("YYYY-MM-DD HH:mm:ss");
              let differ = 0;
              if (val.state == 1) {
                let mydate = new Date();
                let dateNow = mydate.toLocaleString();
                differ = 48 - Math.floor((Date.parse(moment(dateNow).format("YYYY-MM-DD HH:mm:ss")) - Date.parse(moment(val.payAt).format("YYYY-MM-DD HH:mm:ss"))) / 1000 / 60 / 60);
              }
              val.state == 0 ? (val.status = '待付款', val.peekCount = '', val.myStr = '', val.differ = '') :
                val.state == 1 ? (parseInt(differ) > 0 ? (val.status = '已付款待回答', val.peekCount = '', val.myStr = '回答', val.differ = '还剩' + differ + '小时') :
                  (val.status = '未回答退款中', val.peekCount = '', val.myStr = '', val.differ = '')) :
                  val.state == 2 ? (val.status = '已回答', val.peekCount = '偷看' + peekCount.peekCount + '次', val.myStr = '', val.differ = '') :
                    val.state == 3 ? (val.status = '已退款', val.peekCount = '48小时未回答', val.myStr = '', val.differ = '') : val.state = '';
              val.askerAvatar = `${config.avatorUrl}/vmooc/findPicOther/${val.askerId}`;
              ep.emit('dataVal', val);
            });
          });

        });
      } else {
        callback(null, data);
      }
    });
  },

  /**
   * 根据专家ID获取专家的回答总数
   * @author: wac
   */
  expertAnswerCount(state, callback) {
    Question.count(state, callback);
  },
  /**
   * 后台课程管理查询
   * @param: condition(查询条件)
   * @author: wac
   */
  cmSelect(domain, condition, curPage, limit, callback) {
    console.log('condition', condition);
    if (!(typeof condition == Object)) {
      condition = {};
    }
    condition['domain'] = domain
    Course.find(condition, {}, { lean: true })
      .sort({ createAt: -1 })
      .skip((curPage - 1) * limit)
      .limit(limit)
      .exec((err, data) => {
        if (data && data.length > 0) {
          data.map((val, idx) => {
            val.state == -1 ? data[idx].delStr = "" : val.state == 0 ? data[idx].delStr = "" : val.state == 1 ? data[idx].delStr = "违规下架" : val.state == 2 ? data[idx].delStr = "" : data[idx].delStr = "审核通过";
            val.state == -1 ? data[idx].status = "视频转码中" :
              val.state == 0 ? data[idx].status = "建设中" :
                val.state == 1 ? data[idx].status = "售卖中" :
                  val.state == 2 ? data[idx].status = "违规下架" :
                    data[idx].status = "违规待审核";
            if (idx == data.length - 1) {
              callback(null, data);
            }
          });
        } else {
          callback(null, data);
        }
      });
  },
  /**
  * 后台课程数据总数
  * @author: wac
  */
  cmSelectCount(condition, callback) {
    Course.count(condition).exec(callback);
  },
  /**
    * 通过讲师id获取讲师当前课程
    *根据课程ID删除课程
    * @param {String} courseId 课程Id
    * @param {Function} callback 回调函数
    * @author bs
    */
  delCourse(courseId, callback) {
    Course.update({ _id: courseId }, { $set: { state: 5 } }, callback);
  },

  /**
    *根据课程id获取课程
    * @param {String} courseId 课程Id
    * @param {Function} callback 回调函数
    * @author bs
    */
  getCourseById(courseId, callback) {
    Course.findOne({ _id: courseId }, callback);
  },

  /**
   * 添加微课程信息
   * callback:
   * - course, 微课程对象
   * @param {Function} callback 回调函数
   * @author gs
   */
  addMicroCourse(course, callback) {
    if (course._id) {
      Course.update({ _id: mongoose.Types.ObjectId(course._id) }, { $set: course }, (err, data) => {
        if (err) {
          return next(err);
        }
        callback(err, course._id);
      });
    } else {
      course = new Course(course);
      course.save((err, data) => {
        if (err)
          return next(err);
        callback(err, data._id);
      });
    }
  },

  // 查询偷看人数并保存到answer表
  findpeekCount(answersId, callback) {
    Peeker.count({ answerId: answersId }).count().exec((err, data) => {
      if (err) {
        console.log('err', err);
      }
      Answer.update({ _id: answersId }, { $set: { peekCount: data } }, { new: true }, callback);
    })
  },

  /** 课程推荐修改 */
  applyrecommendcourse(cId, isRecommend, callback) {
    Course.findOneAndUpdate({ _id: cId }, { $set: { isRecommend: isRecommend } }, { new: true }, callback);
  },

  /** 读取课程数量 */
  count(query, callback) {
    const condition = buildSearchCondition(query);
    Course.count(condition, callback);
  },
  /** 读取课程列表 */
  list(query, callback) {
    const condition = buildSearchCondition(query);
    Course.find(condition, null, commonDal.buildPageAndOrderOptions(query, { sort: { _id: -1 } }), callback);
  },
  /**
   * 审核通过
   * @author: wac
   */
  audit(_id, callback) {
    Course.update({ _id }, { state: 1 }).exec(callback);
  },
  /**
   * 删除问题
   * @author: wac
   */
  delAnswer(_id, callback) {
    Question.remove({ _id }).exec((err, data) => {
      Answer.remove({ questionId: _id }, callback);
    });
  },

  /**
   * 违规下架
   * @author: wac
   */
  soldOut(soldOut, callback) {
    Course.findOneAndUpdate({ _id: soldOut._id }, { state: 2, soldOutReason: soldOut.soldOutReason }, { new: true }).exec(callback);
  },

  /** 读取课程的购买数 */
  async loadCoursePurchase(courseId) {
    return new Promise(function (resolve, reject) {
      Course.findOne({ _id: courseId }, { purchaseCount: 1 }, (err, data) => {
        if (err || !data)
          return resolve(0);
        return resolve(data.purchaseCount || 0);
      });
    });
  },

  /** 购买数量增加 */
  addPurchaseCount(courseId, count, callback) {
    Course.findOneAndUpdate({ _id: courseId }, { $inc: { purchaseCount: count } }, callback);
  },


  /**
   * addMyCourse 添加个人课程
   *
   * @param {any} user 用户信息
   * @param {any} courseId 课程id
   * @param {any} courseFrom 课程来源
   * @param {any} info 来源信息{buyInfo: ...}
   */
  addMyCourse(user, order, courseFrom, info, promoCode, callback) {
    Course.findOne({ _id: order.itemId }, 'name toc usePeriod clazzNumber', (err, course) => {
      let courseId = order.itemId;
      //订单为赠送则不添加
      if (order.licenseUsed == 0) {
        MyCourse.update({ courseId: courseId, userId: user.userId }, { $addToSet: { promoCode } }, callback);
        // callback(null, { "success": "courseExist" });
      } else {
        let clazzNumber = 0;
        course.toc.map((chapter) => {
          clazzNumber += chapter.clazz.length;
        });
        const speedStu = {
          courseId: course._id,
          courseName: course.name,
          courseCount: clazzNumber,
        };
        let startAt = new Date();
        let endAt = new Date();
        let month = startAt.getMonth() + course.usePeriod;
        endAt = new Date(endAt.setMonth(month));
        const query = { ...user, courseId, courseFrom, ...info, speedStu, startAt, endAt, promoCode: [promoCode] };
        const newMyCourse = new MyCourse(query);
        newMyCourse.save(callback);
      }
    });
  },
  /**
   * refreshCourse 更新课程状态
   *
   * @param {any} courseId 课程id
   * @param {any} cidx 章节序号
   * @param {any} index 课程序号
   */
  refreshCourse(courseId, time, size, cidx, index, videoPath, callback) {
    let value = {};
    value[`toc.${cidx}.clazz.${index}.transCoding`] = false;
    value[`toc.${cidx}.clazz.${index}.videoPath`] = videoPath;
    value[`toc.${cidx}.clazz.${index}.fileSize`] = size;
    value[`toc.${cidx}.clazz.${index}.time`] = time;
    Course.findOneAndUpdate({ _id: courseId }, { $set: value }, { new: true }, (err, newOne) => {
      let flag = true;

      newOne.toc.map(chapter => {
        chapter.clazz.map(clazz => {
          if (clazz.transCoding) {
            flag = false;
          }
        });
      });

      if (flag && (newOne.state == -1 || newOne.state == "-1")) {
        Course.update({ _id: courseId }, { $set: { state: 1 } }, callback);
      } else {
        callback(err, null);
      }
    });
    // Course.findOne({ _id: courseId }, (err, course) => {
    //   if (err || !course) {
    //     callback(err, { err: 'no course' });
    //     return;
    //   }
    //   let flag = true;
    //   course.toc[cidx].clazz[index].transCoding = false;
    //   course.toc[cidx].clazz[index].videoPath = videoPath;
    //   course.toc[cidx].clazz[index].fileSize = size;
    //   course.toc[cidx].clazz[index].time = time;
    //   course.toc.map(chapter => {
    //     chapter.clazz.map(clazz => {
    //       if (clazz.transCoding) {
    //         flag = false;
    //       }
    //     });
    //   });
    //   if (flag && (course.state == -1 || course.state == "-1")) {
    //     course.state = 1;
    //   }
    //   course.save(callback);
    // });
  },

  /**
   * 我的问答--根据筛选条件获取问答信息(分页)
   * callback:
   * - err, 数据库异常
   * - question, 问答对象
   * @param {INT} curPage 当前页码
   * @param {Object} sortBy 排序方式
   * @param {Object} filter 筛选信息
   * @param {Function} callback 回调函数
   * @author bs
   */
  getMyQA(filter, sortBy, curPage, limit, callback) {
    Question.find(filter)
      .lean()
      .sort(sortBy)
      .skip((Number(curPage) - 1) * Number(limit))
      .limit(Number(limit))
      .exec(callback);
  },

  /**
   * 我的问答--根据筛选条件获取问答信息(分页)
   * callback:
   * - err, 数据库异常
   * - question, 问答对象
   * @param {INT} curPage 当前页码
   * @param {Object} sortBy 排序方式
   * @param {Object} filter 筛选信息
   * @param {Function} callback 回调函数
   * @author bs
   */
  getMyQACount(filter, callback) {
    Question.count(filter).exec(callback);
  },

  /**
   * 我的偷看--根据筛选条件获取问答信息(分页)
   * callback:
   * - err, 数据库异常
   * - question, 偷看对象
   * @param {INT} curPage 当前页码
   * @param {Object} sortBy 排序方式
   * @param {Object} filter 筛选信息
   * @param {Function} callback 回调函数
   * @author bs
   */
  getMyPeek(filter, sortBy, curPage, limit, callback) {
    Peeker.find(filter)
      .lean()
      .sort(sortBy)
      .skip((Number(curPage) - 1) * Number(limit))
      .limit(Number(limit))
      .exec(callback);
  },
  /**
   * 根据回答id获取问题的id
   * @author:gs
   */
  findQuestionId(answerId, callback) {
    Answer.findOne({ _id: answerId }, callback);
  },

  /**
  * 我的偷看--根据筛选条件获取问答信息(总数)
  * callback:
  * - err, 数据库异常
  * - question, 偷看对象
  * @param {INT} curPage 当前页码
  * @param {Object} sortBy 排序方式
  * @param {Object} filter 筛选信息
  * @param {Function} callback 回调函数
  * @author bs
  */
  getMyPeekCount(filter, callback) {
    Peeker.count(filter).exec(callback);
  },

  /**
   * 购买专题推送我的课程
   * callback:
   * - err, 数据库异常
   * - result, 操作结果
   * @param {Object} order 订单信息
   * @param {Object} filter 筛选信息
   * @param {Function} callback 回调函数
   * @author bs
   */
  addCollectionsCourse(user, order, count, courseFrom, info, callback) {
    let ep = new eventproxy();
    //标记为赠送的订单时， 只改变课程购买数
    if (order.licenseUsed == 0) {
      order.data.chapter.map(chapter => {
        chapter.courses.map(course => {
          Course.findOneAndUpdate({ _id: course.id }, { $inc: { purchaseCount: count } });
        });
      });
      callback(null, { success: '已购买的专题,用于赠送' });
      return;
    }

    order.data.chapter.map(chapter => {
      chapter.courses.map(course => {
        Course.findOneAndUpdate({ _id: course.id }, { $inc: { purchaseCount: count } });
        Course.findOne({ _id: course.id }, 'name toc usePeriod clazzNumber', (err, course) => {
          //查找专题中的课程是否已购买
          MyCourse.findOne({ courseId: course.id, userId: user.userId }, { endAt: 1 }, { lean: true }, (err, myCourse) => {
            if (myCourse) {
              let endAt = new Date(myCourse.endAt);
              let month = endAt.getMonth() + course.usePeriod;
              endAt = new Date(endAt.setMonth(month));
              MyCourse.update({ _id: mongoose.Types.ObjectId(myCourse._id) }, { $set: { endAt: endAt } }, callback);
            } else {
              let clazzNumber = 0;
              course.toc.map((chapter) => {
                clazzNumber += chapter.clazz.length;
              });

              const speedStu = {
                courseId: course._id,
                courseName: course.name,
                courseCount: clazzNumber,
              };
              let courseId = course.id;
              let startAt = new Date();
              let endAt = new Date();
              let month = startAt.getMonth() + course.usePeriod;
              endAt = new Date(endAt.setMonth(month));
              const query = { ...user, courseId, courseFrom, ...info, speedStu, startAt, endAt };
              const newMyCourse = new MyCourse(query);
              newMyCourse.save(callback);
            }
          });
        });
      });
    });
  },

  addMyPeek(answerId, user, orderId, callback) {
    //将偷看者信息推入ANSWER表中
    Answer.findOne({ _id: answerId }, { _id: 1, peeker: 1 }, { lean: true }, (err, answer) => {
      if (answer.peeker.length < 5) {
        answer.peeker.push({
          id: user.userId,
          name: user.userName,
          avatar: user.userAvatar,
        });
        Answer.update({ _id: answerId }, { $set: { peeker: answer.peeker } }, (err, result) => {
        });
      }
    });
    //生成PEEKER表信息
    let newPeeker = new Peeker({
      answerId: answerId,
      userId: user.userId,
      orderId: orderId,
    })
    newPeeker.save(callback);
  },

  //根据课程id用户id获取我的课程信息
  getMyCourseByInfo(courseId, userId, callback) {
    MyCourse.findOne({ userId: userId, courseId: courseId }, callback);
  },

  //获取回答信息
  getMyAnswer(answerId, callback) {
    Answer.findOne({ _id: answerId }, callback);
  },

  //更新我的课程状态(进度、课程播放时间)
  updateStudySpeed(progress, courseId, userId, cidx, index, playTime, totalTime, callback) {
    MyCourse.findOne({ userId: userId, courseId: courseId }, (err, data) => {
      if (err || !data) {
        console.log("err", err);
        callback(err, null);
        return;
      }

      let flag = true;
      data.speedStu.lookedCourses.map(course => {
        if (course.cidx == cidx && course.index == index) {
          flag = false;
        }
      });

      // 记录播放时间
      let id = _.findIndex(data.progress, function (o) { return o.cidx == cidx && o.index == index; });
      if (id == -1) {
        data.progress.push({
          // 章节号
          cidx: cidx,
          // 课程号
          index: index,
          // 播放时间
          playTime: playTime,
          // 课时总时间
          totalTime: totalTime,
        });
      } else {
        data.progress[id].playTime = playTime;
      }

      // 记录当前学习进度
      if (flag && progress.toString() == "true") {
        console.log("----------------------保存学习进度------------------------", flag, progress);
        data.speedStu.lookedCount++;

        data.speedStu.lookedCourses.push({
          cidx: cidx,
          index: index
        });
        let newMyCourse = new MyCourse(data);
        newMyCourse.save(callback);
      } else {
        console.log("**********************只记录播放时间************************", data);
        let newMyCourse = new MyCourse(data);
        newMyCourse.save(callback);
      }

    });
  },
  /**
   * 收藏
   * @author: wac
   */
  enshrineCourse(userID, courseID, callback) {
    let enCourse = new Enshrine({
      userID,
      courseID,
    });
    enCourse.save(callback);
  },
  /**
   * 收藏
   * 根据用户ID和课程ID查询数量
   * @author: wac
   */
  isEnshrine(userID, courseID, callback) {
    Enshrine.count({ userID, courseID }).exec(callback);
  },
  /**
   * 取消收藏
   * @author: wac
   */
  delEnshrine(userID, courseID, callback) {
    Enshrine.remove({ userID, courseID }).exec(callback);
  },
  /**
   * 我的收藏
   * @author: wac
   */
  myEnshrine(userID, curPage, limit, callback) {
    Enshrine.find({ userID }, {}, { lean: true }).skip((curPage - 1) * limit).limit(limit).exec((err, shrine) => {
      if (shrine.length > 0) {
        let ep = new eventproxy();
        ep.after('shCourse', shrine.length, () => {
          callback(null, shrine);
        });
        shrine.map((val, idx) => {
          Course.findOne({ _id: val.courseID }).exec((error, courseInfo) => {
            val.course = courseInfo;
            ep.emit('shCourse');
          });
        });
      } else {
        callback(null, shrine);
      }
    });
  },
  /**
   * 我的收藏数量
   * @author: wac
   */
  enshrineCount(userID, callback) {
    Enshrine.count({ userID }).exec(callback);
  },
  /**
   * @param {any} courseId  课程_id
   * @param {any} promoCode 优惠码
   * @param {any} useCount  使用次数
   * @param {any} result    0=>不可使用 1=>可使用
   * @param {any} callback 
   */
  checkPromoCode(courseId, promoCode, useCount, callback) {
    Course.findOne({ _id: mongoose.Types.ObjectId(courseId) }, (err, data) => {
      let selectCode = _.find(data.promoCode, { code: promoCode });
      if (!selectCode) {
        return callback(err, { tooltip: `没有该优惠码`, result: 0 });
      } else if (selectCode.remainCount === 0) {
        return callback(err, { tooltip: `该优惠码已失效`, result: 0 });
      } else if (selectCode.remainCount < useCount) {
        return callback(err, { tooltip: `您的优惠码还有${selectCode.remainCount},请重新填写次数`, result: 0 });
      } else {
        return callback(err, { tooltip: ``, result: 1 });
      }
    });
  },
  /**
   * @param {any} courseId 课程_id 
   * @param {any} callback 
   */
  getCodesByCourseId(courseId, callback) {
    Course.findOne({ _id: mongoose.Types.ObjectId(courseId) }, (err, data) => {
      if (data.promoCode.length > 0) {
        callback(null, data.promoCode);
      } else {
        callback(null, []);
      }
    });
  },
  /**
   * @param {*} courseId 课程_id
   * @param {*} code 优惠码
   * @param {*} count 次数
   * @param {*} callback 
   */
  saveCodeByCourseId(courseId, code, count, callback) {
    EnumCode.findOne({ type: "优惠码" }, (err, data) => {
      if (data.code < count) {
        return callback(null, { result: "超出系统规定次数", tip: 0 });
      } else {
        let promo = {
          code,
          remainCount: count,
          totalCount: count,
          createAt: new Date().getTime(),
          lastUpdateAt: new Date().getTime(),
        };
        Course.update({ _id: mongoose.Types.ObjectId(courseId) }, { $push: { promoCode: promo } }, (err, c) => {
          if (c) {
            return callback(null, { result: "生成成功", tip: 1 });
          }
        });
      }
    });
  },
  /**
   * 查询系统设置的优惠码个数
   */
  findNumber(callback) {
    EnumCode.findOne({ type: "优惠码" }, (err, data) => {
      if (data) {
        return callback(null, { count: data.code });
      } else {
        return callback(null, { count: 10 });
      }
    });
  },
  /**
   * @param {String} courseId 课程_id
   * @param {String} promocode 优惠码
   * @param {Number} count 已经使用次数的次数
   * @param {function} callback 
   */
  updatePromo(courseId, promoCode, count, callback) {
    Course.findOne({ _id: courseId, 'promoCode.code': promoCode }, (err, data) => {
      if (data.promoCode) {
        let promo = _.find(data.promoCode, { code: promoCode });
        promo.remainCount -= Number(count);
        promo.lastUpdateAt = new Date().getTime();
      }
      const c = new Course(data);
      c.save(callback);
    })
  },
  /**
   * 查询当前课时下是否有题库 
   * @param {string} id 课时对应的题库id
   * @param {function} callback 
   */
  showExamByClazz(_id, callback) {
    ExamTpl.findOne({ _id }, callback);
  },
  /**
   * 保存试题
   * @param {string} exam 试题
   * @param {function} callback 
   */
  saveExamByClazz(examTpl, callback) {
    examTpl.updateAt = new Date().getTime();
    ExamTpl.findOne({ _id: mongoose.Types.ObjectId(examTpl._id) }, (err, data) => {
      if (err) {
        return callback(null, { result: 'fail' })
      }
      if (!data) {
        examTpl.createAt = examTpl.updateAt;
      }
      ExamTpl.findOneAndUpdate({ _id: mongoose.Types.ObjectId(examTpl._id) }, examTpl, { upsert: true, new: true }, (err, exam) => {
        callback(null, exam);
      });
    });
  },
  /**
   * 保存学生试卷
   * @param {String} studentExam 学员试卷及成绩
   * @param {Function} callback 
   */
  saveStudentExam(studentExam, callback) {
    studentExam.createAt = Date.now();
    let se = new StudentExam(studentExam);
    se.save(callback);
  },
  /**
   * @param {String} courseId 课程id
   * @param {String} userId 学员id
   * @param {String} examTplId 学员试卷id
   * @param {Function} callback 
   * 
   */
  queryPreScore(courseId, studentId, examTplId, callback) {
    StudentExam.find({ courseId, studentId, examTplId }, { _id: 0 }, callback);
  },

  /**
   * 查询学生成绩详情
   * @param {String} data 我的课程数据
   * @param {Function} callback 
   */
  queryStudyRecord(data, callback) {
    let newArr = [];
    const ep = new eventproxy();
    Course.findOne({ _id: data.courseId }, (courseErr, course) => {
      let tocIdx = data.progress && data.progress.length > 0 && data.progress.map(progress => progress.cidx);
      let clazzIdx = data.progress && data.progress.length > 0 && data.progress.map(progress => progress.index);
      tocIdx && tocIdx.length > 0 && tocIdx.map((tval, index) => {
        let obj = {};
        obj.tempId = index;
        obj.chapterIdx = convertToChinese(tocIdx[index]);
        obj.clazzName = course.toc[tocIdx[index]].clazz[clazzIdx[index]].title;
        obj.time = course.toc[tocIdx[index]].clazz[clazzIdx[index]].time;
        obj.examTplId = course.toc[tocIdx[index]].clazz[clazzIdx[index]].examTplId || '';
        obj.isHasExam = course.toc[tocIdx[index]].clazz[clazzIdx[index]].isHasExam;
        newArr.push(obj);
      });
      ep.after('newClazz', newArr.length, res => {
        res = _.orderBy(res, ['tempId'], ['asc']);
        callback(null, res);
      })
      newArr.map(clazz => {
        if(clazz.examTplId === "" || clazz.isHasExam == false){
          clazz.isFinish = true;
          ep.emit('newClazz', clazz);
        }else{
          StudentExam.find({ studentId: data.userId, examTplId: clazz.examTplId }, (err, studentData) => {
            _.orderBy(studentData, ['createAt'], ['asc']);       
            if(studentData.length == 0){
              clazz.isFinish = false;
              ep.emit('newClazz', clazz);
            }else{
              clazz.isFinish = true;
              clazz.beginScore = studentData.length == 0 ? false : studentData[0].score;
              clazz.lastScore = studentData.length == 0 ? false : studentData[studentData.length - 1].score;
              ep.emit('newClazz', clazz);
            }
          })
        }
      })
    })
  },
  /**
   * 查询其他学员的学习情况
   * @param {String} orderData 课程订单数据
   * @param {Function} callback 
   */
  queryOtherStudyRecord(orderData, callback) {
    let arr = [];
    let studyCount = 0;
    let hasPass = 0;
    const ep = new eventproxy();
    ep.after('newExam', orderData.licenseRecord.length, res => {
      Course.findOne({ _id: orderData.itemId }, (err, course) => {
        let ClazzCount = 0;
        let hasExamCount = 0;
        let totalTime = 0;
        course.toc.map(tocItem => {
          tocItem.clazz.map(clazzItem => {
            ClazzCount += 1;
            totalTime += clazzItem.time;
            if (clazzItem.examTplId) {
              hasExamCount += 1;
            }
          });
        });
        callback(null, { data: res, ClazzCount, hasExamCount, totalTime, studyCount, hasPass });
      });
    })
    orderData.licenseRecord.map(orderPerson => {
      MyCourse.findOne({ userId: orderPerson._id, courseId: orderData.itemId }, (myCourseErr, myCourseData) => {
        _.isEqual(myCourseData.speedStu.courseCount, myCourseData.speedStu.lookedCourses.length) ? studyCount += 1 : null;
        let obj = {};
        obj.userId = orderPerson._id;
        obj.name = orderPerson.name;
        obj.email = orderPerson.email;
        obj.nickName = myCourseData.nickName;
        obj.courseId = myCourseData.courseId;
        obj.progress = myCourseData.progress;
        obj.courseName = orderData.itemName;
        obj.totalCount = myCourseData.speedStu.courseCount;
        obj.lookedCount = myCourseData.speedStu.lookedCourses.length;
        StudentExam.find({ courseId: orderData.itemId, studentId: orderPerson._id }, (studentErr, studentData) => {
          if (studentData.length === 0) {
            obj.resatCount = 0;
            obj.passCount = 0;
          } else {
            obj.resatCount = _.uniq(_.filter(studentData, (s) => s.score && s.score < 60).map(sd => sd.examTplId)).length;
            obj.passCount = _.filter(studentData, (s) => s.score && s.score > 60).length;
            _.every(studentData, (sc) => sc.score > 60) ? hasPass += 1 : null;
          }
          ep.emit('newExam', obj);
        });
      });
    });
  },
  /** 重新读取课程
   * /usr/local/nginx/html
   * http://116.228.66.190:8002/videoTranscode?files=[{"title":"2015.6.4（上）_转.avi","file":{"path":"upload/video/upload_421080d58156c2fada15546cf5bddda3.avi","name":"2015.6.4（上）_转.avi"},"cidx":0,"index":0,"fileName":"upload_421080d58156c2fada15546cf5bddda3.avi","courseId":"58f03ee6046c6f869fba9fba"}]
   */
  reloadTrasVideo() {
    Course.find({ 'toc.clazz.transCoding': true }, (err, courses) => {
      courses.map(course => {
        let files = [];
        course.toc.map((t, index) => {
          t.clazz.map((c, cidx) => {
            files.push({
              title: c.name,
              file: {
                path: c.rawPath,
                name: c.name
              },
              cidx: index,
              index: cidx,
              fileName: c.rawPath.split('/')[c.rawPath.split('/').length - 1],
              courseId: course._id
            });
          });
        })
        request.get(`${config.videoUrl}/videoTranscode?files=${JSON.stringify(files)}`, (err, res, body) => {
          console.log('OK');
        });
      });
    });
  }

}