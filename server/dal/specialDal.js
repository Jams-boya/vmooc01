import eventproxy from 'eventproxy';
import _          from 'lodash';
import validator  from 'validator';
import fs         from 'fs';
import py         from '../middlewares/pinyin';
import log4js     from 'log4js';
import mongoose   from 'mongoose';
import models 		from '../models';

export default {
  /**
   * 根据id获取专题信息
   * @author: bs
   */
  getCoursesCollection(id, callback) {
    models.courseCollection.findOne({_id: id}).exec(callback);
  },
  /**
   * 获取专题推荐专家
   * @author: wac
   */
  rmdExperts(id, callback) {
    models.courseCollection.findOne({_id: id}).select('expert').exec(callback);
  },

  /**
  * 获取专题课程合辑信息
  * @author: wac
  */
  courseCompilation(id, callback) {
    models.courseCollection.findOne({_id: id}).exec(callback);
  },

  /**
  * 获取专题头部信息
  * @author: wac
  */
  topInfo(id, callback) {
    models.courseCollection.findOne({_id: id}).exec(callback);
  },
  /**
   * 获取专题数量
   * @author: wac
   */
  specialCount(domain, condition, callback)  {
    models.courseCollection.count({...condition, domain}, callback);
  },
  /**
   * 获取专题列表
   * @author: wac
   */
  specials(domain, state, curPage, limit, callback) {
    models.courseCollection.find({domain, ...state}, {}, {lean: true}).limit(limit).skip((curPage - 1) * limit).exec((err, data) => {
      if(data && data.length > 0) {
        data.map((val, idx) => {
          if(val.state == 0) {
            data[idx].state = '已完成';
          }
          if(val.state == 1) {
            data[idx].state = '草稿';
          }
          data[idx].copyLink = '复制链接';
          if(idx == data.length - 1) {
            callback(null, data);
          }
        });
      } else {
        callback(null, data);
      }
    });
  },
  /**
   * 删除专题
   * @author: wac
   */
  delSpecial(_id, callback) {
    models.courseCollection.remove({_id}, callback);
  },
  /**
   * 获取专题课程
   * @author: wac
   */
  sepcailCourse(filter, curPage, limit, callback) {
    models.Course.find({...filter, state: 1}, {}, {lean: true}).limit(limit).skip((curPage - 1) * limit).exec((err, data) => {
      if(err) {
        console.log('err', err);
      }
      if(data.length > 0) {
        data.map((val, idx) => {
          data[idx].addCourse = '添加课程';
          if(idx == data.length - 1) {
            callback(null, data);
          }
        });
      } else {
        callback(null, data);
      }
    });
  },
  /**
   * 获取专题课程数量
   * @author: wac
   */
  sepcailCourseCount(filter, callback) {
    models.Course.count(filter, callback);
  },
  /**
   * 获取专题课程
   * @author: wac
   */
  sepcailExpert(filter, curPage, limit, callback) {
    models.Expert.find(filter, {}, {lean: true}).limit(limit).skip((curPage - 1) * limit).exec((err, data) => {
      if(err) {
        console.log('err111111', err);
      }
      if(data.length > 0) {
        data.map((val, idx) => {
          val.addRecom = '推荐讲师';
          if(!val.lifePhoto) {
            val.lifePhoto = '/images/user.png';
          } else {
            val.lifePhoto = '/' + val.lifePhoto;
          }
          if(idx == data.length - 1) {
            callback(null, data);
          }
        });
      } else {
        callback(null, data);
      }
    });
  },
  /**
   * 获取专题课程数量
   * @author: wac
   */
  sepcailExpertCount(filter, callback) {
    models.Expert.count(filter, callback);
  },
  /**
   * 插入专题信息
   * @author: wac
   */
  specialAdd(special, callback) {
    special._id =  mongoose.Types.ObjectId();
    special.link = special.link + special._id;
    let courseCollection = new models.courseCollection(special);
    courseCollection.save(callback);
  },
  /**
   * 修改专题信息
   * @author: wac
   */
  specialupdate(special, callback) {
    models.courseCollection.update({_id : mongoose.Types.ObjectId(special._id)}, special).exec(callback);
  },
  /**
   * 专题预览
   * @author: wac
   */
  speciallook(special, callback) {
    special._id =  mongoose.Types.ObjectId();
    special.link = special.link + special._id;
    let courseCollection = new models.courseCollection(special);
    courseCollection.save((err, data) => {
      models.courseCollection.findOne({state: 2}).select('_id').exec(callback);
    });
  },
  /**
   * 专题预览删除
   * @author: wac
   */
  dellook(callback) {
    models.courseCollection.remove({state : 2}).exec(callback);
  },
}