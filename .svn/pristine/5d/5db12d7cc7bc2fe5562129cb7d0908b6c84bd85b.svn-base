import fs from 'fs';
import _ from 'lodash';
import eventproxy from 'eventproxy';
import formidable from 'formidable';
import tools from '../middlewares/tools';
import { myRender } from './common';
import ExpertQaDal from '../dal/expertQaDal';
import userapp from '../user/userapp';
import commitLaundry from '../middlewares/commitLaundry';
import commissionlevelDal from '../dal/commissionlevelDal';
import laundrylist from './laundryList';
import laundryDal from '../dal/laundryListDal';
import { Orders } from '../models';
import { Question } from '../models';
import { Messages } from '../models';
import orderDal from '../dal/orderDal';
import mongoose from 'mongoose';
import socketEvent from '../socketEvent';

export default {
  /**
   * 专家回答入口
   * @author gs
   */
  entry(req, res, next) {
    let user = req.session.user;
    let {id} = req.params;
    ExpertQaDal.getExpertQa(id, (error, question) => {
      if (error) {
        return res.status(404).render('404', {layout: null});
      }
      question.userId = req.params.userId;
      myRender(req, res, 'expertqa/notpay', { question });
    });
  },


  /**
   * 专家回答问题
   * @author gs
   */
  getAnswer(req, res, next) {
    let user = req.session.user;
    let {userId} = req.query;
    let {id} = req.query;
    ExpertQaDal.answer(
      userId, id, (err, data) => {
        if (err) {
          return next(err);
        }
        res.setHeader('Cache-Control', 'no-cache');
        res.json(data);
      }
    )
  },

/**
 * 查询问题（未登录）
 * @author：gs
 */
  answerNoGuser(req, res, next) { 
    let {id} = req.body;
    ExpertQaDal.answerNoGuser(
      id, (err, data) => {
        if (err) {
          return next(err);
        }
        res.setHeader('Cache-Control', 'no-cache');
        res.json(data);
      }
    )
  },

  /**
   * 相关推荐问答
   * @author gs
   */
  getCoursesQa(req, res, next) {
    let {id} = req.query;
    let header = req.headers.referer;
    let uncheck = header.substring(header.length-49, header.length-25);
    ExpertQaDal.coursesQa(id, (err, data) => {
      if (err) {
        return next(err);
      }
      let flag = false;
        data.map((item, index) => {
          if (item._id == uncheck) {
            data = _.pull(data, data[index]);
            flag = true;
          }
        });
        if (!flag) {
          _.pull(data, data[0]);
        }
      res.setHeader('Cache-Control', 'no-cache');
      res.json(data);
    }
    )
  },
  /**
   * 统计点赞个数
   * @author gs
   */
  getLikeCount(req, res, next) {
    let id = req.query.id;
    let {likeCount} = req.query;
    // let likeArr = {};
    // likeArr['id'] = req.session.user._id;
    // likeArr['name'] = req.session.user.name;
    // likeArr['avatar'] = req.session.user.Avatar;
    ExpertQaDal.countlike(id, likeCount, (err, data) => {
      if (err) {
        return next(err);
      }
      res.setHeader('Cache-Control', 'no-cache');
      res.json(data);
    });
  },
  /**
   * 查询是否点赞
   * @author:gs
   */
  findIsLike(req, res, next) {
    let {userId} = req.body;
    let {answerId} = req.body;
    ExpertQaDal.findIsLike(userId, answerId, (err, data) => {
      if (err) {
        return next(err);
      }
      res.setHeader('Cache-Control', 'no-cache');
      res.json(data);
    });
  },
  /**
   * 更新点赞用户
   * @author:gs
   */
  updateLike(req, res, next) {
    let {id} = req.query;
    let {orderId} = req.query;
    ExpertQaDal.updateLike(id, orderId, (err, data) => {
      if (err) {
        return next(err);
      }
      res.setHeader('Cache-Control', 'no-cache');
      res.json(data);
    });
  },
  /**
   *
   * 获取用户昵称
   * @author:gs
   */
  findAsker(req, res, next) { 
    let {askerId} = req.query;
    userapp.getPersonInfo(askerId, (err, data) => {
      if (err) {
        return next(err);
      }
      res.setHeader('Cache-Control', 'no-cache');
      res.json(data);
    });
  },
  /**
   * 专家回答问题
   * @author: wac
   */
  expertAnswerPay(req, res, next) {
    let {answers} = req.body;
    answers['domain'] = req.session.domain;
    res.setHeader('Cache-Control', 'no-cache');
    ExpertQaDal.expertAnswerPay(answers, (err, data) => {
      console.log("answers", answers);
      if (err) {
        myRender(req, res, '400');
      } else {
        /** 完成问答的流水提交 */

        // 读取订单信息
        orderDal.getOrderById(answers.ordersId, async (err, order) => {
          const purchaseCount = await ExpertQaDal.loadAnswerCountByExpert(req.session.user._id);
          const commission    = await commissionlevelDal.loadCommission("qa", purchaseCount) || 0.3; //利息率
          const amt = Number(order.itemAmount);
          const expertAmt = amt * (1 - commission);
          const platFormAmt = amt * commission;

          let changes = [
            {
              orderSn: order.sn,
              chargeId: order.chargeId,
              isPlatform: true,
              cashPooling: 0,
              type: 'platform',
              amt:  platFormAmt
            },
            {
              orderSn: order.sn,
              chargeId: order.chargeId,
              userId: order.receiverId,
              type: 'platform',
              amt: expertAmt
            }
          ];
          laundryDal.getLaundryIdByOrderSn(order.sn, (err, oldlaundry) => {
            if (err || !oldlaundry)
              return res.json({err});

            // 标注订单完成
            orderDal.commitOrderSuccess(order._id, (err, commit) => {});
            Question.findOne({_id: mongoose.Types.ObjectId(answers.questionId)}, (err,question) => {
              //推送系统消息
              let message = {
                type: 'qa',
                content: '讲师: ' + question.requiredAnswerName + ' 回答了您的问题：' + question.title ,
                userId: question.askerId,
                url: '/expertqa/' + question._id + '/' + question.requiredAnswerId,
                state: 0,
                createAt: new Date(),
              }
              let newMessage = new Messages(message);
              newMessage.save();
              socketEvent.sendSystemMessage(question.askerId, '问答通知', `讲师: ${question.requiredAnswerName} 回答了您的问题：${question.title}`, `/expertqa/${question._id}/${question.requiredAnswerId}`);
            });
            

            laundrylist.createLaundry(order, changes, (err, laundry) => {
              commitLaundry.committedQALaundry(oldlaundry, laundry, 2, (err, result) => {
                res.json(data);
              });
            });

          });
        });
      }
    });
  },
// 添加点赞者
  addLiker(req, res, next) {
    let like = {};
    like['userId'] = req.query.userId;
    like['answerId'] = req.query.answerId;
    ExpertQaDal.addLiker(like, (err, data) => {
      if (err) {
        return next(err);
      }
      res.setHeader('Cache-Control', 'no-cache');
      res.json(data);
    })
  },
  // 查询偷看者信息
  findPeeker(req, res, next) {
    let peekersId = req.body.peekersId;
    userapp.getPersonInfo(peekersId,(err, data) => {
      if (err) {
        return next(err);
      }
      res.setHeader('Cache-Control', 'no-cache');
      res.json(data);
    });
  },

  // 通过讲师的Id获取问答的价格
  selsetMoney(req, res, next){
    let {guserId} = req.body;
    ExpertQaDal.selsetMoney(guserId, (err, data) => {
      if (err) {
        return next(err);
      }
      res.setHeader('Cache-Control', 'no-cache');
      res.json(data);
    })
  },

}