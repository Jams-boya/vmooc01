import {Orders} from '../models';
import {MyCourse} from '../models';
import {Course} from '../models';
import {courseCollection} from '../models';
import {Messages} from '../models';
import autoincrement from './autoincrement';
import moment from 'moment';
import eventproxy from 'eventproxy';
import _ from 'lodash';
import commonDal from './commonDal';
import mongoose from 'mongoose';
import courseDal from './courseDal';
import userapp from '../user/userapp';


/** 生成订单号 */
async function buildSn(module) {
  return new Promise(function (resolve, reject){
    // 对照表
    const lut = {
      course: 12,
      collection: 13,
      qa: 11
    };
    // 时间
    const time = moment().format("YYMMDD");
    autoincrement.buildautoincrement('order', (err, increment) => {
      if (err || !increment)
        return reject(err);
      let orderSn = `${lut[module]}${time}${increment.incrementcount}`;
      return resolve(orderSn);
    });
  });
}

//赠送课程--生成我的课程信息
function genCourseInfo(guser, order, course) {
  return new Promise(function (resolve, reject){
    let classCount = 0;
    if (course.toc)
      course.toc.map(chapter => {
        chapter.clazz.map(c => {
          classCount++;
        });
      });

      let startAt = new Date();
      let endAt = new Date();
      let month = startAt.getMonth() + course.usePeriod;
      endAt = new Date(endAt.setMonth(month));

      let newcourse = {
        userId  : order.payerId,
        userName: order.payerName,
        courseId: course._id,
        courseFrom : 1,
        receiveInfo: {
          giveId: guser._id,
          giveName: guser.name,
          giveTime: order.createAt,
        },
        startAt: startAt,
        endAt  : endAt,
        progress: [],
        speedStu: {
          courseId: order.itemId,
          courseName: order.itemName,
          courseCount: classCount,
          lookedCount: 0,
        }
      }
      userapp.getPersonInfo(order.payerId, (err, data) => {
        if (data) {
          newcourse.nickName = data.nickName;
          newcourse.userAvatar = data.Avatar;
        }
        return resolve(newcourse);;
      });
  });
  
    
}

//赠送课程--生成推送信息
function genMessage(order, data, person, guser) {
  let content;
  if (order.type == 'course')
    content = '用户: ' + guser.name + ' 为您赠送了课程: ' + data.name;
  else if (order.type == 'collection')
    content = '用户: ' + guser.name + ' 为您赠送了专题课程 ' + data.name;
  let message = {
    type: 'course',
    content: content,
    userId: person._id,
    url: '/myCourses?isFrom=1',
    state: 0,
    createAt: new Date()
  }

  return message;
}

export default {

  /** 生成购买课程订单 */
  async createCourseOrder(query, callback) {
    console.log('query......', query);
    // const orderSn = await buildSn(query.type);
    // console.log("sn= ", orderSn);
    // query["sn"] = orderSn;
    Orders.find({itemId: query.itemId, payerId: query.payerId, state: 1}, (err, data) => {
      if (data.length > 0)
        query.licenseUsed = 0;
      const neworder = new Orders(query);
      neworder.save(callback);
    });
    
  },

  /** 生成赠送课程订单 */
  createGiveCourseOrder(guser, cOrder, orders, persons, callback) {
    let ep = new eventproxy();
    ep.after('finish', orders.length, () => {
      //更新赠送者订单剩余可赠送次数
      Orders.findOne({_id: mongoose.Types.ObjectId(cOrder._id)}, (err, data) => {
        data.licenseUsed += orders.length;
        persons.map((person) => {
          data.licenseRecord.push(person);
        });
        let neworder = new Orders(data);
        neworder.save(callback);
      });
    });
    //生成订单信息
    orders.map((order, idx) => {
        //课程订单--生成我的课程信息
        if (order.type == 'course') {
          ep.all('getCourse', (course) => {
            MyCourse.findOne({courseId: course._id, userId: persons[idx]._id},async (err, myCourse) => {
              if (myCourse) {
                let endAt = new Date(myCourse.endAt);
                let month = endAt.getMonth() + course.usePeriod;
                endAt = new Date(endAt.setMonth(month));
                MyCourse.update({_id: mongoose.Types.ObjectId(myCourse._id)}, {$set: {endAt: endAt}}, (err, data) => {
                  if (err)
                    console.log("err=", err);
                  //将信息推送给接受者
                  let message = genMessage(order, course, persons[idx], guser);
                  let newMessage = new Messages(message);
                  newMessage.save();
                  ep.emit('finish');
                });
              } else {
                let newcourse = await genCourseInfo(guser, order, course);
                const newMyCourse = new MyCourse(newcourse);
                //将信息推送给接受者
                let message = genMessage(order, course, persons[idx], guser);
                let newMessage = new Messages(message);
                newMessage.save();
                newMyCourse.save(ep.emit('finish'));
              }
            });
          });
          courseDal.getCourseById(order.itemId, (err, course) => {
            ep.emit('getCourse', course);
          });
        //专题订单--将专题下所有课程添加至我的课程
        } else if (order.type == 'collection') {
          //获取订单对应专题信息
          courseCollection.findOne({_id: order.itemId}, (err, collection) => {
            //该专题下课程推送完毕
            ep.after('chapterCourse', collection.chapter.length, () => {
              //将信息推送给接受者
              let message = genMessage(order, collection, persons[idx], guser);
              let newMessage = new Messages(message);
              newMessage.save();
              ep.emit('finish');
            });
            //遍历专题下所有课程
            collection.chapter.map(chapter => {
              ep.after('newCourse', chapter.courses.length, () => {
                ep.emit('chapterCourse');
              });
              chapter.courses.map(course => {
                Course.findOneAndUpdate({ _id: course.id }, { $inc: { purchaseCount: 1 } });
                Course.findOne({ _id: course.id }, 'name toc usePeriod clazzNumber', (err, courseInfo) => {
                  MyCourse.findOne({courseId: course.id, userId: persons[idx]._id},async (err, myCourse) => {
                    if (myCourse) {
                      let endAt = new Date(myCourse.endAt);
                      let month = endAt.getMonth() + courseInfo.usePeriod;
                      endAt = new Date(endAt.setMonth(month));

                      MyCourse.update({_id: mongoose.Types.ObjectId(myCourse._id)}, {$set: {endAt: endAt}}, (err, data) => {
                        if (err)
                          console.log("err=", err);
                        ep.emit('newCourse');
                      });
                    } else {
                      let mycourse = await genCourseInfo(guser, order, courseInfo);
                      const newMyCourse = new MyCourse(mycourse);
                      newMyCourse.save(ep.emit('newCourse'));
                    }
                  });
                  
                });
              });
            });
          });
        }
        
    });
  },

  /**
   * 学生端-订单管理 根据用户id获取订单信息总数
   * callback:
   * - err, 数据库异常
   * - orders, 订单对象
   * @param {String} userId 用户id
   * @param {Function} callback 回调函数
   * @author bs
   */
	getMyOrdersCount(filter, callback) {
		Orders.count(filter, callback);
	},

	/**
   * 学生端--订单管理 根据用户id获取订单信息（分页）
   * callback:
   * - err, 数据库异常
   * - orders, 订单对象
   * @param {String} userId 用户id
   * @param {Function} callback 回调函数
   * @author bs
   */
	getMyOrders(filter, page, limit, callback) {
    let ep = new eventproxy();
		let curPage = Number(page);
		let pageSize = Number(limit);
		Orders.find(filter)
		.lean()
    .sort({createAt: -1})
		.skip((curPage - 1) * pageSize)
		.limit(pageSize)
		.exec((err, orders) => {
        ep.after('addPeriod', orders.length, () => {
          callback(err, orders);
        });
        orders.map(order => {
          if (order.type == 'course') {
            Course.findOne({_id: order.itemId}, (err, course) => {
              if (course) {
                order.usePeriod = course.usePeriod + '月';
                order.cover = course.cover;
              } else {
                order.usePeriod = 12 + '月';
              }
              ep.emit("addPeriod");
            });
          } else if (order.type == 'collection') {
            courseCollection.findOne({_id: mongoose.Types.ObjectId(order.itemId)}, (err, collection) => {
              order.cover = collection.cover;
              order.itemName += "(专题)";
              order.usePeriod = 12 + '月';
              ep.emit("addPeriod");
            });
          }
        });
    });
	},

   /**
   * 讲师端-订单管理 根据用户id获取订单信息总数
   * callback:
   * - err, 数据库异常
   * - orders, 订单对象
   * @param {String} userId 用户id
   * @param {Function} callback 回调函数
   * @author bs
   */
  getExpertOrdersCount(filter, callback) {
    Orders.count(filter, callback);
  },

  /**
   * 讲师端--订单管理 根据用户id获取订单信息（分页）
   * callback:
   * - err, 数据库异常
   * - orders, 订单对象
   * @param {String} userId 用户id
   * @param {Function} callback 回调函数
   * @author bs
   */
  getExpertOrders(filter, page, limit, callback) {
    let ep = new eventproxy();
    let curPage = Number(page);
    let pageSize = Number(limit);
    Orders.find(filter)
    .sort({createAt: -1})
    .lean()
    .skip((curPage - 1) * pageSize)
    .limit(pageSize)
    .exec((err, orders) => {
      ep.after('addPeriod', orders.length, () => {
        callback(err, orders);
      });
      orders.map(order => {
        if (order.type == 'course') {
          Course.findOne({_id: order.itemId}, (err, course) => {
            if (course) {
              order.usePeriod = course.usePeriod + '月';
              order.cover = course.cover;
            } else {
              order.usePeriod = 12 + '月';
            }
            ep.emit("addPeriod");
          });
        } else if (order.type == 'collection') {
          courseCollection.findOne({_id: mongoose.Types.ObjectId(order.itemId)}, (err, collection) => {
            order.cover = collection.cover;
            order.itemName += "(专题)";
            ep.emit("addPeriod");
          });
        } else {
          ep.emit("addPeriod");
        }
        
      });
    });
  },

	/**
   * 学生端--订单管理 根据订单id取消订单
   * callback:
   * - err, 数据库异常
   * - orders, 订单对象
   * @param {String} orderId 订单id
   * @param {Function} callback 回调函数
   * @author bs
   */
	cancelOrderById(orderId, callback) {
		Orders.update({_id: mongoose.Types.ObjectId(orderId)}, {$set: {state: 2} }, callback);
	},

  /**
   * 后台--订单管理 获取订单统计数据
   * callback:
   * - err, 数据库异常
   * - orders, 订单对象
   * @param {Object} filter 筛选项
   * @param {Function} callback 回调函数
   * @author bs
   */
  cmsOrderStatics(domain, type, callback) {
    let statics = {
      total: 0,
      amount : 0,
      monthTotal: 0,
      monthAmount : 0,
      weekTotal : 0,
      weekAmount  : 0,
    };
    let today = new Date().getTime();
    let perWeek = 86400000 * 7;
    let perMonth = 86400000 * 30;

    Orders.find({domain, type: type, state: 1}, {itemAmount: 1, createAt: 1}, (err, orders) => {
      let weekStatics = _.filter(orders, (order) => { return order.createAt > today - perWeek; });
      let monthStatics = _.filter(orders, (order) => { return order.createAt > today - perMonth; });
      //按周统计
      weekStatics.map(order => {
        statics.weekAmount += Number(order.itemAmount);
      });
      //按月统计
      monthStatics.map(order => {
        statics.monthAmount += Number(order.itemAmount);
      });
      //总计
      orders.map(order => {
        statics.amount += Number(order.itemAmount);
      });

      statics.total = orders.length;
      statics.weekTotal = weekStatics.length;
      statics.monthTotal = monthStatics.length;
      
      callback(null, statics);
    });
  },

  /** 标注订单完成 */
  commitOrderSuccess(orderId, callback) {
    const closeTime = new Date().getTime();
    const closeType = 'success';
    Orders.update({_id: orderId}, {$set: {state: 1, closeTime, closeType}}, (err, result) => {
      console.log(err);
      callback(err, result);
    });
  },

  /** 根据sn查找订单 */
  loadOrderInfo(sn, callback) { 
    Orders.findOne({sn: sn}, callback);
  },

  /** 根据id查找订单 */
  getOrderById(orderId, callback) { 
    Orders.findOne({_id: orderId}, callback);
  },

  /** 根据id删除订单 */
  delOrderById(orderId, callback) { 
    Orders.remove({_id: orderId}, callback);
  },
  /** 根据id获取偷看订单 */
  getMyPeekOrder(orderId, callback) {
    Orders.findOne({_id: orderId}, callback);
  },
  // 根据登录者查看偷看我的(讲师)
  getPeekMe(guserId, sortBy, curPage, limit, callback) {
    Orders.find({ receiverId: guserId, type: "peek" })
      .lean()
      .sort(sortBy)
      .skip((Number(curPage) - 1) * Number(limit))
      .limit(Number(limit))
      .exec(callback);
    },
} 