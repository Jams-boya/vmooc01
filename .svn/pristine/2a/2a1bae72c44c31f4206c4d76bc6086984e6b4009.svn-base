import eventproxy from 'eventproxy';
import _ from 'lodash';
import validator from 'validator';
import log4js from 'log4js';
import mongoose from 'mongoose';
import {courseCollection}	from '../models';
import {Course} from '../models';
import {MyCourse} from '../models';
import commonDal from './commonDal';
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
   * 首页获取专题列表
   * @author bs
   */
	getCollections(domain, callback) {
		courseCollection.find({isRecommend: true, state: 0, domain}, {_id:1, name:1, cover:1}).limit(6).exec(callback);
	},

	/** 读取专家数量 */
  count(query, callback) {
    const condition = buildSearchCondition(query);
    courseCollection.count(condition, callback);
  },
  /** 读取专家列表 */
  list(query, callback) {
    const condition = buildSearchCondition(query);
		courseCollection.find(condition, null, commonDal.buildPageAndOrderOptions(query, {sort: {_id: -1}}), callback);
  },

  /** 课程推荐修改 */
  applyrecommendcourse(cId, isRecommend, callback) {
    courseCollection.findOneAndUpdate({_id: cId}, {$set: {isRecommend: isRecommend}}, {new: true}, callback);
  },

  /** 根据id已购买专题课程推送至我的课程*/
  myCoursePush(user, order, id, callback) {
    let ep = new eventproxy();
    courseCollection.findOne({_id: id}, (err, collection) => {
      let $or = [];
      collection.chapter.map(chapter => {
        //获取课程信息
        chapter.courses.map(course => {
          $or.push({_id: course.id});
        });
        Course.find({$or: $or}, {lean: true}, (err, courses) => {
          
          ep.after('finish', courses.length, () => {
            callback(null, {success: 'MyCourse upsert Success!'});
          });

          courses.map(course => {
            let courseCount = 0;
            let startAt = new Date();
            let endAt   = new Date();
            let year = startAt.getFullYear() + 1;
            endAt = new Date(endAt.setFullYear(year));

            course.toc.map(chapter => {
              chapter.clazz.map(clazz => {
                courseCount++;
              });
            });

            let myCourse ={
              userId: user._id,
              userName: user.name,
              nickName: user.nickName,
              userAvatar: user.Avatar,
              courseId: course._id,
              courseFrom: 0,
              buyInfo: {
                orderId: order._id,
                orderSn: order.sn,
                buyCount: 1,
                usedCount: 1,
                buyAt: new Date(),
              },
              startAt: startAt,
              endAt: endAt,
              speedStu: {
                courseId: course._id,
                courseName: course.name,
                courseCount: courseCount,
                lookedCount: 0,
              },
              courseFrom : 0,
            }

            let newMyCourse = new MyCourse(myCourse);
            newMyCourse.save(ep.emit('finish'));
          });
        });
      });
    });
  }
}