import eventproxy   from 'eventproxy';
import formidable   from 'formidable';
import fs           from 'fs';
import mkdirp       from 'mkdirp';
import mongoose     from 'mongoose';
import path         from 'path';

import config       from '../config';
import teacherDal   from '../dal/teacherDal';
import {myRender}   from './common';

function uplifePhoto(req, res, id, path, next) {
  let {user} = req.session;
  let upobj = {
    id: id,
    path: path,
    userid: user._id,
    updateAt: new Date().getTime()
  };
  teacherDal.uplifePhoto(
    upobj,
    (err, data) => {
      if (err) {
        return next(err);
      }
      res.setHeader('Cache-Control', 'no-cache');
      res.json({
        path: path,
      });
    }
  );
}
export default {

  // 上传文件
  upTeacher(req, res, next) {
    const folder = `upload/${req.session.user._id}`;
    const ep = new eventproxy();
    const {module} = req.params;
    console.log('folder', folder);

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
        if (module === "lifePhoto") {
          uplifePhoto(req, res, fields.id, path, next);
        }
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
  // 查找图片
  view(req, res, next) {
    const module = req.params.module
    const userid = req.params.userid;
    const filename = req.params.file;
    console.log(module, userid, filename);
    const p = path.join(module, userid, filename);
    fs.exists(p, (exists) => {
      if (exists) {
        let stream = fs.createReadStream(p, { flags: 'r' });
        stream.pipe(res);
        stream.on('end', function () {
          return res.end();
        }).on('error', function (err) {
          console.error('error=', err);
        });
      } else {
        res.end();
      }
    });
  },



};


