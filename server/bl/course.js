import { myRender } from './common';
import CourseDal from '../dal/courseDal';
import teacherDal from '../dal/teacherDal';
import eventproxy from 'eventproxy';
import validator from 'validator';
import orderDal from '../dal/orderDal';
import _ from 'lodash';
import axios from 'axios';
import fs from 'fs';
import xlsx from 'node-xlsx';
import formidable from 'formidable';
import mkdirp from 'mkdirp';
import querystring from 'querystring';
import request from 'request';
import socketEvent from '../socketEvent';
import { Messages } from '../models';
import mongoose from 'mongoose';
import userapp from '../user/userapp';
import config from '../config';
import PartnerDal from '../dal/partnerDal';

function handleExcel(data) {
  let needArr = [];
  let arr = [];
  let dbArr = [];
  if (data) {
    data.map(d => {
      if (d.length > 0) {
        dbArr.push(d);
      }
    });
    if (_.indexOf(dbArr[0], "题目标题") != -1) {
      arr.push({
        index: _.indexOf(dbArr[0], "题目标题")
      });
    }
    if (_.indexOf(dbArr[0], "答案总数") != -1) {
      arr.push({
        index: _.indexOf(dbArr[0], "答案总数")
      });
    }
    if (_.indexOf(dbArr[0], "正确答案") != -1) {
      arr.push({
        index: _.indexOf(dbArr[0], "正确答案")
      });
    }
    if (_.indexOf(dbArr[0], "单选或多选") != -1) {
      arr.push({
        index: _.indexOf(dbArr[0], "单选或多选")
      });
    }
    if (_.indexOf(dbArr[0], "答案1") != -1) {
      arr.push({
        index: _.indexOf(dbArr[0], "答案1")
      });
    }
    if (_.indexOf(dbArr[0], "答案2") != -1) {
      arr.push({
        index: _.indexOf(dbArr[0], "答案2")
      });
    }
    if (_.indexOf(dbArr[0], "答案3") != -1) {
      arr.push({
        index: _.indexOf(dbArr[0], "答案3")
      });
    }
    if (_.indexOf(dbArr[0], "答案4") != -1) {
      arr.push({
        index: _.indexOf(dbArr[0], "答案4")
      });
    }
    if (_.indexOf(dbArr[0], "答案5") != -1) {
      arr.push({
        index: _.indexOf(dbArr[0], "答案5")
      });
    }
    if (_.indexOf(dbArr[0], "答案6") != -1) {
      arr.push({
        index: _.indexOf(dbArr[0], "答案6")
      });
    }
    _.slice(dbArr, 1, dbArr.length).map((item2, index2) => {
      let newArr = [];
      arr.map(v => {
        newArr.push(item2[v.index]);
      });
      needArr.push(newArr);
    });
  }
  return needArr;
}

export default {
  /**
   * 课程详情入口
   * @author Han
   */
  entry(req, res, next) {
    let { id } = req.params;
    CourseDal.getCourse(id, (error, courses) => {
      if (error) {
        return myRender(req, res, '404');
      }
      let course = courses[0];
      course.totalTime /= 60;
      if (course)
        course.answer = courses[1];
      myRender(req, res, 'course/detail', { course });
    });
  },

  /**
   * 获取课程学习者列表
   * @author gs
   */
  getLearners(req, res, next) {
    CourseDal.learners(
      req.query.id,
      (err, data) => {
        if (err) {
          return next(err);
        }
        res.setHeader('Cache-Control', 'no-cache');
        res.json(data);
      }
    )
  },

  /**
   * 获取相关课程信息
   * @author gs
   */
  getRelevantCourse(req, res, next) {
    let header = req.headers.referer;
    let lastIndex = header.lastIndexOf("\/");
    let uncheck = header.substring(lastIndex + 1, header.length);
    CourseDal.relevantCourse(
      req.body.classify,
      (err, data) => {
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
    );
  },
  // 查询所有课程信息
  findAllCourse(req, res, next) {
    let header = req.headers.referer;
    let lastIndex = header.lastIndexOf("\/");
    let uncheck = header.substring(lastIndex + 1, header.length);
    CourseDal.findAllCourse(
      (err, data) => {
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
    );
  },
  /**
   * 获取课程介绍信息
   * @author gs
   */
  getCourseIntro(req, res, next) {
    CourseDal.courseIntro(
      req.query._id,
      (err, courseIntro) => {
        if (err) {
          return next(err);
        }
        res.setHeader('Cache-Control', 'no-cache');
        res.json(courseIntro);
      }
    );
  },
  /**
   * 获取课程目录信息
   * @author gs
   */
  getCourseCatalog(req, res, next) {
    CourseDal.courseCatalog(
      req.query._id,
      (err, courseCatalog) => {
        if (err) {
          return next(err);
        }
        res.setHeader('Cache-Control', 'no-Cache');
        res.json(courseCatalog);

      }
    );
  },
  /**
   * 获取课程问答信息
   * @author gs
   */
  getCourseQa(req, res, next) {
    CourseDal.courseQa(
      req.query.id,
      (err, courseQa) => {
        if (err) {
          return next(err);
        }
        res.setHeader('Cache-Control', 'no-cache');
        res.json(courseQa);
      }
    )
  },

  /**
   *课程页面入口
   *@author: wac
   */
  courseListEntry(req, res, next) {
    // console.log('----', req.query);
    res.setHeader('Cache-Control', 'no-Cache');
    myRender(req, res, 'course/course', { pageFrom: req.query.from });
  },

  /**
   * 课程列表页--根据条件获取课程总数
   * @author bs
   */
  courseListCount(req, res, next) {

    let courseType = req.query.courseType;
    let direction = req.query.direction;
    let filter = {};
    req.query.sercon ? filter.name = RegExp(req.query.sercon, 'i') : null;
    filter.state = 1;
    if (courseType != '全部') {
      filter.type = courseType;
    }

    if (direction != '全部') {
      filter.direction = direction;
    }

    if (req.query.teacherId) {
      filter.teacherId = req.query.teacherId;
    }

    CourseDal.courseListCount(
      filter,
      (err, courses) => {
        if (err) {
          return next(err);
        }
        res.setHeader('Cache-Control', 'no-Cache');
        res.json(courses);
      }
    );
  },

  /**
   * 课程列表页--根据条件获取课程信息(分页)
   * @author bs
   */
  courseList(req, res, next) {
    const ep = new eventproxy();
    let sort_sel = req.query.sortBy;
    let courseType = req.query.courseType;
    let direction = req.query.direction;
    let sortBy = {};
    let filter = {};
    let page = 1;
    let limit = 12;
    // console.log('------', req.query);
    req.query.sercon ? filter.name = RegExp(req.query.sercon, 'i') : null;
    filter.state = 1;
    if (courseType != '全部') {
      filter.classify = courseType;
    }

    if (direction != '全部') {
      filter.direction = direction;
    }
    if (req.query.teacherId) {
      filter.teacherId = req.query.teacherId;
    }

    sortBy = sort_sel == 'price' ? { 'price': 1 } :
      sort_sel == 'createAt' ? { 'createAt': -1 } :
        { 'purchaseCount': -1 };

    if (req.query.curPage && !isNaN(req.query.curPage)) {
      page = req.query.curPage;
    }

    if (req.query.limit && !isNaN(req.query.limit)) {
      limit = req.query.limit;
    }

    ep.all("count", "list", (count, list) => {
      res.setHeader('Cache-Control', 'no-Cache');
      // set count at response header
      if (validator.isInt(String(count))) {
        res.setHeader('x-total-count', count);
      }
      res.json(list);
    });
    CourseDal.courseList(
      filter,
      sortBy,
      Number(page),
      Number(limit),
      (err, courses) => {
        if (err) {
          return next(err);
        }
        courses.map(course => {
          if (course.isMicroCourse) {
            course.type = "微课程";
          } else {
            course.type = "系列课程";
          }
        });
        ep.emit("list", courses);

        // res.setHeader('Cache-Control', 'no-Cache');
        // res.json(courses);
      }
    );
    CourseDal.courseListCount(filter, (err, count) => {
      if (err) {
        return next(err);
      }
      ep.emit("count", count);
    });
  },

  /**
    *根据课程id获取课程
    *@author bs
    */
  getCourseById(req, res, next) {
    let courseId = req.query.courseId;
    CourseDal.getCourseById(courseId, (err, data) => {
      if (err) {
        return next(err);
      }
      res.setHeader('Cache-Control', 'no-Cache');
      res.json(data);
    })
  },

  /**
    *根据课程id删除课程
    *@author bs
    */
  delCourse(req, res, next) {
    let courseId = req.query.courseId;
    CourseDal.delCourse(courseId, (err, data) => {
      if (err) {
        return next(err);
      }
      res.setHeader('Cache-Control', 'no-Cache');
      res.json(data);
    })
  },

  /**
   * 获取课程分类信息
   * @author: wac
   */
  courseMenuList(req, res, next) {
    CourseDal.courseMenuList((err, data) => {
      if (err) {
        myRender(req, res, '400');
      } else {
        res.setHeader('Cache-control', 'no-cache');
        res.json(data);
      }
    });
  },

  /**
   * 随机获取推荐讲师信息
   * @author: wac
   */
  recommend(req, res, next) {
    let reCount = req.query.reCount;
    CourseDal.recommend(reCount, (err, data) => {
      if (err) {
        myRender(req, res, '400');
      } else {
        res.setHeader('Cache-control', 'no-cache');
        res.json(data);
      }
    });
  },

  /**
   * 获取人气课程信息
   * @author: wac
   */
  popCourse(req, res, next) {
    CourseDal.popCourse(req.session.domain, 'in', (err, data) => {
      if (err) {
        myRender(req, res, '400');
      } else {
        res.setHeader('Cache-control', 'no-cache');
        res.json(data);
      }
    });
  },

  /** 讲师端-课程管理界面入口
   * @author: bs
   */
  courseManageEntry(req, res, next) {
    let userId = req.session.user.id;
    let state = req.query ? req.query.state : "";
    myRender(req, res, 'course/courseManage', { layout: 'public_layout_expert', state: state });
  },

  /** 学员端-课程管理界面入口
   * @author: bs
   */
  myCourseEntry(req, res, next) {
    let userId = req.session.user.id;
    let isFrom = req.query ? req.query.isFrom : "";
    myRender(req, res, 'course/myCourse', { layout: 'public_layout_user', isFrom: isFrom });
  },

  /** 学员端-赠送课程界面入口
   * @author: bs
   */
  giveCourseEntry(req, res, next) {
    let userId = req.session.user.id;
    let orderId = req.query.orderId;

    orderDal.getOrderById(orderId, (err, order) => {
      let restLicense = order.itemLicense - order.licenseUsed;
      myRender(req, res, 'course/giveCourse', { order: order, restLicense: restLicense, layout: 'public_layout_user' });
    });
  },

  /** 学员端-获取用户所有课程信息(分页)
   * @author: bs
   */
  getMyCourses(req, res, next) {
    let filter = req.query.filter;
    let sortBy = {};
    let page = req.query.curPage;
    let limit = req.query.limit;
    CourseDal.boughtCourse(
      filter,
      sortBy,
      Number(page),
      Number(limit),
      (err, courses) => {
        if (err) {
          return next(err);
        }
        res.setHeader('Cache-Control', 'no-Cache');
        res.json(courses);
      }
    );
  },

  /** 学员端-获取用户所有课程信息(总数)
   * @author: bs
   */
  getMyCoursesCount(req, res, next) {
    let filter = req.query.filter;
    let sortBy = {};
    CourseDal.boughtCourseCount(
      filter,
      (err, count) => {
        if (err) {
          return next(err);
        }
        res.setHeader('Cache-Control', 'no-Cache');
        res.json(count);
      }
    );
  },

  /**
   * @author: bs
   */
  giveNewGiveCourse(req, res, next) {
    let filter = req.query.filter;
    CourseDal.giveNewGiveCourse(
      filter,
      (err, data) => {
        if (err) {
          return next(err);
        }
        res.setHeader('Cache-Control', 'no-Cache');
        res.json(data);
      }
    );
  },

  /** 讲师端-获取用户所有课程信息(分页)
   * @author: bs
   */
  getExpertCourses(req, res, next) {
    let filter = req.query.filter;
    let sortBy = { _id: -1 };
    let page = req.query.curPage;
    let limit = req.query.limit;
    // console.log('filter', filter);
    if (!filter.state)
      filter['state'] = { '$ne': 5 };

    CourseDal.courseList(
      filter,
      sortBy,
      Number(page),
      Number(limit),
      (err, courses) => {
        if (err) {
          return next(err);
        }
        res.setHeader('Cache-Control', 'no-Cache');
        //处理课程状态字段 -1=建设中(视频转码中) 0=建设中 1=售卖中 2=下架
        courses.map((course) => {
          console.log('-----', course.createAt, new Date(course.createAt).getDate());
          if (!course.state || course.state == "") {
            course.state = 0;
          }
          course.state = course.state == "-1" ? "视频转码中" :
            course.state == "0" ? "建设中" :
              course.state == "1" ? "售卖中" :
                course.state == "2" ? "违规下架" : "违规待审核";
        });
        res.setHeader('Cache-Control', 'no-Cache');
        res.json(courses);
      }
    );
  },
  /** 讲师端-课程管理页面获取用户所有课程信息(总数)
   * @author: bs
   */
  getExpertCoursesCount(req, res, next) {
    let filter = req.query.filter;
    let sortBy = {};
    CourseDal.courseListCount(
      filter,
      (err, count) => {
        if (err) {
          return next(err);
        }
        res.setHeader('Cache-Control', 'no-Cache');
        res.json(count);
      }
    );
  },

  /**
   * 专家发布课程的入口
   * @author: gs
   */
  PublishEntry(req, res, next) {
    let user = req.session.user;
    teacherDal.findOneUserIdByTeacher(user._id, (err, data) => {
      if (err) {
        return myRender(req, res, '404');
      } else {
        if (req.query.courseId) {
          let courseId = req.query.courseId;
          //根据courseId获取草稿信息
          CourseDal.getCourseById(courseId, (err, data) => {
            let cState;
            //测试数据处理
            if (!data.state) {
              cState = 1;
            } else {
              cState = data.state;
            }
            myRender(req, res, 'expert/expertPublish', { layout: 'public_layout_expert', courseId: courseId, courseState: cState, teacherId: data._id, title: '发布课程' });
          });
        } else {
          myRender(req, res, 'expert/expertPublish', { layout: 'public_layout_expert', teacherId: data._id, title: '发布课程' });
        }
      }
    });
  },
  /**
   * 专家发布微课程的入口
   * @author: gs
   */
  microCourseEntry(req, res, next) {
    let user = req.session.user;
    teacherDal.findOneUserIdByTeacher(user._id, (err, data) => {
      if (err) {
        return myRender(req, res, '404');
      } else {
        myRender(req, res, 'expert/expertMicroCourse', { layout: 'public_layout_expert', courseId: req.query.courseId, teacherId: data._id });
      }
    });
  },

  /**
   * 通过讲师id课程章节信息
   * @author:gs
   */
  getToc(req, res, next) {
    CourseDal.findToc(req.query.teacherId, (err, data) => {
      if (err) {
        return next(err);
      }
      res.setHeader('Cache-control', 'no-cache');
      res.json(data);
    });
  },
  /**
   * 保存系列课程
   * @author:gs
   */
  saveToc(req, res, next) {
    let course = req.body;
    course['domain'] = req.session.domain;
    CourseDal.addCourse(course, (err, data) => {
      if (err) {
        return next(err);
      }
      res.setHeader('Cache-control', 'no-cache');
      res.json(data);
    });
  },
  /**
   * 保存微课程
   * @author:gs
   */
  saveMicro(req, res, next) {
    const course = req.body;
    course['domain'] = req.session.domain;
    CourseDal.addMicroCourse(course, (err, data) => {
      if (err) {
        return next(err);
      }
      res.setHeader('Cache-control', 'no-cache');
      res.json(data);
    });
  },

  /**
   * 问答管理入口
   * @author: wac
   */
  answerManageEntry(req, res, next) {
    let expertId = req.session.user._id;
    let state = req.query ? req.query.state : "";
    myRender(req, res, 'course/answerManage', { layout: 'public_layout_expert', expertId, state: state });
  },

  /**
   * 我的问答入口
   * @author: bs
   */
  myQAEntry(req, res, next) {
    let userId = req.session.user._id;
    myRender(req, res, 'course/myAnswer', { layout: 'public_layout_user', userId });
  },

  /**
   * 我的偷看入口
   * @author: bs
   */
  myPeekEntry(req, res, next) {
    let userId = req.session.user._id;
    myRender(req, res, 'course/myPeek', { layout: 'public_layout_user', userId });
  },


  /**
   * 获取我的偷看
   * @author: bs
   */
  getMyPeek(req, res, next) {
    let curPage = req.query.curPage;
    let limit = req.query.limit;
    let filter = req.query.filter;
    CourseDal.getMyPeek(filter, { _id: -1 }, curPage, limit, (err, peeks) => {
      let ep = new eventproxy();
      if (err) {
        console.log("error", err);
        res.json({ "error": err });
      } else {
        if (peeks && peeks.length > 0) {
          ep.after('getPeekInfo', peeks.length, () => {
            res.setHeader('Cache-Control', 'no-cache');
            res.json(peeks);
          });
          peeks.map(peek => {
            let orderId = peek.orderId;
            let answerId = peek.answerId;

            orderDal.getMyPeekOrder(orderId, (err1, order) => {
              CourseDal.getMyAnswer(answerId, (err2, answer) => {
                if (err1 || err2)
                  peek.questionId = answer.questionId;
                peek.answererId = answer.answererId;
                peek.answererName = answer.answererName;
                peek.answererAvatar = `${config.avatorUrl}/vmooc/findPicOther/${answer.answererId}`;
                peek.peekCount = answer.peekCount;
                peek.ordersCode = answer.ordersCode;
                peek.createAt = new Date(order.createAt).toLocaleDateString();
                peek.itemName = order.itemName;
                peek.price = order.itemPrice;
                peek.sn = order.sn;
                ep.emit("getPeekInfo");
              });
            });

          });
        } else {
          peeks = [];
          res.setHeader('Cache-Control', 'no-cache');
          res.json(peeks);
        }

      }
    });
  },
  /**
   * 根据回答id得到问题id
   * @author: gs
   */
  findQuestionId(req, res, next) {
    let { answerId } = req.body;
    CourseDal.findQuestionId(answerId, (err, data) => {
      if (err) {
        return next(err);
      }
      res.setHeader('Cache-Control', 'no-cache');
      res.json(data);
    })
  },
  /**
   * 获取我的问题(总数)
   * @author: bs
   */
  getMyPeekCount(req, res, next) {
    let curPage = req.query.curPage;
    let limit = req.query.limit;
    let filter = req.query.filter;
    CourseDal.getMyPeekCount(filter, (err, count) => {
      if (err) {
        console.log("error", err);
        res.json({ "error": err });
      } else {
        res.setHeader('Cache-Control', 'no-cache');
        res.json(count);
      }
    });
  },

  /**
   * 获取我的问题
   * @author: bs
   */
  getMyQA(req, res, next) {
    let curPage = req.query.curPage;
    let limit = req.query.limit;
    let filter = req.query.filter;
    CourseDal.getMyQA(filter, { _id: -1 }, curPage, limit, (err, questions) => {
      if (err) {
        console.log("error", err);
        res.json({ "error": err });
      } else {
        questions.map(question => {
          question.status = question.state == 0 ? '未付款' :
            question.state == 1 ? '已付款待回答' :
              question.state == 2 ? '已回答' :
                question.state == 3 ? '已退款' : 'err';
          question.stateBtn = question.state == 3 ? { state: 3, btn: [{ event: 'del', field: '删除' }] } :
            { state: 0, btn: [] };
          question.createAt = new Date(question.createAt).toLocaleDateString();
          question.price = question.money;
          question.requiredAnswerAvatar = `${config.avatorUrl}/vmooc/findPicOther/${question.requiredAnswerId}`;
        });
        res.setHeader('Cache-Control', 'no-cache');
        res.json(questions);
      }
    });
  },

  /**
   * 获取我的问题总数
   * @author: bs
   */
  getMyQACount(req, res, next) {
    let filter = req.query.filter;
    CourseDal.getMyQACount(filter, (err, data) => {
      if (err) {
        myRender(req, res, '400');
      } else {
        res.setHeader('Cache-Control', 'no-cache');
        res.json(data);
      }
    });
  },

  /**
   * 获取专家的问题
   * @author: wac
   */
  expertAnswer(req, res, next) {
    let state = req.query.state;
    if (!state.state) {
      state.state = { $ne: 0 };
    }
    CourseDal.expertAnswer(
      state,
      req.query.curPage,
      req.query.limit,
      (err, data) => {
        if (err) {
          myRender(req, res, '400');
        } else {
          res.setHeader('Cache-control', 'no-cache');
          res.json(data);
        }
      })
  },

  /**
   * 获取专家的问题总数
   * @author: wac
   */
  expertAnswerCount(req, res, next) {
    let state = req.query.state;
    if (!state.state) {
      state.state = { $ne: 0 };
    }
    CourseDal.expertAnswerCount(state, (err, data) => {
      if (err) {
        myRender(req, res, '400');
      } else {
        res.setHeader('Cache-control', 'no-cache');
        res.json(data);
      }
    })
  },
  /**
   * 课程后台管理入口
   * @author: wac
   */
  cmEntry(req, res, next) {
    PartnerDal.findDomain((err, data) => {
      myRender(req, res, 'manage/courseManage', { layout: 'public_layout_cms', domains: data, title: '后台管理-课程管理' });
    })
  },

  /**
   * 后台课程管理查询
   * @author: wac
   */
  cmSelect(req, res, next) {
    let condition = req.query.condition;
    let curPage = Number(req.query.curPage);
    let limit = Number(req.query.limit);
    if (condition) {
      if (condition.$or) {
        condition.$or[0].name = RegExp(condition.$or[0].name);
        condition.$or[1].teacherName = RegExp(condition.$or[1].teacherName);
      }
    }
    let domain = req.session.domain;
    CourseDal.cmSelect(domain, condition, curPage, limit, (err, data) => {
      if (err) {
        myRender(req, res, '400');
      } else {
        res.setHeader('Cache-control', 'no-cache');
        res.json(data);
      }
    });
  },
  /**
 * 后台课程数据总数
 * @author: wac
 */
  cmSelectCount(req, res, next) {
    let condition = req.query.condition;
    if (condition) {
      if (condition.$or) {
        condition.$or[0].name = RegExp(condition.$or[0].name);
        condition.$or[1].teacherName = RegExp(condition.$or[1].teacherName);
      }
    }
    if (!(typeof condition == Object)) {
      condition = {};
    }
    condition['domain'] = req.session.domain;
    CourseDal.cmSelectCount(condition, (err, data) => {
      if (err) {
        myRender(req, res, '400');
      } else {
        res.setHeader('Cache-control', 'no-cache');
        res.json(data);
      }
    });
  },
  /**
   * 审核通过
   * @author: wac
   */
  audit(req, res, next) {
    let courseId = req.body.courseId;
    CourseDal.audit(courseId, (err, data) => {
      if (err) {
        myRender(req, res, '400');
      } else {
        res.setHeader('Cache-control', 'no-cache');
        res.json(data);
      }
    });
  },
  /**
   * 删除问题
   * @author: wac
   */
  delAnswer(req, res, next) {
    let qid = req.body.qid;
    CourseDal.delAnswer(qid, (err, data) => {
      if (err) {
        myRender(req, res, '400');
      } else {
        res.setHeader('Cache-control', 'no-cache');
        res.json(data);
      }
    });
  },

  /**
   * 违规下架
   * @author: wac
   */
  soldOut(req, res, next) {
    let soldOut = req.query.soldOut;
    CourseDal.soldOut(soldOut, (err, data) => {
      if (err) {
        myRender(req, res, '400');
      } else {
        if (data) {
          socketEvent.sendSystemMessage(data.teacherId, '课程下架通知', `您发布的课程《${data.name}》已被下架`, '/courseManage?state=2');
          //推送系统消息
          let message = {
            type: 'course',
            content: `您发布的课程《${data.name}》已被下架`,
            userId: data.teacherId,
            url: '/courseManage?state=2',
            state: 0,
            createAt: new Date(),
          }
          let newMessage = new Messages(message);
          newMessage.save();
        }
        res.setHeader('Cache-control', 'no-cache');
        res.json(data);
      }
    });
  },

  /**
   * 刷新课程视频转码状态
   * @author: bs
   */
  refreshCourse(req, res, next) {
    let courseId = req.query.courseId;
    let cidx = req.query.cidx;
    let index = req.query.index;
    let videoPath = req.query.videoPath;
    let time = req.query.time;
    let size = req.query.size;
    CourseDal.refreshCourse(courseId, time, size, cidx, index, videoPath, (err, data) => {
      if (err) {
        res.json(err);
      } else {
        res.setHeader('Cache-control', 'no-cache');
        res.json(data);
      }
    });
  },
  /**
   *查询课程是否购买
   *@author:gs
   */
  findIsBuy(req, res, next) {
    let { userId } = req.body;
    let { courseId } = req.body;
    CourseDal.findIsBuy(
      userId, courseId, (err, data) => {
        if (err) {
          return next(err);
        }
        res.setHeader('Cache-control', 'no-cache');
        res.json(data);
      })
  },
  // 查询是否购买课程
  findIsBuyCourse(req, res, next) {
    let { userId } = req.body;
    let { questionid } = req.body;
    CourseDal.findIsBuyCourse(
      userId, questionid, (err, data) => {
        if (err) {
          return next(err);
        }
        res.setHeader('Cache-control', 'no-cache');
        res.json(data);
      }
    )
  },
  // 获取偷看的个数
  findpeekCount(req, res, next) {
    let { answersId } = req.body;
    CourseDal.findpeekCount(
      answersId, (err, data) => {
        if (err) {
          res.json(err);
          return;
        }
        res.setHeader('Cache-control', 'no-cache');
        res.json(data);
      }
    )
  },
  //根据课程id用户id获取我的课程信息
  getMyCourseByInfo(req, res, next) {
    let courseId = req.query.courseId;
    let userId = req.session.user._id;
    CourseDal.getMyCourseByInfo(courseId, userId, (err, data) => {
      if (err) {
        res.json(err);
        return;
      }
      res.setHeader('Cache-control', 'no-cache');
      res.json(data);
    });
  },

  //更新学习进度
  updateStudySpeed(req, res, next) {
    let courseId = req.query.courseId;
    let userId = req.session.user._id;
    let cidx = req.query.cidx;
    let index = req.query.index;
    let playTime = req.query.playTime;
    let totalTime = req.query.totalTime;
    CourseDal.updateStudySpeed(req.query.progress, courseId, userId, cidx, index, playTime, totalTime, (err, data) => {
      if (err) {
        res.json(err);
        return;
      }
      res.setHeader('Cache-control', 'no-cache');
      res.json(data);
    });
  },

  /**
  * 偷看我的入口
  * @author: gs
  */
  peekMeEntry(req, res, next) {
    let userId = req.session.user._id;
    myRender(req, res, 'course/peekMe', { layout: 'public_layout_user', userId });
  },

  /**
   * 获取偷看我的数据
   * @author: gs
   */
  // 讲师可查看
  getPeekMe(req, res, next) {
    let curPage = req.query.curPage;
    let limit = req.query.limit;
    let guserId = req.session.user._id;
    orderDal.getPeekMe(guserId, { _id: -1 }, curPage, limit, (err1, peeks) => {
      let ep = new eventproxy();
      if (err1) {
        res.json({ "error1": err1 });
      } else if (peeks && peeks.length > 0) {
        ep.after('getPeekInfo', peeks.length, () => {
          res.setHeader('Cache-Control', 'no-cache');
          res.json(peeks);
        });
        peeks.map(peek => {
          let orderId = peek._id;
          let answersId = peek.itemId;
          CourseDal.getMyQuestion(answersId, (err2, question) => {
            peek.questionId = question.questionId;
            peek.answererId = peek.payerId;
            peek.answererName = peek.payerName;
            peek.answererAvatar = `${config.avatorUrl}/vmooc/findPicOther/${peek.payerId}`;
            peek.peekCount = question.peekCount;
            peek.ordersCode = question.ordersCode;
            peek.createAt = new Date(question.createAt).toLocaleDateString();
            peek.itemName = peek.itemName;
            peek.price = peek.itemPrice;
            peek.sn = peek.sn;
            ep.emit("getPeekInfo");
          });
        });
      } else {
        peeks = [];
        res.setHeader('Cache-Control', 'no-cache');
        res.json(peeks);
      }
    });
  },
  /**
   * 获取我的问题(总数)
   * @author: gs
   */
  getPeekMeCount(req, res, next) {
    let curPage = req.query.curPage;
    let limit = req.query.limit;
    let { userId } = req.query.filter;
    CourseDal.getPeekMeCount(userId, (err, count) => {
      if (err) {
        console.log("error", err);
        res.json({ "error": err });
      } else {
        res.setHeader('Cache-Control', 'no-cache');
        res.json(count);
      }
    });
  },
  /**
   * 收藏功能
   * @author: wac
   */
  enshrine(req, res, next) {
    let userID = req.body.userID;
    let courseID = req.body.courseID;
    CourseDal.enshrineCourse(userID, courseID, (err, data) => {
      if (err) {
        console.log("error", err);
        res.json({ "error": err });
      } else {
        res.setHeader('Cache-Control', 'no-cache');
        res.json(data);
      }
    });
  },
  /**
   * 是否收藏
   * @author: wac
   */
  isEnshrine(req, res, next) {
    let userID = req.query.userID;
    let courseID = req.query.courseID;
    CourseDal.isEnshrine(userID, courseID, (err, count) => {
      if (err) {
        console.log("error", err);
        res.json({ "error": err });
      } else {
        res.setHeader('Cache-Control', 'no-cache');
        res.json(count);
      }
    });
  },
  /**
   * 取消收藏
   * @author: wac
   */
  delEnshrine(req, res, next) {
    let userID = req.query.userID;
    let courseID = req.query.courseID;
    CourseDal.delEnshrine(userID, courseID, (err, data) => {
      if (err) {
        console.log("error", err);
        res.json({ "error": err });
      } else {
        res.setHeader('Cache-Control', 'no-cache');
        res.json(data);
      }
    });
  },
  /**
   * 我的收藏入口
   * @author: wac
   */
  enshrineEntry(req, res, next) {
    myRender(req, res, 'enshrine/enshrine', { layout: 'public_layout_user' });
  },
  /**
   * 我的收藏
   * @author: wac
   */
  myEnshrine(req, res, next) {
    let userID = req.query.userID;
    let curPage = Number(req.query.curPage);
    let limit = Number(req.query.limit);
    CourseDal.myEnshrine(userID, curPage, limit, (err, data) => {
      if (err) {
        console.log("error", err);
        res.json({ "error": err });
      } else {
        res.setHeader('Cache-Control', 'no-cache');
        res.json(data);
      }
    });
  },
  /**
   * 我的收藏数量
   * @author: wac
   */
  enshrineCount(req, res, next) {
    let userID = req.query.userID;
    CourseDal.enshrineCount(userID, (err, data) => {
      if (err) {
        console.log("error", err);
        res.json({ "error": err });
      } else {
        res.setHeader('Cache-Control', 'no-cache');
        res.json(data);
      }
    });
  },

  test(req, res, next) {
    console.log('req', req.query);
    res.setHeader('Cache-Control', 'no-cache');
    res.json({ note: 'ok' });
  },
  /**
   * @param {any} req 
   * @param {any} res 
   * @param {any} next 
   */
  promoCodeEntry(req, res, next) {
    let userId = req.session.user.id;
    let state = req.query ? req.query.state : "";
    myRender(req, res, 'course/promoCode', { layout: 'public_layout_expert', title: '促销中心' });
  },
  /**
   * 查询讲师课程
   */
  getCodeCourses(req, res, next) {
    let filter = req.query.filter;
    let sortBy = { _id: -1 };
    let page = req.query.curPage;
    let limit = req.query.limit;
    CourseDal.courseList(
      filter,
      sortBy,
      Number(page),
      Number(limit),
      (err, courses) => {
        if (err) {
          return next(err);
        }
        courses.map((course) => {
          course.state = "售卖中";
        });
        CourseDal.courseListCount(filter, (err, count) => {
          if (err) {
            return next(err);
          }
          res.setHeader('Cache-Control', 'no-Cache');
          res.json({ courses, count });
        }
        );
      });
  },

  // 验证优惠码是否正确
  checkPromoCode(req, res, next) {
    let { courseId, promoCode, useCount } = req.query;
    CourseDal.checkPromoCode(courseId, promoCode, useCount, (err, data) => {
      if (err) {
        return next(err);
      }
      res.setHeader('Cache-Control', 'no-Cache');
      res.json(data);
    });
  },
  // 查询优惠码详情
  getCodesByCourseId(req, res, next) {
    let { courseId } = req.query;
    CourseDal.getCodesByCourseId(courseId, (err, data) => {
      if (err) {
        return next(err);
      }
      res.setHeader('Cache-Control', 'no-Cache');
      res.json(data);
    })
  },
  // 生成优惠码
  saveCodeByCourseId(req, res, next) {
    let { courseId, code, count } = req.query;
    CourseDal.saveCodeByCourseId(courseId, code, Number(count), (err, data) => {
      if (err) {
        return next(err);
      }
      res.setHeader('Cache-Control', 'no-Cache');
      res.json(data);
    })
  },
  // 查询系统优惠码次数
  findNumber(req, res, next) {
    CourseDal.findNumber((err, data) => {
      if (err) {
        return next(err);
      }
      res.setHeader('Cache-Control', 'no-Cache');
      res.json(data);
    });
  },
  // 查询当前课时是否有题库
  showExamByClazz(req, res, next) {
    let { examTplId } = req.query;
    CourseDal.showExamByClazz(examTplId, (err, data) => {
      if (err) {
        return next(err);
      }
      res.setHeader('Cache-Control', 'no-Cache');
      res.json(data);
    })
  },
  // 保存试题
  saveExamByClazz(req, res, next) {
    let { data } = req.body;
    CourseDal.saveExamByClazz(data, (err, result) => {
      if (err) {
        return next(err);
      }
      res.setHeader('Cache-Control', 'no-Cache');
      res.json(result);
    });
  },
  // 保存学生试卷
  saveStudentExam(req, res, next) {
    let { studentExam } = req.body;
    studentExam.questions.map(que => {
      if (_.isEqual(que.result, que.answers)) {
        studentExam.score += 10;
      }
      return que;
    });
    CourseDal.saveStudentExam(studentExam, (err, data) => {
      if (err) {
        return next(err);
      }
      res.setHeader('Cache-Control', 'no-cache');
      res.json(data);
    });
  },
  // 查询学生往期成绩
  queryPreScore(req, res, next) {
    let { courseId, userId, examTplId } = req.query;
    CourseDal.queryPreScore(courseId, userId, examTplId, (err, data) => {
      if (err) {
        return next(err);
      }
      res.setHeader('Cache-Control', 'no-cache');
      res.json(_.orderBy(data, ['score'], ['desc'])[0]);
    });
  },
  // 查询学生成绩详情
  queryStudyRecord(req, res, next) {
    let mycourseData = req.body;
    // console.log("mycourseData" + mycourseData);
    CourseDal.queryStudyRecord(mycourseData, (err, data) => {
      if (err) {
        return next(err);
      }
      if(data === null){
        return;
      }
      res.setHeader('Cache-Control', 'no-cache');
      res.json(data);
    });
  },

  // 查询其他学员的学习成绩详情
  queryOtherStudyRecord(req, res, next) {
    let orderData = req.body;
    CourseDal.queryOtherStudyRecord(orderData, (err, data) => {
      if (err) {
        return next(err);
      }
      // console.log('data', data);
      res.setHeader('Cache-Control', 'no-cache');
      res.json(data);
    });
  },

  // 读取视频文件
  readVideoFile(req, res, next) {
    const path = req.query.path;
    const options = {
      url: `${config.videoStoreUrl}${path}`,
      method: req.method,
      headers: req.headers
    };
    req.pipe(request(options)).pipe(res);
  },

  //导入excel试题文件
  uploadExcel(req, res, next){
    const ep = new eventproxy();
    const folderPath = `upload/examExcel/`;
     ep.on('folder_exist', () => {
      let form = new formidable.IncomingForm();
      form.encoding = 'utf-8';
      form.uploadDir = folderPath;
      form.keepExtensions = true;
      form.parse(req, (err, fields, files) => {
        // console.log( fields, files.file.path);
        if (err) {
          return next(err);
        }
        let arr = xlsx.parse(files.file.path);
        arr = handleExcel(arr[0].data);
        res.setHeader('Cache-Control', 'no-cache');
        res.json({ files, arr });
      });
    });
    fs.exists(folderPath, (exists) => {
      if (exists) {
        return ep.emit('folder_exist');
      }
      mkdirp(folderPath, (err) => {
        if (err) {
          return next(err);
        }
        ep.emit('folder_exist');
      });
    });
  },

  //导出试题excel
  downloadExcel(req, res, next){
    const ep = new eventproxy();
    var data = JSON.parse(req.body.result);
    var sheetname = req.body.sheetname;
    var buffer = xlsx.build([{ name: sheetname, data: data }]);
    // const time = new Date().getTime();
    var folder = 'upload/examExcel';
    var path = 'upload/examExcel/' + req.session.user._id + '.xlsx';
    ep.on("folder_exist", () => {
        fs.writeFileSync(path, buffer, 'binary');
        res.json({ "path": path });
    })
    fs.exists(folder, (exists) => {
        if (exists) {
            return ep.emit('folder_exist');
        }

        mkdirp(folder, (err) => {
            if (err) return next(err);
            ep.emit('folder_exist');
        });
    });
  }

};