import userapp from '../user/userapp';
import eventproxy   from 'eventproxy';
import fs from 'fs';
import mkdirp       from 'mkdirp';
import path         from 'path';
import {myRender} from './common';
import validator from 'validator';
import accountDal from '../dal/accountDal';
import sio from 'socket.io';
import commitlaundry from '../middlewares/commitLaundry';
import laundrylist from './laundryList';
import config from '../config';
import WithDrawDal from '../dal/withdraw';
export default {
  /** 会员管理入口 */
  accountManageEntry(req, res, next) {
     myRender(req, res, 'account/accountManage', {layout: 'public_layout_cms', tittle: '后台管理-会员管理'});
  },

  /** 个人账户入口 */
  myAccountEntry(req, res, next) {
    const userId = req.session.user._id;
    accountDal.findOrCreateAccount(userId, (err, account) => {
      return myRender(req, res, 'account/myaccount', {layout: 'public_layout_user', account: account});
    });
  },

  /** 查找个人流水 */
  personlaundrylist(req, res, next) {
    const userId = req.session.user._id;
    const ep = new eventproxy();
    ep.fail(err => res.json({error: err}));
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
      accountDal.loadPersonLaundryCount(userId, ep.done('get_count'));
    } else {
      ep.emit('get_count', null);
    }
    // query list
    accountDal.loadPersonLaundryList(userId, req.query, ep.done('get_list'));

  },

  /** 我的银行卡入口 */
  myCardEntry(req, res, next) {
    myRender(req, res, 'account/mycard', {layout: 'public_layout_user'});
  },

  /** 绑定银行卡 */
  bindMyCard(req, res, next) {
    const userId = req.session.user._id;
    const cardInfo = req.body.cardInfo;

    accountDal.bindMyCard(userId, cardInfo, (err, result) => {
      res.setHeader('Cache-Control', 'no-cache');
      res.json(result);
    });

  },

  /** 读取账户信息 */
  getmyaccount(req, res, next) {
    const userId = req.session.user._id;
    accountDal.findOrCreateAccount(userId, (err, account) => {
      res.setHeader('Cache-Control', 'no-cache');
      return res.json(account);
    });
  },

  /** 个人提现申请 */
  applywithdrawal(req, res, next) {
    
  },

  /** API - 提交提现申请 */
  applyWithDrawAPI(req, res, next) {
    console.log('33333');
    const userId = req.body.userId;
    req.body.createAt = new Date().getTime();
    req.body['domain'] = config.vmoocDomain;
    WithDrawDal.applyWithDraw(req.body, (err, withDraw) => {
      let changes = [];
      changes.push({
        userId: userId,
        amt: -withDraw.amt,
      });
      // changes.push({
      //   isPlatform: true,
      //   amt: -withDraw.amt
      // });

      laundrylist.createWithDrawLaundry(config.vmoocDomain, {_id: req.body.userId, name: req.body.userName}, withDraw._id, changes, (err, laundry) => {
        commitlaundry.committedWithdrawLaundry({}, laundry, 1, (err, result) => {
          res.setHeader('Cache-Control', 'no-cache');
          res.json(withDraw);
        });
      });
    });
  },

  /** API - 查找个人流水 */
  personlaundrylistAPI(req, res, next) {
    const userId = req.query.userId;
    console.log('222222',req.query);
    
    const ep = new eventproxy();
    ep.fail(err => res.json({error: err}));
    ep.all('get_count', 'get_list', (count, list) => {
      res.setHeader('Cache-Control', 'no-cache');
      // set count at response header
      if (validator.isInt(String(count))) {
        res.setHeader('x-total-count', count);
      }

      res.json({list, count});
    });

    // get count
    if (req.query.fetch_total == 'true') {
      accountDal.loadPersonLaundryCount(userId, ep.done('get_count'));
    } else {
      ep.emit('get_count', null);
    }
    // query list
    accountDal.loadPersonLaundryList(userId, req.query, ep.done('get_list'));

  },
  /** api - 读取账户信息 */
  getmyaccountAPI(req, res, next) {
    console.log('11111');
    const userId = req.query.userId;
    accountDal.findOrCreateAccount(userId, (err, account) => {
      res.setHeader('Cache-Control', 'no-cache');
      return res.json(account);
    });
  },
}
