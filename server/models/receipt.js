import mongoose from 'mongoose';

export default {

  //  发票(平台开出的发票)
  name: 'Receipt',

  init() {
    const schema = new mongoose.Schema({
      // 发票ID
      sn: {type: String},
      // 发票类型  0=增值税发票，1=普通发票
      type: {type: String},
      // 发票针对订单号
      orderId: [{type: String}],
      // 客户ID
      userId: {type: String},
      // 客户名称
      userName: {type: String},
      // 客户手机号码
      phone: {type: Number},
      // 客户座机号码
      telephone: {type: Number},
      // 发票抬头
      company: {type: String},
      // 税号
      dutyId: {type: String},
      // 地址
      address: {type: String},
      // 开户银行
      bank: {type: String},
      // 银行卡号
      bankNumber: {type: String},
      // 开票金额
      amount: {type: Number},
      // 开票时间
      receiptTime: {type: Number, default: Date.now()},
      // 发票内容
      content: [{
        // 货物或应税劳务名称
        name: {type: String},
        // 规格型号
        model: {type: String},
        // 单位
        unit: {type: String},
        // 数量
        count: {type: Number},
        // 单价
        price: {type: Number},
        // 金额
        amount: {type: Number},
        // 税率
        taxRate: {type: String},
        // 税额
        taxAmount: {type: Number},
      }],
      // 是否寄送  0=未寄送，1=已寄送
      isSend: {type: Boolean},
      // 快递公司
      expressCompany: {type: String},
      // 快递单号
      expressId: {type: String},
    });
    mongoose.model(this.name, schema, 'receipt');
  }
}






