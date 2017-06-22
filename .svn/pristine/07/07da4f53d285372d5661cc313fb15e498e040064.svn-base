import {LaundryList} from '../models';
import commonDal from './commonDal';
import mongoose from 'mongoose';
/** 搜索条件 */
function buildSearchCondition(query) {
  let condition = {domain: query.domain, 'changes.isPlatform': true, "changes.cashPooling": {$exists: true}, 'changes.cashPooling': {$ne: 0}};
  return condition;
}

/***统计条件 */
function buildStatisticCondition(query) {
  let condition = {'changes.isPlatform': true, "changes.cashPooling": {$exists: true}, 'changes.cashPooling': {$ne: 0}};
  if (query.type === 'income')
    condition['changes.cashPooling'] = {$gt: 0};
  if (query.type === 'chargeoff')
    condition['changes.cashPooling'] = {$lt: 0};

  condition['domain'] = query.domain;
  return condition;
}


/********** 平台收入条件 *********/
/** 搜索条件 */
function buildIncomeSearchCondition(query) {
  let condition = {domain: query.domain, 'changes.isPlatform': true, "changes.amt": {$exists: true}, 'changes.amt': {$ne: 0}, 'changes.amt': {$gt: 0}};
  return condition;
}

/***统计条件 */
function buildIncomeStatisticCondition(query) {
  let condition = {domain: query.domain, 'changes.isPlatform': true, "changes.amt": {$exists: true}, 'changes.amt': {$ne: 0}, 'changes.amt': {$gt: 0}};
  return condition;
}

export default {
  
  /**
   * createLaundryList 创建账户流水
   * @param {any} query
   * @param {any} callback
   */
  createLaundryList(query, callback) {
    const newlaundry = new LaundryList(query);
    newlaundry.save(callback);
  },

  /** 生成课程流水 */
  createCourseOrderLaundry(laundrylist, callback) {
    LaundryList.create(laundrylist, callback);
  },

  /** 标注流水提交成功 */
  committedlaundry(laundryId, callback) {
    LaundryList.update({_id: laundryId}, {$set: {state: "committed"}}, callback);
  },

  /** 读取提现流水 */
  loadWithdrawLaundry(withdrawId, callback) {
    LaundryList.findOne({withdrawId}, callback);
  },

  /** 生成第二步提现流水 */
  createWithdrawStep2(laundry, change, callback) {
    LaundryList.findOneAndUpdate({_id: laundry._id}, {$push: {changes: change}}, {new: true}, callback);
  },

  /** 读取流水计数 */
  getAllLaundryCount(condition, callback) {
    const query = buildSearchCondition(condition);
    LaundryList.aggregate(
      {$project: {"changes": "$changes", '_id': '$_id', 'createAt': '$createAt', 'orderType': '$orderType', 'orderSn': '$orderSn','state': '$state', domain: '$domain'}},
      {$unwind: '$changes'},
      {$match: query},
      {$group: {_id: null, count: {$sum: 1}}},
      callback
      );
  },

  /** 读取流水列表 */
  getAllLaundryList(condition, callback) {
    const query = buildSearchCondition(condition);
    console.log('====', condition);
    // LaundryList.find(query, 'createAt userName alipay amt state voucher', commonDal.buildPageAndOrderOptions(condition, {sort: {createAt: -1}}), callback);
    LaundryList.aggregate(
      {$project: {"changes": "$changes", '_id': '$_id', 'createAt': '$createAt', 'orderType': '$orderType', 'orderSn': '$orderSn','state': '$state', domain: '$domain'}},
      {$unwind: '$changes'},
      {$match: query},
      {$sort: {_id: -1}},
      {$skip : Number(condition.offset)},
      {$limit: Number(condition.limit)},
      callback
      );
  },


  /** 统计流水 */
  statisticTotal(condition, callback) {
    console.log('=====', condition);
    const query = buildStatisticCondition(condition);
    LaundryList.aggregate(
      {$project: {"changes": "$changes", '_id': '$_id', 'createAt': '$createAt', 'orderType': '$orderType', 'orderSn': '$orderSn','state': '$state', domain: '$domain'}},
      {$unwind: '$changes'},
      {$match: query},
      {$group: {_id: null, count: {$sum: '$changes.cashPooling'}}},
      callback
      );
  },

  /*** 提交提现流水确认 ***/
  committedWithdrawlaundry(oldlaundryId, laundryId, callback) {
    const condition = {$or: [{_id: mongoose.Types.ObjectId(oldlaundryId)}, {_id: mongoose.Types.ObjectId(laundryId)}]};
    LaundryList.update(condition, {$set: {state: "committed"}}, {multi: true}, callback);
  },

  /*** 提交多个流水的确认 **/
  committedLaundrys(laundrys, callback) {
    let condition = {};
    condition['$or'] = laundrys.map(l => {
      return {_id: mongoose.Types.ObjectId(l)};
    });
    LaundryList.update(condition, {$set: {state: "committed"}}, {multi: true}, callback);
  },

  /** 根据订单号获取流水号 **/
  getLaundryIdByOrderSn(orderSn, callback) {
    LaundryList.findOne({orderSn}, callback);
  },

  /** 读取平台收入列表 */
  getAllIncomeList(condition, callback) {
    const query = buildIncomeSearchCondition(condition);
    // LaundryList.find(query, 'createAt userName alipay amt state voucher', commonDal.buildPageAndOrderOptions(condition, {sort: {createAt: -1}}), callback);
    LaundryList.aggregate(
      {$project: {"changes": "$changes", '_id': '$_id', 'createAt': '$createAt', 'orderType': '$orderType', 'orderSn': '$orderSn','state': '$state', domain: '$domain'}},
      {$unwind: '$changes'},
      {$match: query},
      {$sort: {_id: -1}},
      {$skip : Number(condition.offset)},
      {$limit: Number(condition.limit)},
      callback
      );
  },

  /** 读取平台收入计数 */
  getAllIncomeCount(condition, callback) {
    const query = buildIncomeSearchCondition(condition);
    LaundryList.aggregate(
      {$project: {"changes": "$changes", '_id': '$_id', 'createAt': '$createAt', 'orderType': '$orderType', 'orderSn': '$orderSn','state': '$state', domain: '$domain'}},
      {$unwind: '$changes'},
      {$match: query},
      {$group: {_id: null, count: {$sum: 1}}},
      callback
      );
  },

  /** 统计收入 */
  incomestatisticTotal(condition, callback) {
    const query = buildIncomeStatisticCondition(condition);
    LaundryList.aggregate(
      {$project: {"changes": "$changes", '_id': '$_id', 'createAt': '$createAt', 'orderType': '$orderType', 'orderSn': '$orderSn','state': '$state', domain: '$domain'}},
      {$unwind: '$changes'},
      {$match: query},
      {$group: {_id: null, count: {$sum: '$changes.amt'}}},
      callback
      );
  },
}