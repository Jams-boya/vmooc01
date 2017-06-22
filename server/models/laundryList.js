import mongoose from 'mongoose';

export default {

  // 流水账
  name: 'LaundryList',

  init() {
    const schema = new mongoose.Schema({
      // 模块(视频课程、文库等)
      module: {type: String},
      // 订单类型
      orderType: {type: String},
      // 提现编号
      withdrawId: {type: String},
      // 订单编号
      orderId: {type: String},
      // 订单号
      orderSn: {type: String},
      // 事务提交状态: uncommitted | committed
      state: {type: String},
      // 事务内容
      changes: [{
        // 涉及订单编号
        orderSn: {type: String},
        // 支付方式 (platform: 平台余额, alipay: 支付宝)
        type: {type: String},
        // 涉及ping支付编号
        chargeId: {type: String},
        // 用户编号
        userId: {type: String},
        // 是否是平台流水
        isPlatform: {type: Boolean},
        // 交易金额
        amt: {type: Number},
        // 资金池变动
        cashPooling: {type: Number},
        //是否属于退款
        payBack: { type: Boolean, default: false },
      }],
      // 创建人id
      createId: {type: String},
      // 创建人姓名
      createName: {type: String},
      // 收款人
      payeeId: {type: String},
      // 收款人姓名
      payeeName: {type: String},
      // 创建时间
      createAt: {type: Number},
      // domain
      domain: { type: String },
      // 优惠码
      promoCode:  { type: String },
    });

    mongoose.model(this.name, schema, 'laundrylist');
  }
}