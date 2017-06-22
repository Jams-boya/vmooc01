import laundryListDal from '../dal/laundryListDal';
import commissionlevelDal from '../dal/commissionlevelDal';
import eventproxy from 'eventproxy';
import courseDal from '../dal/courseDal';
import {courseCollection} from '../models';
import {Course} from '../models';
import { Question } from '../models';
import { Answer } from '../models';
import mongoose from 'mongoose';
import _ from 'lodash';
/*** 判断支付方式 */
function judgeType(type) {
  return type === 1? 'alipay': 'platform';
}

export default {

  /**
   * createCourseLaundry 创建课程订单流水
   * @param {any} order 订单信息
   * @param {any} isPing 是否是ping++支付
   */
  async createCourseLaundry(order, isPing, callback) {
    try {

      const purchaseCount = await courseDal.loadCoursePurchase(order.itemId);
      const commission    = await commissionlevelDal.loadCommission("course", purchaseCount) || 0.4; //利息率
      const amt           = Number(order.itemAmount);
      const payeeMoney    = amt * (1 - commission); // 收款人金额
      const platformMoney = amt * commission; // 平台抽成
      let ep = new eventproxy();
      /** 流水账 */
      let laundry = {
        domain: order.domain,
        module: 'vmooc',
        orderType: order.type,
        orderSn: order.sn,
        state: 'uncommitted',
        orderId: order._id,
        createId: order.payerId,
        createName: order.payerName,
        payeeId: order.receiverId,
        payeeName: order.receiverName,
        createAt: new Date().getTime(),
        changes: [],
        promoCode: order.promoCode.code,
      };   

      // 付款人的流水
      let payerlaundry = {
        orderSn: order.sn,
        chargeId: order.chargeId,
        userId: order.payerId,
        amt: -amt,
        type: judgeType(order.payMethod)
      };
      laundry.changes.push(payerlaundry);

      let platformlaundry;
      if (order.type == 'peek') {
        // 平台流水
        platformlaundry = {
          orderSn: order.sn,
          chargeId: order.chargeId,
          isPlatform: true,
          cashPooling: 0,
          type: 'platform',
          amt: amt*0.2,
        };
      } else {
        // 平台流水
        platformlaundry = {
          orderSn: order.sn,
          chargeId: order.chargeId,
          isPlatform: true,
          cashPooling: 0,
          type: 'platform',
          amt: platformMoney
        };
      }
      

      laundry.changes.push(platformlaundry);

      if (order.payMethod === 1) {
        platformlaundry['cashPooling'] = amt;
      }

      ep.all('payeeLaundryFinish',() => {
        laundryListDal.createLaundryList(laundry, (err, laundry) => {
          callback(err, laundry);
        });
      });

      //课程流水提交
      if (order.type == 'course' || order.type == "qa") {
        // 收款讲师的流水
        let payeelaundry = {
          orderSn: order.sn,
          chargeId: order.chargeId,
          userId: order.receiverId,
          type: 'platform',
          amt: payeeMoney
        };
        laundry.changes.push(payeelaundry);
        ep.emit("payeeLaundryFinish");
      //偷看流水提交
      } else if (order.type == 'peek') {
        Answer.findOne({_id: mongoose.Types.ObjectId(order.itemId)}, (err, answer) => {
          Question.findOne({_id: mongoose.Types.ObjectId(answer.questionId)}, (err, question) => {
              // 收款讲师的流水
            let payeelaundry = {
              orderSn: order.sn,
              chargeId: order.chargeId,
              userId: order.receiverId,
              type: 'platform',
              amt: amt * 0.4
            };
            laundry.changes.push(payeelaundry);
            //提问者流水
            let queslaundry = {
              orderSn: order.sn,
              chargeId: order.chargeId,
              userId: question.askerId,
              type: 'platform',
              amt: amt * 0.4
            };
            laundry.changes.push(queslaundry);
            ep.emit("payeeLaundryFinish");
          });
        });
      } else if (order.type == 'collection') {
        courseCollection.findOne({_id: mongoose.Types.ObjectId(order.itemId)}, (err, collection) => {
          let coursesCount = 0;
          let discount = collection.collectionPrice / collection.totalPrice;
          collection.chapter.map(chapter => {
            chapter.courses.map(course => {
              coursesCount++;
            });
          });

          ep.after('courseSuccess', coursesCount, () => {
            ep.emit("payeeLaundryFinish");
          });

          collection.chapter.map(chapter => {
            chapter.courses.map(course => {
              Course.findOne({_id: course.id}, (err, c) => {
                let id = _.findIndex(laundry.changes, function(o) { return o.userId == c.teacherId;});
                if (id >= 0) {
                  laundry.changes[id].amt += discount * c.price * (1 - commission) * order.itemLicense;
                } else {
                  let payeelaundry = {
                    orderSn: order.sn,
                    chargeId: order.chargeId,
                    userId: c.teacherId,
                    type: 'platform',
                    amt: discount * c.price * (1 - commission) * order.itemLicense,
                  };
                  laundry.changes.push(payeelaundry);
                }
                ep.emit('courseSuccess');
              });
            });
          });
        });
      }
    } catch (error) {
      console.log('error', error);
      callback(error);
    }   
  },

  /** create laundry */
  createLaundry(order, changes, callback) {
    /** 流水账 */
    let laundry = {
      domain: order.domain,
      module: 'vmooc',
      orderType: order.type,
      orderSn: order.sn,
      state: 'uncommitted',
      orderId: order._id,
      createId: order.payerId,
      createName: order.payerName,
      payeeId: order.receiverId,
      payeeName: order.receiverName,
      createAt: new Date().getTime()
    }; 

    laundry['changes'] = changes;
    laundryListDal.createLaundryList(laundry, (err, laundry) => {
      callback(err, laundry);
    });
  },

  /** 创建提现流水 */
  createWithDrawLaundry(domain, user, withdrawId, changes, callback) {
    let laundry = {
      domain,
      module: 'vmooc',
      state: 'uncommitted',
      orderType: 'withdraw',
      createId: user._id,
      withdrawId: withdrawId,
      createName: user.name,
      createAt: new Date().getTime()
    };
    laundry['changes'] = changes;
    laundryListDal.createLaundryList(laundry, (err, laundry) => {
      callback(err, laundry);
    });
  },

  /** 创建提现流水(平台账户) **/
  createWithDrawPlatform(userLaundry, change, callback) {
    let laundry = {
      module: 'vmooc',
      state: 'uncommitted',
      orderType: 'withdraw',
      createId: userLaundry.createid,
      withdrawId: userLaundry.withdrawId,
      createName: userLaundry.createName,
      createAt: new Date().getTime(),
      changes: [change]
    };
    laundryListDal.createLaundryList(laundry, (err, laundry) => {
      callback(err, laundry);
    });
  },


  //创建问答退款流水
  createPayBackLaundry(order, callback) {
    const amt = Number(order.itemAmount);
    /** 流水账 */
    let laundry = {
      domain: order.domain,
      module: 'vmooc',
      orderType: order.type,
      orderSn: order.sn,
      state: 'uncommitted',
      orderId: order._id,
      createId: order.payerId,
      createName: order.payerName,
      payeeId: order.payerId,
      payeeName: order.payerName,
      createAt: new Date().getTime(),
      changes:[]
    }
    //支付宝渠道退款
    if (order.payMethod == 1) {
      // 平台流水
      let platformlaundry = {
        orderSn: order.sn,
        chargeId: order.chargeId,
        isPlatform: true,
        cashPooling: -amt,
        amt: 0,
        type: 'platform',
        payBack: true,
      };
      laundry.changes.push(platformlaundry);
      //退款人流水
      let payeelaundry = {
        orderSn: order.sn,
        chargeId: order.chargeId,
        userId: order.payerId,
        type: 'alipay',
        amt: amt,
        payBack: true,
      };
      laundry.changes.push(payeelaundry);
    }
    
    // 账户余额渠道退款
    // 退款人的流水
    if (order.payMethod == 0) {
      let payeelaundry = {
        orderSn: order.sn,
        chargeId: order.chargeId,
        userId: order.payerId,
        type: 'platform',
        amt: amt,
        payBack: true,
      };
      laundry.changes.push(payeelaundry);
    }

    laundryListDal.createLaundryList(laundry, (err, laundry) => {
      callback(err, laundry);
    });
  }
}