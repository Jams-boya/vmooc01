import WithDrawDal from '../dal/withdraw';
import laundryDal from '../dal/laundryListDal';
import {myRender} from './common';
import eventproxy from 'eventproxy';
import validator from 'validator';
import laundrylist from './laundryList';
import commitlaundry from '../middlewares/commitLaundry';
export default {

  /** 提交提现申请 */
  applyWithDraw(req, res, next) {
    const userId = req.session.user._id;
    const userName = req.session.user.name;
    req.body.userId = userId;
    req.body.userName = userName;
    req.body.createAt = new Date().getTime();
    req.body['domain'] = req.session.domain;
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

      laundrylist.createWithDrawLaundry(req.session.domain, req.session.user, withDraw._id, changes, (err, laundry) => {
        commitlaundry.committedWithdrawLaundry({}, laundry, 1, (err, result) => {
          res.setHeader('Cache-Control', 'no-cache');
          res.json(withDraw);
        });
      });
    });
  },

  /** 后台管理入口 */
  cashManageEntry(req, res, next) {
    myRender(req, res, 'cms/cashManage', {layout: 'public_layout_cms', title: '提现管理'});
  },
  
  /** 读取取现列表 */
  getcashlist(req, res, next) {
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
    req.query['domain'] = req.session.domain;
    // get count
    if (req.query.fetch_total == 'true') {
      WithDrawDal.getAllWithDrawCount(req.query, ep.done('get_count'));
    } else {
      ep.emit('get_count', null);
    }
    // query list
    WithDrawDal.getAllWithDrawList(req.query, ep.done('get_list'));
  },

  /** 统计提现 */
  statisticTotal(req, res, next) {
    const state = req.query.state;
    
    let condition = {};
    if (state === '0')
      condition['state'] = 0;
    if (state === '1')
      condition['state'] = 1;
    condition['domain'] = req.session.domain;
    WithDrawDal.statisticTotal(condition, (err, result) => {
      res.setHeader('Cache-Control', 'no-cache');
      res.json(result);
    })
  },

  /** 确认提现 */
  sureWithdraw(req, res, next) {
    const withdrawId = req.body.withdrawId;
    const voucher = req.body.voucher;
    const ep = new eventproxy();
    WithDrawDal.sureWithdraw(withdrawId, voucher, (err, sureWithdraw) => {
      laundryDal.loadWithdrawLaundry(withdrawId, (err, laundry) => {
        res.setHeader('Cache-Control', 'no-cache');
        if (laundry) {
          if (laundry.state === 'committed')
            return res.json({error: '提现已经完成！'});

          /*** 下一步流水提交 ***/
          let change = {
            isPlatform: true,
            cashPooling: laundry.changes[0].amt
          };
          // 生成平台流水
          laundrylist.createWithDrawPlatform(laundry, change, (err, newlaundry) => {
            // 提交流水
            commitlaundry.committedWithdrawLaundry(laundry, newlaundry, 2, (err, result) => {
              return res.json(sureWithdraw);
            });
          });
        } else {
          return res.json({error: '没有提现信息，请确认后再试！'});
        }
      });
    });
  }
}