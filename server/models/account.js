import mongoose from 'mongoose';

export default {

  // 回答
  name: 'Account',

  init() {
    const schema = new mongoose.Schema({
      // 用户id
      userId: {type: String},
      // 账户余额
      balance: {type: Number, default: 0},
      // 状态(0:激活(正常)， 1:账户存在异常， 2: 锁定)
      state: {type: Number, default: 0},

      // 银行卡
      card: [{
        // 开户人姓名
        name: {type: String},
        // 开户银行
        bank: {type: String},
        // 银行卡号
        cardCode: {type: String}
      }],

      // 是否是平台账户
      isPlatform: {type: Boolean, default: false},
      // 资金池
      cashPooling: {type: Number},
      // 当前流水号
      currentLaundry: {type: String},
      // 访问时间
      viewAt: {type: Number}
    });
    schema.index({userId: 1}, {unique: true});
    mongoose.model(this.name, schema, 'account');
  }
}