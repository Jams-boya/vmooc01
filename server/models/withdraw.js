import mongoose from 'mongoose';

export default {

  // 提现申请
  name: 'WithDraw',

  init() {
    const schema = new mongoose.Schema({
      // userId
      userId: {type: String},
      // userName
      userName: {type: String},
      // 开户行
      bank: {type: String},
      // 银行卡号
      card: {type: String},
      // 提现金额
      amt: {type: Number},
      // 提现时间
      createAt: {type: Number},
      // 打款时间
      closeAt: {type: Number},
      // 状态 （0申请，1已打款）
      state: {type: Number, default: 0},
      // 凭证
      voucher: {type: String},
      // alipay
      alipay: {type: String},
      // domain
      domain: {type: String}
    });

    mongoose.model(this.name, schema, 'withdraw');
  }
}
