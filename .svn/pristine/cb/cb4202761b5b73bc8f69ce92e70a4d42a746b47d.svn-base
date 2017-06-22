import fs from 'fs';
import eventproxy from 'eventproxy';
import formidable from 'formidable';
import tools from '../middlewares/tools';
import {myRender} from './common';
import expertDal from '../dal/expertDal';
import teacherDal from '../dal/teacherDal';
import hbhelper from './hbhelper';
import userapp from '../user/userapp';

export default {
  /**
   * 专家主页入口
   * @params: (userId) 专家id
   * @params: (callback{(error) 错误，(data) 查询数据}) 回调函数
   * @author: wac
   */
  entry(req, res, next) {
    let userId = req.params.id;
    expertDal.expertInfo(userId,(error,data) => {
      if(error) {
        return myRender(req,res,'400');
      }
      else {
        res.setHeader('Cache-Control','no-cache');
        myRender(req, res, 'expert/expert', {
          expertInfo: data
        });
      }
    });
  },

  /**
   * 专家回答
   * @params: (answererId) 专家id
   * @params: (listCount) 显示条数
   * @params: (cur_page) 页数
   * @params: (callback{(error) 错误，(data) 查询数据}) 回调函数
   * @author: wac
   */
  myAnswer(req, res, next) {
    let answererId = req.body.answerId;
    let listCount  = req.body.listCount;
    let cur_page = req.body.cur_page;
    expertDal.myAnswer(answererId, listCount, cur_page, (error, data) => {
      if(error) {
        return myRender(req,res,'400');
      }
      else {
        res.setHeader('Cache-Control','no-cache');
        res.json(data);
      }
    });
  },
  /**
   * 专家课程
   * @params: (answererId) 专家id
   * @params: (callback{(error) 错误，(data) 查询数据}) 回调函数
   * @author: wac
   */
  ownCourse(req, res, next) {
    let answererId = req.body.answerId;
    expertDal.ownCourse(answererId, (error, data) => {
      if(error) {
        return myRender(req,res,'400');
      }
      else {
        res.setHeader('Cache-Control','no-cache');
        res.json(data);
      }
    });
  },
  /**
   * 公共模块-个人资料
   * callback
   * @params: user :用户
   * @author:gs
   */
  PersonalEntry(req, res, next) {
    let user = req.session.user;
    let userId = req.session.user._id;
    myRender(req, res, 'public/personal', { layout: 'public_layout_user', public: 'public' });
    // userapp.getPersonInfo(userId, (err, data) => {
    //   if (err) {
    //     return next(err);
    //   }
    //   console.log('----', data);
    //   // req.session.user = data;
    //   // console.log('session3-----', req.session.user);
    // });
  },
  /**
   * 查询讲师其他信息
   * @author:gs
   */
  expertOther(req, res, next) {
    let userId = req.query.userId;
    expertDal.findExpertOther(userId, (err, data) => {
      if (err) {
        return next(err);
      }
      res.setHeader('Cache-Control','no-cache');
      res.json(data);
    })
  },

  /**
   * 公共模块-修改密码
   * callback
   * @params: user :用户
   * @author:gs
   */
  modifyPwdEntry(req, res, next) {
    let user = req.session.user;
    myRender(req, res, 'public/modifypwd', { layout: 'public_layout_user', public: 'public' });
  },
  /**
   * 公共模块-问答管理
   * callback
   * @params: user :用户
   * @author:gs
   */
  QaSetupEntry(req, res, next) {
    let user = req.session.user;
    teacherDal.findOneUserIdByTeacher(user._id, (err, data) => {
      if (err) {
        return myRender(req, res, '404');
      } else {
        myRender(req, res, 'public/qasetup', { layout: 'public_layout_user', teacherId: data._id, public: 'public' });
      }
    });
  },

  /**
   * 通过teacherId查询讲师信息
   * @author:gs
   */
  findExpert(req, res, next) {
    let {teacherId} = req.query;
    expertDal.findExpert(
      teacherId,
      (err, data) => {
      if (err) {
        return next(err);
      }
      res.setHeader('Cache-Control','no-cache');
      res.json(data);
    })
  }
}