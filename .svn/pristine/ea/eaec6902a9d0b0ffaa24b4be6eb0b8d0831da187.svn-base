import { myRender } from './common';
import cmsDal from '../dal/cmsDal';
import eventproxy from 'eventproxy';
import formidable from 'formidable';
import fs from 'fs';
import _ from 'lodash';
import mkdirp from 'mkdirp';
import config from '../config';
import path from 'path';
import courseDal from '../dal/courseDal';
import expertDal from '../dal/expertDal';
import enumCodeDal from '../dal/enumCodeDal';
import courseCollectionDal from '../dal/courseCollectionDal';
import userapp from '../user/userapp';
import validator from 'validator';
import utils from '../middlewares/utils';
import laundryDal from '../dal/laundryListDal';
// import imageMagic from 'image-magic';
// import im from 'imagemagick';
// import sharp from 'sharp';
// import images from 'images';
import socketServer from '../socket.js';
import PartnerDal from '../dal/partnerDal';

export default {
  /**
   * 获取管理权限
   * @author: shen
   */
  getCmsModule(req, res, next) {
    const _id = req.session.user._id;
    const companyId = req.session.user.company_code;

    if (req.session.user && req.session.user.cmsModule) {
      return next();
    }

    cmsDal.getUserRights(_id, req.session.domain, (err, result) => {
      req.session.user.cmsModule = result;
      next();
    });
  },
  /**
   * 后台管理入口
   * @author: shen
   */
  entry(req, res, next) {
    // const cmsModule = await getRights(_id, companyId);

    // throw new Error('aaaa');
    myRender(req, res, 'cms/index', { layout: 'public_layout_cms', title: '视频课程后台管理' });
  },

  RECentry(req, res, next) {
    myRender(req, res, 'cms/recommend', { layout: 'public_layout_cms', title: '后台管理-推荐位管理' });
  },

  //课程管理页入口
  cmsCourseManageEntry(req, res, next) {
    myRender(req, res, 'cms/courseManage', { layout: 'public_layout_cms', title: '后台管理-问答管理' });
  },

  //课程订单管理页入口
  cmsOrderManageEntry(req, res, next) {
    enumCodeDal.getclassify(
      (err1, data) => {
        if (err1) {
          return next(err1);
        }
        PartnerDal.findDomain(
          (err2, domains) => {
            if (err2) {
              return next(err2);
            }
            myRender(req, res, 'cms/orderManage', { classify: data[0].values, direction: data[1].values, domains: domains, layout: 'public_layout_cms', title: '后台管理-订单管理' });
          }
        )
      }
    )
  },

  /**
   * 后台课程管理--根据条件获取课程信息(分页)
   * @author bs
   */
  cmsCourseList(req, res, next) {
    let filter = req.query.filter;
    let page = req.query.curPage;
    let limit = req.query.limit;
    let sort = {};
    filter['domain'] = req.session.domain;
    courseDal.courseList(
      filter,
      sort,
      Number(page),
      Number(limit),
      (err, courses) => {
        if (err) {
          return next(err);
        }

        courses.map(course => {
          course.type = course.isMicroCourse ? "微课程" : "系列课程";
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

  //问答管理页入口
  cmsQAManageEntry(req, res, next) {
    PartnerDal.findDomain((err, domains) => {
      if (err) {
        return next(err);
      }
      myRender(req, res, 'cms/QAManage', { layout: 'public_layout_cms', title: '后台管理-问答管理', domains: domains });
    });
  },

  //偷看管理页入口
  cmsPeekManageEntry(req, res, next) {
    PartnerDal.findDomain((err, domains) => {
      if (err) {
        return next(err);
      }
      myRender(req, res, 'cms/peekManage', { layout: 'public_layout_cms', title: '后台管理-偷看管理', domains: domains });
    });
  },

  //专题管理页入口
  cmsCollectionManageEntry(req, res, next) {
    PartnerDal.findDomain((err, domains) => {
      if (err) {
        return next(err);
      }
      myRender(req, res, 'cms/collectionOrderManage', { layout: 'public_layout_cms', title: '后台管理-专题管理', domains: domains });
    });
  },


  /** 获取推荐管理信息 */
  getrecommend(req, res, next) {
    const page = req.query.page;
    cmsDal.getrecommend(page, (err, data) => {
      res.setHeader('Cache-Control', 'no-cache');
      res.json(data);
    });
  },

  //上传文件
  upload(req, res, next) {
    const folder = `upload/focuspic`;
    const ep = new eventproxy();

    ep.on('folder_exist', () => {
      let form = new formidable.IncomingForm();
      form.encoding = 'utf-8';
      form.uploadDir = folder;
      form.keepExtensions = true;
      form.maxFieldsSize = 2 * 1024 * 1024;
      form.parse(req, function (err, fields, files) {
        if (err) {
          return next(err);
        }

        let path = files.file.path;
        let nPath = utils.getImgPath(path, 100, 100);
        // sharp(path)
        //   .resize(960)
        //   .toFile(nPath, err => {
        //     if (err) {
        //       console.log('----', err);
        //     }
        //     res.writeHead(200, {'content-type': 'text/plain'});
        //     res.end(JSON.stringify({path: nPath}));
        //   });
        res.writeHead(200, { 'content-type': 'text/plain' });
        res.end(JSON.stringify({ path }));
      });
    });

    fs.exists(folder, (exists) => {
      if (exists) {
        return ep.emit('folder_exist');
      }
      mkdirp(folder, (err) => {
        if (err) {
          return next(err);
        }
        ep.emit('folder_exist');
      });
    });

  },

  /** 读取上传文件 */
  getupload(req, res, next) {
    const module = req.params.module;
    const name = req.params.name;
    console.log("module", name);

    const path = `upload/${module}/${name}`;
    fs.exists(path, (exists) => {
      if (exists) {
        let disposition = 'attachment; filename=' + encodeURI(name);
        res.writeHead(200, {
          'Content-Type': 'application/force-download',
          'Content-Disposition': disposition
        });
        var stream = fs.createReadStream(path, { flags: 'r' });
        stream.pipe(res);
        stream.on('end', function () {
          return res.end();
        }).on('error', function (err) {
          logger.error('error=', err);
        });
      } else {
        res.end();
      }
    });
  },

  /** 上传焦点图 */
  applyfocuspic(req, res, next) {
    const content = req.body;
    content['platform'] = req.session.domain;
    cmsDal.applyfocuspic(content, (err, result) => {
      res.setHeader('Cache-Control', 'no-cache');
      res.json(result);
    });
  },

  /** 获取焦点图 */
  getfocuspic(req, res, next) {
    const platform = req.session.domain;
    cmsDal.getfocuspic(platform, (err, result) => {
      res.setHeader('Cache-Control', 'no-cache');
      res.json(result);
    });
  },

  /** 推荐课程 */
  applyrecommendcourse(req, res, next) {
    const cId = req.body.cId;
    let isRecommend = req.body.isRecommend;

    isRecommend = isRecommend === "recommend" ? true : false;
    courseDal.applyrecommendcourse(cId, isRecommend, (err, data) => {
      res.setHeader('Cache-Control', 'no-cache');
      res.json(data);
    });
  },

  /** 获取所有课程 */
  getallcourses(req, res, next) {
    const ep = new eventproxy();
    console.log('====', req.query);
    ep.fail(err => res.json({ error: err }));
    req.query['domain'] = req.session.domain;
    ep.all('get_count', 'get_list', (count, list) => {
      res.setHeader('Cache-Control', 'no-cache');

      // set count at response header
      if (validator.isInt(String(count))) {
        res.setHeader('x-total-count', count);
      }

      res.json(list);
    });

    // get count
    if (req.query.fetch_total == 'true') {
      courseDal.count(req.query, ep.done('get_count'));
    } else {
      ep.emit('get_count', null);
    }
    // query list
    courseDal.list(req.query, ep.done('get_list'));
  },

  //获取课程数量
  getcoursescount(req, res, next) {
    courseDal.count(req.query, (err, count) => {
      res.setHeader('Cache-Control', 'no-cache');
      res.json(count);
    });
  },

  /** 获取所有专家 */
  getallexperts(req, res, next) {
    const ep = new eventproxy();
    ep.fail(err => res.json({ error: err }));
    req.query['domain'] = req.session.domain;
    ep.all('get_count', 'get_list', (count, list) => {
      res.setHeader('Cache-Control', 'no-cache');

      // set count at response header
      if (validator.isInt(String(count))) {
        res.setHeader('x-total-count', count);
      }

      res.json(list);
    });

    // get count
    if (req.query.fetch_total == 'true') {
      expertDal.count(req.query, ep.done('get_count'));
    } else {
      ep.emit('get_count', null);
    }
    // query list
    expertDal.list(req.query, ep.done('get_list'));
  },

  //获取专家数量
  getexpertscount(req, res, next) {
    expertDal.count(req.query, (err, count) => {
      res.setHeader('Cache-Control', 'no-cache');
      res.json(count);
    });
  },

  /** 推荐专家 */
  applyrecommendexpert(req, res, next) {
    const cId = req.body.cId;
    let isRecommend = req.body.isRecommend;

    isRecommend = isRecommend === "recommend" ? true : false;
    expertDal.applyrecommendcourse(cId, isRecommend, (err, data) => {
      res.setHeader('Cache-Control', 'no-cache');
      res.json(data);
    });
  },

  /** 获取所有专题 */
  getallcourseCollection(req, res, next) {
    const ep = new eventproxy();
    ep.fail(err => res.json({ error: err }));
    req.query['domain'] = req.session.domain;
    ep.all('get_count', 'get_list', (count, list) => {
      res.setHeader('Cache-Control', 'no-cache');

      // set count at response header
      if (validator.isInt(String(count))) {
        res.setHeader('x-total-count', count);
      }

      res.json(list);
    });

    // get count
    if (req.query.fetch_total == 'true') {
      courseCollectionDal.count(req.query, ep.done('get_count'));
    } else {
      ep.emit('get_count', null);
    }
    // query list
    courseCollectionDal.list(req.query, ep.done('get_list'));
  },

  //获取专题数量
  getcourseCollectioncount(req, res, next) {
    req.query['domain'] = req.session.domain;
    courseCollectionDal.count(req.query, (err, count) => {
      res.setHeader('Cache-Control', 'no-cache');
      res.json(count);
    });
  },

  /** 推荐专题 */
  applyrecommendcourseCollection(req, res, next) {
    const cId = req.body.cId;
    let isRecommend = req.body.isRecommend;

    isRecommend = isRecommend === "recommend" ? true : false;
    courseCollectionDal.applyrecommendcourse(cId, isRecommend, (err, data) => {
      res.setHeader('Cache-Control', 'no-cache');
      res.json(data);
    });
  },

  /** 更改用户密码 */
  editUserPwd(req, res, next) {
    const userId = req.body.userId;
    const password = req.body.password;
    res.setHeader('Cache-Control', 'no-cache');

    if (!userId || !password) {
      return res.json({ error: '没有信息，请重新尝试' });
    }

    userapp.editUserPwd(userId, password, (err, result) => {
      if (err) {
        return res.json(err);
      }
      return res.json(result);
    });
  },

  /** 账户流水管理 */
  laundryManageEntry(req, res, next) {
    myRender(req, res, 'cms/laundryManage', { layout: 'public_layout_cms' });
  },

  /** 读取流水列表 */
  getlaundrylist(req, res, next) {
    const ep = new eventproxy();
    ep.fail(err => res.json({ error: err }));
    req.query['domain'] = req.session.domain;
    ep.all('get_count', 'get_list', (count, list) => {

      res.setHeader('Cache-Control', 'no-cache');
      if (count && count[0]) {
        const countresult = count[0].count;
        // set count at response header
        if (validator.isInt(String(countresult))) {
          res.setHeader('x-total-count', countresult);
        }
      }
      res.json(list);
    });

    // get count
    if (req.query.fetch_total == 'true') {
      laundryDal.getAllLaundryCount(req.query, ep.done('get_count'));
    } else {
      ep.emit('get_count', null);
    }
    // query list
    laundryDal.getAllLaundryList(req.query, ep.done('get_list'));
  },

  /** 统计流水 */
  statisticTotal(req, res, next) {
    req.query['domain'] = req.session.domain;
    laundryDal.statisticTotal(req.query, (err, result) => {
      socketServer.io.emit("test", "tetstsssss");
      res.setHeader('Cache-Control', 'no-cache');
      res.json(result);
    })
  },


  /** 后台管理 - 平台收入管理入口 */
  incomeManageEntry(req, res, next) {
    myRender(req, res, 'cms/incomemanage', { layout: 'public_layout_cms', title: '视频课程后台管理' });
  },

  /** 收入统计 */
  incomeStatisticList(req, res, next) {
    req.query['domain'] = req.session.domain;
    laundryDal.incomestatisticTotal(req.query, (err, result) => {
      // socketServer.io.emit("test", "tetstsssss");
      res.setHeader('Cache-Control', 'no-cache');
      res.json(result);
    })
  },

  /** 读取收入列表 */
  getincomelist(req, res, next) {
    const ep = new eventproxy();
    ep.fail(err => res.json({ error: err }));
    req.query['domain'] = req.session.domain;
    ep.all('get_count', 'get_list', (count, list) => {

      res.setHeader('Cache-Control', 'no-cache');
      if (count && count[0]) {
        const countresult = count[0].count;
        // set count at response header
        if (validator.isInt(String(countresult))) {
          res.setHeader('x-total-count', countresult);
        }
      }
      res.json(list);
    });

    // get count
    if (req.query.fetch_total == 'true') {
      laundryDal.getAllIncomeCount(req.query, ep.done('get_count'));
    } else {
      ep.emit('get_count', null);
    }
    // query list
    laundryDal.getAllIncomeList(req.query, ep.done('get_list'));
  },

  // 合作方管理入口
  joinPartner(req, res, next) {
    myRender(req, res, 'cms/joinPartner', { layout: 'public_layout_cms', title: '视频课程后台管理' });
  },
  // 合作方管理的列表
  partnerlist(req, res, next) {
    const ep = new eventproxy();
    ep.fail(err => res.json({ error: err }));
    ep.all('get_count', 'get_list', (count, list) => {
      if (req.query.fetch_total && count && validator.isInt(String(count))) {
        res.setHeader('x-total-count', count);
      }
      res.setHeader('Cache-Control', 'no-Cache');
      res.json(list);
    });
    if (req.query.fetch_total == 'true') {
      cmsDal.count(req.query, ep.done('get_count'));
    } else {
      ep.emit('get_count', null);
    }
    cmsDal.list(req.query, ep.done('get_list'));
  },
  // 保存合作方
  saveOrEdit(req, res, next) {
    let {partner} = req.body;
    partner['opId'] = req.session.user._id;
    partner['opName'] = req.session.user.name;
    cmsDal.savePartner(partner, (err, data) => {
      if (err) {
        return next(err);
      }
      res.setHeader('Cache-Control', 'no-cache');
      res.json(data);
    });
  },
  // 删除合作方
  delPartner(req, res, next) {
    let {domain} = req.body;
    cmsDal.delPartner(domain, (err, data) => {
      if (err) {
        return next(err);
      }
      if (data.nModified == 1) {
        cmsDal.delNav(domain, (err, data1) => {
          res.setHeader('Cache-Control', 'no-cache');
          res.send('success');
        });
      } else {
        res.setHeader('Cache-Control', 'no-cache');
        res.send('fail');
      }
    })
  },
  //合作方域名修改、配置域名修改
  editNavDomain(req, res, next) {
    let {oldDomain, newDomain} = req.body;
    cmsDal.editNavDomain(oldDomain, newDomain, (err, data) => {
      res.setHeader('Cache-Control', 'no-cache');
      res.send(data);
    });
  },
  // 前台网页配置
  frontDeploy(req, res, next) {
    myRender(req, res, 'cms/frontDeploy', { layout: 'public_layout_cms', title: '视频课程后台管理' });
  },
  // 顶部配置查询
  editNav(req, res, next) {
    let {domain} = req.session;
    cmsDal.getNav(domain, (err, data) => {
      if (err) {
        return next(err);
      }
      res.setHeader('Cache-Control', 'no-cache');
      res.json(data);
    });
  },
  // 顶部配置新增
  addNav(req, res, next) {
    console.log('req,,,,', req.body);
    let navInfo = {};
    navInfo['opId'] = req.session.user._id;
    navInfo['opName'] = req.session.user.name;
    navInfo['domain'] = req.body.domain;
    navInfo['iterms'] = [{
      title: "",
      link: "",
      direct: 0
    }, {
      title: "",
      link: "",
      direct: 1
    }];
    navInfo['qrcode'] = "";
    navInfo['qrintro'] = "";
    navInfo['logo'] = "/images/default.png";
    cmsDal.addNav(navInfo, (err, data) => {
      if (err) {
        return next(err);
      }
      res.setHeader('Cache-Control', 'no-cache');
      res.json(data);
    });
  },
  // 修改二维码
  modifyQrCode(req, res, next) {
    const folder = `upload/QrCode`;
    const ep = new eventproxy();
    ep.on('folder_exist', () => {
      let form = new formidable.IncomingForm();
      form.encoding = 'utf-8';
      form.uploadDir = folder;
      form.keepExtensions = true;
      form.maxFieldsSize = 1024 * 1024;
      form.parse(req, function (err, fields, files) {
        if (err) {
          return next(err);
        }
        let path = '';
        for (let file in files) {
          path = files[file].path;
        }
        res.writeHead(200, { 'content-type': 'text/plain' });
        res.end(JSON.stringify({ path }));
      });
    });
    fs.exists(folder, (exists) => {
      if (exists) {
        return ep.emit('folder_exist');
      }
      mkdirp(folder, (err) => {
        if (err) {
          return next(err);
        }
        ep.emit('folder_exist');
      });
    });
  },
  // 修改logo
  modifylogo(req, res, next) {
    const folder = `upload/Logo`;
    const ep = new eventproxy();
    ep.on('folder_exist', () => {
      let form = new formidable.IncomingForm();
      form.encoding = 'utf-8';
      form.uploadDir = folder;
      form.keepExtensions = true;
      form.maxFieldsSize = 1024 * 1024;
      form.parse(req, function (err, fields, files) {
        if (err) {
          return next(err);
        }
        let path = '';
        for (let file in files) {
          path = files[file].path;
        }
        res.writeHead(200, { 'content-type': 'text/plain' });
        res.end(JSON.stringify({ path }));
      });
    });
    fs.exists(folder, (exists) => {
      if (exists) {
        return ep.emit('folder_exist');
      }
      mkdirp(folder, (err) => {
        if (err) {
          return next(err);
        }
        ep.emit('folder_exist');
      });
    });
  },
  // 获取底部配置
  bottomNav(req, res, next) {
    let {domain} = req.session;
    cmsDal.bottomNav(
      domain, (err, data) => {
        if (err) {
          return next(err);
        }
        _.remove(data.iterms, { direct: 0 });
        res.setHeader('Cache-Control', 'no-cache');
        res.json(data.iterms);
      }
    )
  },
  // 修改配置
  edit(req, res, next) {
    let {domain} = req.session;
    let {navigation} = req.body;
    cmsDal.editTop(
      domain, navigation, (err, data) => {
        if (err) {
          return next(err);
        }
        res.setHeader('Cache-Control', 'no-cache');
        res.json(data);
      }
    )
  },

  // 根据域名读取配置
  getRightsByDomain(req, res, next) {
    const domain = req.query.domain;

    cmsDal.getRightsByDomain(domain, (err, rights) => {
      console.log('rights', rights);
      res.setHeader('Cache-Control', 'no-cache');
      res.json(rights);
    });
  },

  /** 根据域名修改权限 */
  editRightsByDomian(req, res, next) {
    const ep = new eventproxy();
    const domain = req.body.domain;
    const rights = req.body.rights;
    const deducts = req.body.deducts;
    ep.all('right', 'deduct', (r, d) => {
      res.setHeader('Cache-Control', 'no-cache');
      res.json({r, d});
    });

    /** 修改权限 */
    cmsDal.editRightsByDomian(domain, rights, (err, rightRuest) => {
      ep.emit('right', rightRuest);
    });

    /** 修改分成设置 */
    cmsDal.editDeductByDomain(domain, deducts, (err, deductRuest) => {
      ep.emit('deduct', deductRuest);
    });
  }

}



