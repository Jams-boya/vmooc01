import {WithDraw, Orders} from '../models';
import commonDal from './commonDal';

/** 搜索条件 */
function buildSearchCondition(query) {
  let condition = {};
  condition['domain'] = query.domain;
  return condition;
}

export default {

  /** 新增提现申请 */
  applyWithDraw(query, callback) {
    const newWithDraw = new WithDraw(query);
    newWithDraw.save(callback);
  },

  /** 读取提现计数 */
  getAllWithDrawCount(condition, callback) {
    const query = buildSearchCondition(condition);
    WithDraw.count(query, callback);
  },

  /** 读取提现信息 */
  getAllWithDrawList(condition, callback) {
    const query = buildSearchCondition(condition);
    WithDraw.find(query, 'createAt userName alipay amt state voucher', commonDal.buildPageAndOrderOptions(condition, {sort: {_id: -1}}), callback);
  },

  /** 统计提现 */
  statisticTotal(query, callback) {
    WithDraw.aggregate()
      .match(
        query
      )
      .group({
        _id: '$state',
        count:{$sum: 1},
        total: { '$sum': "$amt" }
      }).exec(callback); 
  },

  /** 提现确认 */
  sureWithdraw(withdrawId, voucher, callback) {
    WithDraw.findOneAndUpdate({_id: withdrawId}, {$set: {voucher, state: 1}}, {new: true}, callback);
  }
}