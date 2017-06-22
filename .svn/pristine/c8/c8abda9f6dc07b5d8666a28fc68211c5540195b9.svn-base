import mongoose from 'mongoose';
import fs from 'fs';
import eventproxy from 'eventproxy';
import config from '../config';
import enumCodeDal from '../dal/enumCodeDal'
import tools from '../middlewares/tools';
import { myRender } from './common';

export default {
  /**
   * 查询课程类型
   */
  gettype(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    enumCodeDal.gettype(
      req.query.type,
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
   * 查询课程类型
   */
  test(req, res, next) {
    myRender(req, res, 'test');
  },

  /**
   * 添加学习方向、课程分类入口
   * @author:gs
   */
  addClassifyEntry(req, res, next) {
    myRender(req, res, 'admin/classify', { layout: "public_layout_cms", tittle: '后台管理-课程分类管理' });
  },

  /**
   * 查询课程类型
   * @author:gs
   */
  getclassify(req, res, next) {
    enumCodeDal.getclassify(
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
   * 保存并更新
   * @author:gs
   */
  saveAndUpdate(req, res, next) {
    enumCodeDal.saveAndUpdate(
      req.query.result,
      (err, data) => {
        if (err) {
          return next(err);
        }
        res.setHeader('Cache-control', 'no-cache');
        res.json(data);
      });
  },

  /**
   * 根据code获取枚举信息
   * @author shen
   */
  getEnumcodeByCode(req, res, next) {
    const code = req.params.code;
    enumCodeDal.getEnumCodeByCode(code, (err, data) => {
      let result = [];
      if (data && data.values) {
        result = data.values;
      }
      res.setHeader('Cache-Control', 'no-cache');
      res.json(result);
    });
  }
};


