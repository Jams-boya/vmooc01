import { myRender } from './common';
import setupDal from '../dal/setupDal';
import userapp from '../user/userapp';
import eventproxy from 'eventproxy';
import config from '../config.js';
// import bcrypt from 'bcrypt';
import formidable from 'formidable';
import fs from 'fs';
import mkdirp from 'mkdirp';
import ExpertDal from '../dal/expertDal';
import path from 'path';

var bcrypt;

if (config.run_at_win) {
  bcrypt = require('bcryptjs');
} else {
  bcrypt = require('bcrypt');
}
export default {
  /**
   * 查询讲师问答管理设置
   * @author:gs
   */
  findExpert(req, res, next) {
    let userId = req.session.user._id;
    setupDal.findExpert(userId, (err, data) => {
      if (err) {
        return next(err);
      } else {
        res.setHeader('Cache-Control', 'no-cache');
        res.json(data);
      }
    });
  },
  /**
   * 更新保存问答管理
   * @author:gs
   */
  saveSetup(req, res, next) {
    const userId = req.session.user._id;
    const setup = req.body;
    setupDal.findExpertInfo(
      userId,
      setup,
      (err, data) => {
        if (err) {
          return next(err);
        }
        res.setHeader('Cache-control', 'no-cache');
        res.json(data);
      });
  },
  /**
   * @param pwd:旧密码
   * @param user:登录用户的信息
   * @author:gs
   */
  checkOldPwd(req, res, next) {
    const {pwd} = req.body;
    const user = req.session.user;
    bcrypt.compare(pwd, user.password, (err, result) => {
      if (result == false) {
        return res.send({ error: '旧密码输入错误!', layout: false });
      } else {
        return res.send({ error: '', layout: false });
      }
    });

  },
  /**
   * 修改密码
   * @param passwd:旧密码和新密码
   * @param user:登录用户的信息
   * @param passwd.password : 输入的旧密码
   * @param passwd.newPassword : 输入的新密码
   * @param user.password : 用户的旧密码
   * @author:gs
   */
  savepwd(req, res, next) {
    const password = req.body.pwds.password;
    const newPassword = req.body.pwds.newPassword;
    const repeatPassword = req.body.pwds.repeatPassword;
    const user = req.session.user;
    userapp.editUserPwd(user._id, newPassword, (err, data) => {
      if (data.nModified == 1) {
        req.session.user = "";
        // res.redirect("/signin");
      }
      // res.setHeader('Cache-control', 'no-cache');
      res.json(data);
    });
  },

  /**
   * 保存个人资料信息
   * @param perInfo : 用户信息对象
   * @param user : 登录用户的信息
   * @author : gs
   */
  savePerInfo(req, res, next) {
    let query = {};
    query['name'] = req.body.name;
    query['nickName'] = req.body.nickName;
    query['avatar'] = req.body.Avatar;
    query['phone'] = req.body.phone;
    // 更新session
    req.session.user.name = query['name'];
    req.session.user.nickName = query['nickName'];
    req.session.user.Avatar = query['avatar'];
    req.session.user.phone = query['phone'];

    const user = req.session.user;
    userapp.editUserBasicInfo(user._id, query, (err, data) => {
      if (err) {
        return next(err);
      }
      res.setHeader('Cache-control', 'no-cache');
      res.json(data);
    });
  },
  /**
   * 保存讲师信息
   * @param userId 讲师id
   * @param expertPerInfo 讲师信息
   */
  saveExpertPerInfo(req, res, next) {
    let query = {};
    query['name'] = req.body.name;
    query['nickName'] = req.body.nickName;
    query['avatar'] = req.body.avatar;
    query['phone'] = req.body.phone;
    query['lifePhoto'] = req.body.lifePhoto;
    query['professionalTitle'] = req.body.professionalTitle;
    query['briefDescription'] = req.body.briefDescription;
    query['money'] = req.body.money;
    const userId = req.session.user._id;
    ExpertDal.saveExpertPerInfo(userId, query, (err, data) => {
      if (err) {
        return next(err);
      }
      res.setHeader('Cache-control', 'no-cache');
      res.json(data);
    })
  },
  /**
   * 上传头像
   * @author:gs
   */
  uploadAvatar(req, res, next) {
    const folder = `upload/avatar`;
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
  /**
   * 验证图片是否存在
   * 如果不存在则使用/img/prot.png，如果存在就使用存在的图片
   * @author:gs
   */

  // checkAvatar(req, res, next) {
  //     let id = req.params.id;
  //     userapp.getPersonInfo(id, (err, data) => {
  //       if (err) {
  //           return next(err);
  //       }
  //       if (data.Avatar) {
  //           const p = path.join(data.Avatar);
  //           fs.exists(p, (exists) => {
  //             var stream = fs.createReadStream(p, { flags: 'r' });
  //             stream.pipe(res);
  //             stream.on('end', function() {
  //                 return res.end();
  //             }).on('error', function(err) {
  //                 console.log('err', err);
  //             });
  //           });
  //       } else if (!data.Avatar) {
  //         fs.exists(p, (exists) => {
  //           var stream = fs.createReadStream('/img/prot.png', { flags: 'r' });
  //           stream.pipe(res);
  //           stream.on('end', function() {
  //               return res.end();
  //           }).on('error', function(err) {
  //               console.log('err', err);
  //           });
  //         });
  //       }
  //   });
  // }

}





