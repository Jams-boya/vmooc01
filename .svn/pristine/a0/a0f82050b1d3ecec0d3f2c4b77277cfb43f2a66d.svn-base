import { myRender } from './common';
import specialDal from '../dal/specialDal';
import formidable from 'formidable';
import fs from 'fs';
import eventproxy from 'eventproxy';
import mkdirp from 'mkdirp';
export default {
  /**
   * 专题页面入口
   * @author: wac
   */
  entry(req, res, next) {
    myRender(req, res, 'special/special', { id: req.params.id, data: req.query.data });
  },

  /**
   * 获取专题推荐专家
   * @author: wac
   */
  rmdExperts(req, res, next) {
    specialDal.rmdExperts(req.query.id, (err, data) => {
      if (err) {
        return myRender(req, res, '400');
      }
      else {
        res.setHeader('Cache-Control', 'no-cache');
        res.json(data);
      }
    });
  },

  /**
  * 获取专题课程合辑信息
  * @author: wac
  */
  courseCompilation(req, res, next) {
    specialDal.courseCompilation(req.query.id, (err, data) => {
      if (err) {
        return myRender(req, res, '400');
      }
      else {
        res.setHeader('Cache-Control', 'no-cache');
        res.json(data);
      }
    });
  },
  /**
  * 获取专题头部信息
  * @author: wac
  */
  topInfo(req, res, next) {
    specialDal.topInfo(req.query.id, (err, data) => {
      if (err) {
        return myRender(req, res, '400');
      }
      else {
        res.setHeader('Cache-Control', 'no-cache');
        res.json(data);
      }
    });
  },
  /**
   * 后台新增&修改专题页面入口
   * @author: wac
   */
  sprest(req, res, next) {
    myRender(req, res, 'manage/specialReset', { layout: 'public_layout_cms' });
  },
  /**
   * 后台专题管理页面入口
   * @author: wac
   */
  specialManageEntry(req, res, next) {
    myRender(req, res, 'manage/specialManage', { layout: 'public_layout_cms' });
  },
  /**
   * 获取专题数量
   * @author: wac
   */
  specialCount(req, res, next) {
    specialDal.specialCount(req.session.domain, req.query.state, (err, data) => {
      if (err) {
        return myRender(req, res, '400');
      } else {
        res.setHeader('Cache-Control', 'no-cache');
        res.json(data);
      }
    });
  },
  /**
   * 获取专题列表
   * @author: wac
   */
  specials(req, res, next) {
    let {state, curPage, limit} = req.query;
    const domain = req.session.domain;
    for (let val in state) {
      if (val == '$or') {
        state[val] = [{ state: 0 }, { state: 1 }]
      }
    }
    specialDal.specials(
      domain, state, parseInt(curPage), parseInt(limit),
      (err, data) => {
        if (err) {
          return myRender(req, res, '400');
        } else {
          res.setHeader('Cache-Control', 'no-cache');
          res.json(data || []);
        }
      }
    );
  },
  /**
   * 删除专题
   * @author: wac
   */
  delSpecial(req, res, next) {
    let specialId = req.body.id;
    specialDal.delSpecial(
      specialId,
      (err, data) => {
        if (err) {
          return myRender(req, res, '400');
        } else {
          res.setHeader('Cache-Control', 'no-cache');
          res.json(data);
        }
      }
    );
  },

  /**
   * 上传专题背景图
   * @author: wac
   */
  specialImg(req, res, next) {
    const folder = `upload/special`;
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
  /**
   * 获取专题课程
   * @author: wac
   */
  sepcailCourse(req, res, next) {
    let filter = req.query.state || {};
    let {curPage, limit} = req.query;
    for (let val in filter) {
      if (val == 'name') {
        filter.name = RegExp(filter.name);
      }
    }
    filter['domain'] = req.session.domain;
    specialDal.sepcailCourse(
      filter,
      parseInt(curPage),
      parseInt(limit),
      (err, data) => {
        if (err) {
          return myRender(req, res, '400');
        } else {
          res.setHeader('Cache-Control', 'no-cache');
          res.json(data);
        }
      }
    );
  },
  /**
   * 获取专题课程数量
   * @author: wac
   */
  sepcailCourseCount(req, res, next) {
    let filter = req.query.state || {};
    for (let val in filter) {
      if (val == 'name') {
        filter.name = RegExp(filter.name);
      }
    }
    filter['domain'] = req.session.domain;
    specialDal.sepcailCourseCount(
      filter,
      (err, data) => {
        if (err) {
          return myRender(req, res, '400');
        } else {
          res.setHeader('Cache-Control', 'no-cache');
          res.json(data);
        }
      }
    );
  },

  /**
   * 获取专题专家
   * @author: wac
   */
  sepcailExpert(req, res, next) {
    let filter = req.query.state || {};
    filter['domain'] = req.session.domain;
    for (let val in filter) {
      if (val == 'name') {
        filter.name = RegExp(filter.name);
      }
    }
    specialDal.sepcailExpert(
      filter,
      parseInt(req.query.curPage),
      parseInt(req.query.limit),
      (err, data) => {
        if (err) {
          return myRender(req, res, '400');
        } else {
          res.setHeader('Cache-Control', 'no-cache');
          res.json(data);
        }
      }
    );
  },
  /**
   * 获取专题专家数量
   * @author: wac
   */
  sepcailExpertCount(req, res, next) {
    let filter = req.query.state || {};
    filter['domain'] = req.session.domain;
    for (let val in filter) {
      if (val == 'name') {
        filter.name = RegExp(filter.name);
      }
    }
    specialDal.sepcailExpertCount(
      filter,
      (err, data) => {
        if (err) {
          return myRender(req, res, '400');
        } else {
          res.setHeader('Cache-Control', 'no-cache');
          res.json(data);
        }
      }
    );
  },
  /**
   * 插入专题信息
   * @author: wac
   */
  specialAdd(req, res, next) {
    let special = req.query.special;
    special['domain'] = req.session.domain;
    specialDal.specialAdd(
      special,
      (err, data) => {
        if (err) {
          return myRender(req, res, '400');
        } else {
          res.setHeader('Cache-Control', 'no-cache');
          res.json(data);
        }
      }
    );
  },

  /**
   * 修改专题信息
   * @author: wac
   */
  specialupdate(req, res, next) {
    let special = req.query.special;
    let ischapter = false;
    let isexpert = false;
    for (let val in special) {
      if (val == 'chapter') {
        ischapter = true;
      }
      if (val == 'expert') {
        isexpert = true;
      }
      if (val == 'link') {
        delete special.link;
      }
    }
    if (ischapter == false) {
      special.chapter = [];
    }
    if (isexpert == false) {
      special.expert = [];
    }
    specialDal.specialupdate(
      special,
      (err, data) => {
        if (err) {
          return myRender(req, res, '400');
        } else {
          res.setHeader('Cache-Control', 'no-cache');
          res.json(data);
        }
      }
    );
  },

  /**
   * 专题预览
   * @author: wac
   */
  speciallook(req, res, next) {
    let special = req.query.special;
    specialDal.speciallook(
      special,
      (err, data) => {
        if (err) {
          return myRender(req, res, '400');
        } else {
          res.setHeader('Cache-Control', 'no-cache');
          res.json(data);
        }
      }
    );
  },
  /**
   * 专题预览删除
   * @author: wac
   */
  dellook(req, res, next) {
    specialDal.dellook(
      (err, data) => {
        if (err) {
          return myRender(req, res, '400');
        } else {
          res.setHeader('Cache-Control', 'no-cache');
          res.json(data);
        }
      }
    );
  },
}