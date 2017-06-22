/** 订单 */
import orderDal from '../dal/orderDal';
import config from '../config.js';
// import {autoIncrement} from '../models';
import pingpp from '../transaction/transaction';
import AccountDal from '../dal/accountDal';
import userapp from '../user/userapp';
import { myRender } from './common';
import eventproxy from 'eventproxy';
import validator from 'validator';
import laundrylist from './laundryList';
import commitLaundry from '../middlewares/commitLaundry';
import autoincrement from '../dal/autoincrement';
import expertQaDal from '../dal/expertQaDal';
import courseDal from '../dal/courseDal';
import moment from 'moment';
import { courseCollection } from '../models';
import { Orders } from '../models';
import { Course } from '../models';
import { Messages } from '../models';
import { Question } from '../models';
import { Answer } from '../models';
import mongoose from 'mongoose';
import LaundryDal from '../dal/laundryListDal';
import socketServer from '../socket';
import socketEvent from '../socketEvent';


/** 系统对讲师发送消息 */
function sendMessageToExpert(expertId, order) {
  let title = (order.type === 'course') ? '课程订单' : '';
  if (order) {

  }
}

//退款测试
function payBack() {
  let now = new Date().getTime();
  console.log("***************************————检测过期问答退款  " + new Date() + "————**************************");
  Question.find({ state: 1 }, (err, questions) => {
    questions.map(question => {
      Orders.findOne({ _id: mongoose.Types.ObjectId(question.ordersId) }, (err, order) => {
        let user = {
          userId: order.payerId,
          userName: order.payerName,
        }
        let time = (now - order.createAt) / (1000 * 60);
        //测试数据 五分钟
        let payBackTime = config.payBackTime ? config.payBackTime : 5;
        if (time > payBackTime) {
          if (order.payMethod == 1) {
            pingpp.createRefund(
              order.chargeId,
              order.itemAmount,
              '课程退款',
              (err, refund) => {
                console.log('-----', refund);
              }
            );
          } else if (order.payMethod == 0) {
            const ep = new eventproxy();

            ep.all('oldlaundry', (oldlaundry) => {
              //退款流水
              laundrylist.createPayBackLaundry(order, (err, laundry) => {
                if (err || !laundry || !laundry._id) {
                  console.log("error: '退款失败'");
                }
                /** 提交流水 */
                commitLaundry.committedQALaundry(oldlaundry, laundry, 2, (err, result) => {
                  //标记订单状态为交易关闭（已退款）
                  order.state = 2;
                  order.closeTime = new Date().getTime();
                  order.closeType = "payBackSuccess";
                  let newOrder = new Orders(order);
                  newOrder.save();
                  //标记问题为退款状态
                  Question.update({ _id: mongoose.Types.ObjectId(order.itemId) }, { $set: { state: 3 } }, (err, data) => {
                    console.log("标记为题为退款状态", err, data);
                  });
                  //推送系统消息
                  let message = {
                    type: 'qa',
                    content: '您的提问: ' + order.itemName + ' 48小时未被讲师回答，已退款',
                    userId: order.payerId,
                    url: '/myaccount',
                    state: 0,
                    createAt: new Date(),
                  }
                  let newMessage = new Messages(message);
                  newMessage.save();

                  /** socket消息推送 */
                  socketEvent.sendSystemMessage(order.payerId, '提问退款通知', `您的提问" ${order.itemName} " 48小时未被讲师回答，已退款`, '/myQAEntry');

                });
              });
            });

            /** 读取付款流水信息 */
            LaundryDal.getLaundryIdByOrderSn(order.sn, (err, oldlaundry) => {
              ep.emit('oldlaundry', oldlaundry);
            });

          }
        }
      });
    });
  });
}

//定时10分钟
let oneMin = 60000;
//定时1小时
let oneHour = 3600000;
payBack();
let payBackProcess = setInterval(payBack, oneMin, "Interval");


/** 提交订单之后的操作 */
function onCommittedSuccess(user, res, order, laundry, promoCode, actualMoney) {
  const ep = new eventproxy();
  user = {
    userId: user._id,
    userName: user.name,
    userAvatar: user.Avatar,
    nickName: user.nickName
  };
  const info = {
    buyInfo: {
      orderId: order._id,
      orderSn: order.sn,
      buyCount: order.itemLicense,
      usedCount: 0,
      buyAt: new Date().getTime(),
    }
  };

  ep.all('orderProcess', 'countProcess', 'committed', (amc, apc, c) => {
    if (order.type === "course") {
      courseDal.updatePromo(order.itemId, order.promoCode.code, order.promoCode.count, (err, data) => {
        console.log('修改优惠码使用次数')
      })
    }
    /** 对讲师发送消息 */
    // socketEvent.sendSystemMessage(order.receiverId, '你有新的消息', order.type, order.itemId);
    /** 对购买人员进行消息推送 */
    if (order.payMethod == 1)
      socketEvent.sendSuccessPaidMessage(order.payerId, c);
    return res.json(c);
  });

  /**** 购买的为课程 ***/
  if (order.type == 'course') {
    /** 新增我的课程 */
    courseDal.addMyCourse(user, order, 0, info, promoCode, (err, result) => {
      ep.emit('orderProcess', null);
    });

    /** 课程购买数增加 */
    courseDal.addPurchaseCount(order.itemId, order.itemLicense, (err, result) => {
      ep.emit('countProcess', null);
    });

    /***** 购买的为问答 ***/
  } else if (order.type == 'qa') {
    //更新我的问答状态
    expertQaDal.payQusetionOrder(order, (err, data) => {
      if (err) {
        ep.emit('orderProcess', null);
      } else {
        ep.emit('orderProcess', null);
      }
    });

    ep.emit('countProcess', null);
    /**** 购买的为专题 ***/
  } else if (order.type == 'collection') {
    courseDal.addCollectionsCourse(user, order, order.itemLicense, 0, info, (err, result) => {
      ep.emit('orderProcess', null);
    });
    ep.emit('countProcess', null);

    /*** 订单为偷看 ***/
  } else if (order.type == 'peek') {
    courseDal.addMyPeek(order.data._id, user, order._id, (err, data) => {
      ep.emit('orderProcess', null);
    });
    ep.emit('countProcess', null);
  }

  /** 标记订单完成 */
  orderDal.commitOrderSuccess(laundry.orderId, (err, result) => {
    let note = {};

    if (err || !result)
      note = { error: '如未及时到账，请再几分钟后查看，如仍存在问题，请联系管理员进行处理' };

    note = order.type == 'course' ? { success: 'CourseSuccess' } :
      order.type == 'qa' ? { success: 'QASuccess' } :
        order.type == 'peek' ? { success: 'PeekSuccess' } :
          order.type == 'collection' ? { success: 'CollectionSuccess' } :
            { success: 'success' };
    ep.emit('committed', note);
  });
}

/** 生成支付信息 */
async function createCharge(order, course, client_ip) {
  return new Promise(function (resolve, reject) {
    const info = {
      subject: `${'lcpsp'}-${order.sn}`,
      body: `购买课程${course.name}`,
      metadata: {},
      description: ``
    };
    pingpp.createPingppPay(order.sn, order.itemAmount, client_ip, info, (err, charge) => {
      if (!charge)
        return resolve(null);
      return resolve({ chargeId: charge.id, QrUrl: charge.credential.alipay_qr });
    });
  });
}

/** 生成订单号 */
async function buildSn(module) {
  return new Promise(function (resolve, reject) {
    // 对照表
    const lut = {
      course: 12,
      collection: 13,
      qa: 11,
      peek: 14
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

/**生成问题 */
async function genQuestion(question) {
  return new Promise(function (resolve, reject) {
    expertQaDal.addQusetion(question, (err, data) => {
      if (err || !data)
        return reject(err);
      return resolve(data);
    });
  });
}

//查找课程对应讲师
async function getTeacher(course) {
  return new Promise(function (resolve, reject) {
    Course.findOne({ _id: mongoose.Types.ObjectId(course.id) }, (err, course) => {
      if (err || !course)
        return reject(err);
      return resolve(course);
    });
  });
}
export default {
  /** 生成课程订单 */
  async createCourseOrder(req, res, next) {
    try {
      const ep = new eventproxy();
      let order = {};
      const data = req.body.data;
      const userId = req.session.user._id;
      let client_ip = req.ip;
      client_ip = '127.0.0.1';
      order['payerId'] = req.session.user._id;
      order['payerName'] = req.session.user.name;
      order['itemLicense'] = req.body.amount;
      order['payMethod'] = req.body.payMethod;
      order['itemAmount'] = req.body.totalPrice;
      order['type'] = req.body.orderType;
      order['domain'] = req.session.domain;
      // 课程订单字段
      if (req.body.orderType == "course") {
        order['receiverId'] = data.teacherId;
        order['receiverName'] = data.teacherName;
        order['createAt'] = new Date().getTime();
        order['itemId'] = data._id;
        order['itemName'] = data.name;
        order['itemPrice'] = data.price;
        order['promoCode'] = {
          code: req.body.promoCode ? req.body.promoCode : '',
          count: req.body.amount ? req.body.amount : '',
        };
        order['actualMoney'] = req.body.actualMoney;
        order['info'] = {
          direction: data.direction,
          classify: data.classify
        }
        // 问答订单字段
      } else if (req.body.orderType == "qa") {
        const question = await genQuestion(data);
        order['receiverId'] = data.requiredAnswerId;
        order['receiverName'] = data.requiredAnswerName;
        order['createAt'] = new Date().getTime();
        order['itemId'] = question._id;
        order['itemName'] = question.title;
        order['itemPrice'] = question.money;
        order['itemLicense'] = 1;
        order['itemAmount'] = data.money;
        // 偷看订单
      } else if (req.body.orderType == 'peek') {
        order['receiverId'] = data.answererId;
        order['receiverName'] = data.answererName;
        order['createAt'] = new Date().getTime();
        order['itemId'] = data._id;
        order['itemName'] = data.name;
        order['itemPrice'] = data.price;
      } else if (req.body.orderType == 'collection') {
        order['createAt'] = new Date().getTime();
        order['itemId'] = data._id;
        order['itemName'] = data.name;
        order['itemPrice'] = data.price;
        order['collectionReceivers'] = [];
        data.chapter.map(chapter => {
          chapter.courses.map(async course => {
            let courseInfo = await getTeacher(course);
            order['collectionReceivers'].push({ receiverId: courseInfo.teacherId });
          });
        });
      }
      order['sn'] = await buildSn(order['type']);
      /** 扫码支付 */
      if (order.payMethod == 1) {
        const charge = await createCharge(order, data, client_ip);
        order['chargeId'] = charge.chargeId;
        order['QrUrl'] = charge.QrUrl;
      }

      // 生成课程订单
      orderDal.createCourseOrder(order, (err, order) => {
        res.setHeader('Cache-Control', 'no-cache');
        if (order) {
          if (order.type == 'qa') {
            /** 问题关联订单号 **/
            expertQaDal.addQusetionOrder(order.itemId, order._id, order.sn, (err, data) => {
              if (err) {
                console.log("---err---", err);
              }
            });
          } else if (order.type == "collecton" || order.type == "peek") {
            order.data = data;
          }
          if (order.payMethod == 1) {
            return res.json({ chargeQrUrl: order.QrUrl, orderId: order._id });
          }

          /** 平台账户支付 */
          if (order.payMethod == 0) {
            AccountDal.queryAccountBalance(userId, false, (err, account) => {
              if (!account)
                return res.json({ error: '账户余额不足，请先充值或更换支付方式!' });
              if (account && account.state === 1)
                return res.json({ error: '账户存在异常，请先联系管理员！' });
              if (account && account.state === 2)
                return res.json({ error: '该账户已被锁定，请先解锁' });

              /** 账户余额不足 */
              if (account.balance < order.itemAmount)
                return res.json({ error: '账户余额不足，请先充值或更换支付方式' });

              /** 为问答订单 **/
              if (order.type === 'qa') {
                let changes = [
                  {
                    orderSn: order.sn,
                    type: order.payMethod == 0 ? 'platform' : 'alipay',
                    userId: order.payerId,
                    amt: -order.itemAmount
                  }
                ];

                /** 支付宝支付时平台账户资金池变动 */
                // if (order.payMethod == 1) {
                //   changes.push({
                //     orderSn: order.sn,
                //     type: order.payMethod == 0? 'platform': 'alipay',
                //     userId: order.payerId,
                //     cashPooling: order.itemAmount
                //   });
                // }
                laundrylist.createLaundry(order, changes, (err, laundry) => {
                  if (err || !laundry || !laundry._id) {
                    return res.json({ error: '付款失败，请重新尝试!' });
                  }

                  /** 提交流水 */
                  commitLaundry.committedQALaundry('', laundry, 1, (err, result) => {
                    /** 修改问题的支付状态 **/
                    orderDal.commitOrderSuccess(laundry.orderId, (err, or_result) => {
                      expertQaDal.payQusetionOrder(order, (err, data) => {
                        //消息中心消息推送
                        //推送系统消息
                        let message = {
                          type: 'qa',
                          content: `${order.payerName} 请您回答"${order.itemName}"`,
                          userId: order.receiverId,
                          url: '/answerManage?state=1',
                          state: 0,
                          createAt: new Date(),
                        }
                        let newMessage = new Messages(message);
                        newMessage.save();
                        /** socket消息推送 */
                        socketEvent.sendSystemMessage(order.receiverId, '您有一条新的提问', `${order.payerName} 请您回答"${order.itemName}"`, '/answerManage?state=1');
                        res.json({ success: 'QASuccess' });
                      });
                    });
                  });
                });

              } else {
                /** 生成账户流水 */
                laundrylist.createCourseLaundry(order, false, (err, laundry) => {
                  if (err || !laundry || !laundry._id) {
                    return res.json({ error: '付款失败，请重新尝试!' });
                  }

                  /** 提交流水 */
                  commitLaundry.commitCourseLaundry(laundry, (err, result) => {
                    onCommittedSuccess(req.session.user, res, order, laundry, req.body.promoCode, req.body.actualMoney);
                  });
                });
              }

            });
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  },

  //未完成支付的订单再支付
  unPaidOrderPay(req, res, next) {
    let order = req.body.order;
    let payMethod = req.body.payMethod;
    let promoCode = req.body.promoCode;
    let actualMoney = req.body.actualMoney;
    if (order.state == 1) {
      return res.json({ success: 'QASuccess' });
    }

    order.payMethod = payMethod;
    order.domain = req.session.domain;
    order.promoCode = promoCode;
    order.actualMoney = actualMoney;
    let newOrder = new Orders(order);
    newOrder.save();

    if (payMethod == 1) {
      return res.json({ chargeQrUrl: order.QrUrl, orderId: order._id });
    }
    /** 平台账户支付 */
    if (payMethod == 0) {
      AccountDal.queryAccountBalance(order.payerId, false, (err, account) => {
        if (!account)
          return res.json({ error: '账户余额不足，请先充值或更换支付方式!' });
        if (account && account.state === 1)
          return res.json({ error: '账户存在异常，请先联系管理员！' });
        if (account && account.state === 2)
          return res.json({ error: '该账户已被锁定，请先解锁' });
        /** 账户余额不足 */
        if (account.balance < order.itemAmount)
          return res.json({ error: '账户余额不足，请先充值或更换支付方式' });

        /** 为问答订单 **/
        if (order.type === 'qa') {
          let changes = [
            {
              orderSn: order.sn,
              type: order.payMethod == 0 ? 'platform' : 'alipay',
              userId: order.payerId,
              amt: -order.itemAmount
            }
          ];

          laundrylist.createLaundry(order, changes, (err, laundry) => {
            if (err || !laundry || !laundry._id) {
              return res.json({ error: '付款失败，请重新尝试!' });
            }

            /** 提交流水 */
            commitLaundry.committedQALaundry('', laundry, 1, (err, result) => {
              /** 修改问题的支付状态 **/
              expertQaDal.payQusetionOrder(order.itemId, (err, data) => {
                res.json({ success: 'QASuccess' });
              });
            });
          });
        } else {
          /** 生成账户流水 */
          laundrylist.createCourseLaundry(order, false, (err, laundry) => {
            if (err || !laundry || !laundry._id) {
              return res.json({ error: '付款失败，请重新尝试!' });
            }
            /** 提交流水 */
            commitLaundry.commitCourseLaundry(laundry, (err, result) => {
              onCommittedSuccess(req.session.user, res, order, laundry, req.body.promoCode, req.body.actualMoney);
            });
          });
        }
      });
    }
  },

  /**生成赠送课程订单
   * @author bs
   */
  createGiveCourseOrder(req, res, next) {
    let orders = req.body.orders;
    let currentOrder = req.body.currentOrder;
    let guser = req.session.user;
    let persons = req.body.persons;
    orders.map(async order => {
      order['sn'] = await buildSn(order['type']);
      order['domain'] = req.session.domain;
    });
    orderDal.createGiveCourseOrder(guser, currentOrder, orders, persons, (err, data) => {
      if (err) {
        return next(err);
      }

      /** 消息推送 */
      if (data) {
        persons.map(person => {
          socketEvent.sendSystemMessage(person._id, '课程赠送通知', `${guser.name}为您赠送了课程《${currentOrder.itemName}》`, '/myCourses?isFrom=1');
        });
      }

      res.setHeader('Cache-control', 'no-cache');
      res.json(data);
    });
  },

  /**讲师端--订单管理入口
   * @author bs
   */
  orderManageEntry(req, res, next) {
    let userId = req.session.user._id;
    myRender(req, res, 'orders/orderManage', { layout: 'public_layout_expert' });
  },

  /**讲师端--获取订单信息 (分页)
   * @author bs
   */
  getExpertOrders(req, res, next) {
    let ep = new eventproxy();
    let userId = req.session.user._id;
    let filter = req.query.filter;
    let page = req.query.curPage;
    let limit = req.query.limit;
    const domain = req.session.domain;
    //控制是否来自搜索
    if (filter.$or && filter.$or.length > 2) {
      filter.$or[0].itemName = RegExp(filter.$or[0].itemName);
      filter.$or[1].sn = RegExp(filter.$or[1].sn);
      filter.$or[2].payerName = RegExp(filter.$or[2].payerName);
    }
    filter['domain'] = req.session.domain;
    orderDal.getExpertOrders(
      filter,
      page,
      limit,
      (err, orders) => {
        if (err) {
          return next(err);
        }

        ep.after("avatar", orders.length, () => {
          res.setHeader('Cache-control', 'no-cache');
          res.json(orders);
        });

        orders.map(order => {
          let date = new Date(order.createAt);
          order.createAt = date.toLocaleDateString();

          order.createTime = date.toLocaleString();
          //删除按钮：  btn: [{event: 'del', field: '删除'}]
          order.stateBtn = order.state == 2 ? { state: 2, btn: [] } :
            { state: 0, btn: [] };

          order.state = order.state == 0 ? "待付款" :
            order.state == 1 ? "已付款" : "交易关闭";

          order.price = !order.promoCode.code ? Number(order.itemAmount) : Number(order.actualMoney);
          order.actualPay = !order.promoCode.code ? order.itemAmount : 0;
          order.discount = !order.promoCode.code ? "无" : "优惠码";
          order.promoCode = !order.promoCode.code ? '' : order.promoCode.code;
          userapp.getPersonInfo(order.payerId, (err, data) => {
            if (data)
              order.payerAvatar = `${config.avatorUrl}/uploadpic/${data.Avatar}`;
            ep.emit("avatar");
          })

        });

      }
    );
  },

  /**讲师端--获取订单信息总数
   * @author bs
   */
  getExpertOrdersCount(req, res, next) {
    let filter = req.query.filter;
    filter['domain'] = req.session.domain;
    orderDal.getExpertOrdersCount(filter, (err, orders) => {
      if (err) {
        return next(err);
      }
      res.setHeader('Cache-control', 'no-cache');
      res.json(orders);
    });
  },

  /**学员端--我的订单入口
	 * @author bs
	 */
  myOrdersEntry(req, res, next) {
    let userId = req.session.user._id;
    myRender(req, res, 'orders/myOrders', { layout: 'public_layout_user', title: '我的订单' });
  },

	/**学员端--我的订单 获取订单信息总数
	 * @author bs
	 */
  getMyOrdersCount(req, res, next) {
    orderDal.getMyOrdersCount(req.query.filter, (err, orders) => {
      if (err) {
        return next(err);
      }
      res.setHeader('Cache-control', 'no-cache');
      res.json(orders);
    });
  },

	/**学员端--我的订单 获取订单信息(分页)
	 * @author bs
	 */
  getMyOrders(req, res, next) {
    let page = req.query.curPage;
    let limit = req.query.limit;
    orderDal.getMyOrders(
      req.query.filter,
      page,
      limit,
      (err, orders) => {
        // console.log('order',orders);
        if (err) {
          return next(err);
        }
        orders.map(order => {
          if (typeof (order.createAt) == "string") {
            order.createAt = order.createAt.substring(0, 10);
          } else {
            let date = new Date(order.createAt);
            order.createAt = date.toLocaleDateString();
          }
          //测试数据
          order.stateBtn = order.state == 0 ? { state: 0, btn: [{ event: 'pay', field: '立即付款' }, { event: 'cancel', field: '取消订单' }] } :
            order.state == 1 && order.licenseUsed >= 2 ? {
              state: 1, btn: [
                { event: 'give', field: '赠送好友(' + order.licenseUsed + '/' + order.itemLicense + ')' },
                { event: 'log', field: '查看赠送记录', type: "<a>" },
                { event: 'export', field: '导出学习记录', type: "<a>" },
                { event: 'record', field: '查看学习记录', type: "<a>" }]
            } : order.state == 1 && order.licenseUsed < 2 ? {
              state: 1, btn: [
                { event: 'give', field: '赠送好友(' + order.licenseUsed + '/' + order.itemLicense + ')' },
                { event: 'log', field: '查看赠送记录', type: "<a>" },
                { event: 'export', field: '导出学习记录', type: "<a>" }]
            } : { state: 2, btn: [] };
          order.state = order.state == 0 ? "待付款" :
            order.state == 1 ? "已付款" : "交易关闭";
// console.log(order.promoCode);
          if(order.promoCode){
            order.promoCode = order.promoCode.code != "" ? order.promoCode.code : "";
          }else{
            order.promoCode = "";
          }
          
          order.price = order.itemAmount;
        });
        res.setHeader('Cache-control', 'no-cache');
        res.json(orders);
      }
    );
  },

	/**学员端--我的订单 根据订单id取消订单
	 * @author bs
	 */
  cancelOrderById(req, res, next) {
    let orderId = req.query.orderId;
    orderDal.cancelOrderById(
      orderId,
      (err, order) => {
        if (err) {
          return next(err);
        }
        res.setHeader('Cache-control', 'no-cache');
        res.json(order);
      }
    );
  },

  /**根据订单id获取订单信息
   * @author bs
   */
  getOrderById(req, res, next) {
    let orderId = req.query.orderId;
    orderDal.getOrderById(
      orderId,
      (err, order) => {
        if (err) {
          return next(err);
        }
        res.setHeader('Cache-control', 'no-cache');
        res.json(order);
      }
    );
  },

  /**根据订单id删除订单
   * @author bs
   */
  delOrderById(req, res, next) {
    let orderId = req.query.orderId;
    orderDal.delOrderById(
      orderId,
      (err, order) => {
        if (err) {
          return next(err);
        }
        res.setHeader('Cache-control', 'no-cache');
        res.json(order);
      }
    );
  },


  /**后台--订单管理 获取统计信息
   * @author bs
   */
  cmsOrderStatics(req, res, next) {
    let type = req.query.type;
    const domain = req.session.domain;
    orderDal.cmsOrderStatics(domain, type, (err, statics) => {
      if (err) {
        return next(err);
      }
      res.setHeader('Cache-control', 'no-cache');
      res.json(statics);
    });
  },


  /** ping++支付完成webhocks */
  pingChargeSuccess(req, res, next) {
    let charge = req.body.data.object;
    const ep = new eventproxy();
    res.setHeader('Cache-Control', 'no-cache');

    /** 查询到支付信息并支付完成 */
    if (charge && charge.paid === true) {
      const orderId = charge.order_no;

      // 查询订单
      orderDal.loadOrderInfo(orderId, (err, order) => {
        if (err) {
          console.log('err=', err);
        }

        // 如果存在订单
        if (order) {
          ep.all('getData', async () => {
            if (order.type == 'qa') {
              let changes = [
                {
                  orderSn: order.sn,
                  type: order.payMethod == 0 ? 'platform' : 'alipay',
                  userId: order.payerId,
                  amt: -order.itemAmount
                }
              ];
              // let oldLaundry = await LaundryDal.getLaundryIdByOrderSn(order.sn);
              /** 支付宝支付时平台账户资金池变动 */
              if (order.payMethod == 1) {
                changes.push({
                  orderSn: order.sn,
                  type: order.payMethod == 0 ? 'platform' : 'alipay',
                  isPlatform: true,
                  cashPooling: order.itemAmount,
                  amt: 0
                });
              }
              laundrylist.createLaundry(order, changes, (err, laundry) => {
                if (err || !laundry || !laundry._id) {
                  return res.json({ error: '付款失败，请重新尝试!' });
                }

                /** 提交流水 */
                commitLaundry.committedQALaundry("", laundry, 1, (err, result) => {
                  /** 修改问题的支付状态 **/
                  orderDal.commitOrderSuccess(laundry.orderId, (err, or_result) => {
                    expertQaDal.payQusetionOrder(order, (err, data) => {

                      /** 支付消息推送 */
                      socketEvent.sendSuccessPaidMessage(order.payerId, { success: 'QASuccess' });

                      /** socket消息推送 */
                      socketEvent.sendSystemMessage(order.receiverId, '您有一条新的提问', `${order.payerName} 请您回答"${order.itemName}"`, '/answerManage?state=1');
                      res.json({ success: 'QASuccess' });
                    });
                  });

                });
              });
            } else {
              laundrylist.createCourseLaundry(order, true, (err, laundry) => {
                if (err || !laundry || !laundry._id) {
                  return res.json({ error: '付款失败，请重新尝试!' });
                }
                /******** 提交流水 *******/
                // 流水提交
                commitLaundry.commitCourseLaundry(laundry, (err, result) => {
                  userapp.getPersonInfo(order.payerId, (err, user) => {
                    onCommittedSuccess(user, res, order, laundry, req.body.promoCode, req.body.actualMoney);
                  });
                });

              });
            }
          });
          if (order.type == 'collection') {
            courseCollection.findOne({ _id: mongoose.Types.ObjectId(order.itemId) }, (err, collection) => {
              if (err) {
                console.log('err=', err);
                ep.emit('getData');
              }
              if (collection) {
                order.data = collection;
                ep.emit('getData');
              }
            });
          } else if (order.type == 'peek') {
            Answer.findOne({ _id: mongoose.Types.ObjectId(order.itemId) }, (err, answer) => {
              if (err) {
                console.log('err=', err);
                ep.emit('getData');
              }
              if (answer) {
                order.data = answer;
                ep.emit('getData');
              }
            });
          } else {
            ep.emit('getData');
          }
        } else {
          console.log('no order');
          return res.json({ success: 'OK' });
        }
      });
    } else {
      console.log('no charge');
      return res.json({ success: 'OK' });
    }

  },

  /*** ping++退款完成 */
  pingPayBackSuccess(req, res, next) {
    let charge = req.body.data.object;
    const ep = new eventproxy();
    res.setHeader('Cache-Control', 'no-cache');
    console.log("-------------------------------ping++payBack----------------------------", charge);
    /** 查询到支付信息并支付完成 */
    if (charge && charge.succeed === true) {
      const orderId = charge.charge_order_no;

      // 查询订单
      orderDal.loadOrderInfo(orderId, (err, order) => {
        if (err) {
          console.log('err=', err);
        }

        // 如果存在订单 且为问答退款
        if (order && order.type == 'qa') {

          ep.all('oldlaundry', (oldlaundry) => {
            //退款流水
            laundrylist.createPayBackLaundry(order, (err, laundry) => {
              if (err || !laundry || !laundry._id) {
                return res.json({ error: '退款失败' });
              }
              /** 提交流水 */
              commitLaundry.committedQALaundry(oldlaundry, laundry, 2, (err, result) => {
                //标记订单为已退款状态
                order.state = 2;
                order.closeTime = new Date().getTime();
                order.closeType = "payBackSuccess";
                let newOrder = new Orders(order);
                newOrder.save();
                //问题标记为已退款状态
                Question.update({ _id: mongoose.Types.ObjectId(order.itemId) }, { $set: { state: 3 } }, (err, data) => {
                  console.log("标记为题为退款状态", err, data);
                });
                //消息推送
                //推送系统消息
                let message = {
                  type: 'qa',
                  content: '您的提问: ' + order.itemName + ' 48小时未被讲师回答，已退款',
                  userId: order.payerId,
                  url: '/myaccount',
                  state: 0,
                  createAt: new Date(),
                }
                let newMessage = new Messages(message);
                newMessage.save((err, result) => {
                  /** socket消息推送 */
                  socketEvent.sendSystemMessage(order.payerId, '提问退款通知', `您的提问" ${order.itemName} " 48小时未被讲师回答，已退款`, '/myQAEntry');
                  return res.json({ success: 'OK' });
                });
              });

              //消息推送
              //推送系统消息
              let message = {
                type: 'qa',
                content: '您的提问: ' + order.itemName + ' 48小时未被讲师回答，已退款',
                userId: order.payerId,
                url: '/myQAEntry',
                state: 0,
                createAt: new Date(),
              }
              let newMessage = new Messages(message);
              newMessage.save();
            });
          });

          /** 读取付款流水信息 */
          LaundryDal.getLaundryIdByOrderSn(order.sn, (err, oldlaundry) => {
            ep.emit('oldlaundry', oldlaundry);
          });

        } else {
          console.log('no order');
          return res.json({ success: 'OK' });
        }
      });
    } else {
      console.log('no charge');
      return res.json({ success: 'OK' });
    }
  },
  /**
    { id: 're_580WDGuH4KC4Kezzj9904yj5',
    object: 'refund',
    order_no: '580WDGuH4KC4Kezzj9904yj5',
    amount: 1,
    created: 1478740769,
    succeed: true,
    status: 'succeeded',
    time_succeed: 1478740769,
    description: '测试性退款',
    failure_code: null,
    failure_msg: null,
    metadata: {},
    charge: 'ch_XfHiD0uzf18Kz5C40CnX1SC0',
    charge_order_no: '1216110931172',
    transaction_no: '2016110921001004050267555307' }
  */
  testrefund(req, res, next) {
    pingpp.createRefund(
      'ch_vTy5G4rPuLmLGyvrr9G8C4iH',
      0.01,
      '课程愉快的退款',
      (err, refund) => {
        console.log('-----', refund);
      }
    );
  }

}