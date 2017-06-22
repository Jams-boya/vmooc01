import eventproxy from 'eventproxy';
import formidable from 'formidable';
import fs from 'fs';
import mongoose from 'mongoose';
import validator from 'validator';

import config from '../config';
import expertDal from '../dal/expertDal';
import teacherDal from '../dal/teacherDal';
import tools from '../middlewares/tools';
import userapp from '../user/userapp';
import { myRender } from './common';
import socketEvent from '../socketEvent';
import client from '../middlewares/redis';
import { Messages } from '../models';
function isFree(id, bool, next) {
  return new Promise((resolve, reject) => {
    userapp.confirmInstructor(
      id, bool,
      (err, data) => {
        if (err) {
          return reject(err);
        }
        let state = bool ? 'pass' : 'reject';
        client.set(`expertStateChange:${id}`, state, (err, result) => {
          return resolve(err);
        });
      });
  });
}
export default {
  /**
   * 申请合作入口
   * @author:ls
   */
  entry(req, res, next) {
    teacherDal.findOneUserIdByTeacher(
      req.session.user._id,
      (err, data) => {
        if (err) {
          return next(err);
        }
        myRender(req, res, 'teacher/index', { title: config.name + '-申请合作', home: true, teacher: data });
      }
    )
  },
  findOneUserIdByTeacher(req, res, next) {
    let { userId } = req.query;
    teacherDal.findOneUserIdByTeacher(userId, (err, data) => {
      if (err) {
        return next(err);
      }
      res.setHeader('Cache-Control', 'no-Cache');
      res.json(data);
    })
  },
  /**
   * -- {申请合作列表} --
   * @author:ls
   */
  list(req, res, next) {
    console.log(req.session.user);
    myRender(req, res, 'teacher/teacherlist', { layout: 'public_layout_cms', title: config.name + '-申请合作列表', home: true });
  },
  /**
   * -- {申请合作列表} --
   * @author:ls
   */
  rule(req, res, next) {
    myRender(req, res, 'teacher/teacherRule', { layout: 'public_layout_cms', title: config.name + '-讲师管理', home: true });
  },

  /**
   * -- {申请合作}  --
   * @author:ls
   */
  add(req, res, next) {
    let content = req.body.content;
    content.userId = content.userId || req.session.user._id;
    content.email = content.email || req.session.user.email;
    content.userName = content.userName || req.session.user.name;
    content.updateAt = content.updateAt || Date.now();
    content.updateId = content.updateId || req.session.user._id;
    content.state = content.state || 0;
    content.domain = content.domain || req.session.domain;
    const ep = new eventproxy();
    ep.all('teacher', (teacher) => {
      if (!teacher) {
        teacherDal.add(content,
          (err, data) => {
            if (err) {
              return next(err);
            }
            res.setHeader('Cache-Control', 'no-Cache');
            res.json(data);
          }
        );
      } else {
        teacherDal.update(teacher._id, content,
          (err, data) => {
            if (err) {
              return next(err);
            }
            res.setHeader('Cache-Control', 'no-Cache');
            res.json(data);
          }
        );
      }
    });
    teacherDal.findOneUserIdByTeacher(
      content.userId,
      (err, data) => {
        if (err) {
          return next(err);
        }
        ep.emit('teacher', data);
      }
    );
  },

  /**
   * -- { 完成状态用来判断下一次用户进入申请合作时直接跳转新页面} --
   * @author:ls
   */
  isState(req, res, next) {
    let { user } = req.session;
    let { state1, state2 } = req.body;
    teacherDal.isState(
      user._id,
      state1,
      state2,
      (err, data) => {
        if (err) {
          next(err);
        }
        res.setHeader('Cache-Control', 'no-Cache');
        res.json(data);
      });
  },



  /**
   * -- {申请合作列表} --
   * @author:ls
   */
  searchList(req, res, next) {
    const domain = req.session.domain;
    req.query.rule = req.query.rule.split(',');
    teacherDal.search(
      domain,
      req.query,
      (err, data) => {
        if (err) {
          return next(err);
        }
        if (req.query.fetch_total && data.count && validator.isInt(String(data.count))) {
          res.setHeader('x-total-count', data.count);
        }
        res.setHeader('Cache-Control', 'no-Cache');
        res.json(data.list);
      }
    )
  },

  /**
   * -- {审批申请者} --
   * @author:ls
  */
  through(req, res, next) {
    let { num, id, professional } = req.query;
    let { user } = req.session;

    let upstate = {
      id: id,
      num: num,
      updateId: user._id,
      updateAt: new Date().getTime(),
      professional: professional
    }

    teacherDal.through(
      upstate,
      async (err, data) => {
        if (err) {
          return next(err);
        }

        let note = (Number(num) === 1) ? '已' : '未';
        socketEvent.sendSystemMessage(data.userId, '讲师审核通知', `您的讲师资格${note}被审核通过`, `/teachersign/steps/`);
        //推送系统消息
        let message = {
          type: 'system',
          content: `您的讲师资格${note}被审核通过`,
          userId: data.userId,
          url: `/teachersign/steps/`,
          state: 0,
          createAt: new Date(),
        }
        let newMessage = new Messages(message);
        newMessage.save();

        if (Number(num) === 1) {
          try {
            let user = await isFree(data.userId, true, next);

            let expert = {
              name: data.name,
              lifePhoto: data.lifePhoto,
              professionalTitle: data.professional,
              briefDescription: data.myself,
              createId: data.userId,
              email: data.email,
              userId: data.userId,
              createAt: new Date().getTime(),
              phone: data.phone,
              domain: req.session.domain
            };
            expertDal.addExpert(expert, (err, data) => {
              if (err) {
                console.log('errr', err);
              }
            });

          } catch (error) {
            console.log('error', error);
          }


        } else if (Number(num) === 2) {
          isFree(data.userId, false, next);
        }

        client.set(`expertStateChange:${data.userId}`, `pass`, (err, result) => {
          console.log('=======', err, result);
          res.setHeader('Cache-Control', 'no-Cache');
          res.json(data);
        });

      });
  },
  /**
   * -- {修改是否使用} --
   * @author:ls
  */
  employ(req, res, next) {
    let { num, id } = req.body;
    let { user } = req.session;

    let update = {
      id: id,
      num: num,
      updateId: user._id,
      updateAt: new Date().getTime()
    };

    teacherDal.employ(
      update,
      (err, data) => {
        if (err) {
          return next(err);
        }
        if (Number(num) === 1) {
          isFree(data.userId, true, next);
        } else if (Number(num) === 3) {
          isFree(data.userId, false, next);
        }
        res.setHeader('Cache-Control', 'no-Cache');
        res.json(data);
      }
    )
  }
};

