import {Account, LaundryList} from '../models';
import commonDal from './commonDal';

export default {
  /** 查询账户 */
  queryAccountBalance(userId, isPlatform, callback) {
    let condition = {userId};
    if (isPlatform)
      condition = {isPlatform: true};
    Account.findOne(condition, callback);
  },

  /** 账户支付 */
  accountPay(accountId, userId, balance, moneyNeedPay, callback) {
    Account.findOneAndUpdate({_id: accountId, userId, balance, balance: {$gte: moneyNeedPay}}, {$inc: {balance: -moneyNeedPay}}, {new: true}, callback);
  },

  /** 账户收款 */
  accountIncome(userId, amt, callback) {
    Account.findOneAndUpdate({userId}, {$inc: {balance: amt}}, {new: true, upsert: true}, callback);
  },

  /** 课程支付 */
  coursePay(userId, laundryId, amt, callback) {
    const acid = {$or: [{currentLaundry: null}, {currentLaundry: {$lt: laundryId}}]};
    Account.findOneAndUpdate({_id: userId, ...acid}, {$inc: {balance: amt}, $set: {currentLaundry: laundryId}}, {new: true}, callback);
  },

  /** 未开通账户的支付 */
  coursePayNoActive(userId, laundryId, amt, callback) {
    Account.findOneAndUpdate({userId}, {$inc: {balance: amt}, $set: {currentLaundry: laundryId}}, {new: true, upsert: true}, callback);
  },

  /** 查询账户并开通 */
  findOrCreateAccount(userId, callback) {
    const time = new Date().getTime();
    Account.findOneAndUpdate({userId}, {$set: {viewAt: time, state: 0}}, {upsert: true, new: true}, callback);
  },

  /** 查询用户流水 */
  loadPersonLaundryList(userId, query, callback) {
    console.log('----query', query);
    LaundryList.find({'changes.userId': userId}, {'changes.$': 1, createAt: 1, orderType: 1, state: 1, promoCode: 1 }, commonDal.buildPageAndOrderOptions(query, {sort: {createAt: -1}}), callback);
  },

  /** 查询账户流水统计 */
  loadPersonLaundryCount(userId, callback) {
    LaundryList.count({'changes.userId': userId}, callback);
  },

  /** 绑定银行卡 */
  bindMyCard(userId, cardInfo, callback) {
    Account.update({userId}, {$push: {card: cardInfo}}, callback);
  },

  /** 提现流水提交 - 用户 */
  withdrawPay(userId, laundryId, amt, callback) {
    const acid = {$or: [{currentLaundry: null}, {currentLaundry: {$lt: laundryId}}]};
    Account.findOneAndUpdate({userId, ...acid}, {$inc: {balance: amt}, $set: {currentLaundry: laundryId}}, {new: true}, callback);
  },

  /** 提现流水提交 - 平台 */
  withdrawPayPlatform(laundryId, amt, callback) {
    const acid = {$or: [{currentLaundry: null}, {currentLaundry: {$lt: laundryId}}]};
    Account.findOneAndUpdate({isPlatform: true, ...acid}, {$inc: {cashPooling: amt}, $set: {currentLaundry: laundryId}}, {new: true}, callback);
  },

  /** 平台账户的流水提交 **/
  platformAccountEdit(accountId, laundryId, amt, cashPooling, callback) {
    const acid = {$or: [{currentLaundry: null}, {currentLaundry: {$lt: laundryId}}]};
    Account.findOneAndUpdate({_id: accountId, ...acid}, {$inc: {balance: amt, cashPooling: cashPooling}, $set: {currentLaundry: laundryId}}, {new: true}, callback);
  }
}