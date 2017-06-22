import mongoose from 'mongoose';

export default {

  // 订单
  name: 'Orders',

  init() {
    const schema = new mongoose.Schema({
      // 订单号
      sn: { type: String },
      // 订单类型  course=课程订单，qa=问答订单, peek=偷看订单, collection=专题订单
      type: { type: String },
      // 产品_id
      itemId: { type: String },
      // 产品名称
      itemName: { type: String },
      // 产品单价
      itemPrice: { type: Number },
      // 产品可分享次数
      itemLicense: { type: Number },
      // 产品已分享次数
      licenseUsed: { type: Number, default: 1 },
      // 产品分享记录
      licenseRecord: [{
        //获得赠送者id
        _id: { type: String },
        //获得赠送者姓名
        name: { type: String },
        //获得赠送者邮箱
        email: { type: String },
        // 昵称 (2017.4.28新增)
        nickName: { type: String },
        //获赠份数
        amount: { type: Number },
      }],
      // 产品总价
      itemAmount: { type: Number },
      // 付款人ID
      payerId: { type: String },
      // 付款人名称
      payerName: { type: String },
      // 收款人_id
      receiverId: { type: String },
      // 收款人姓名
      receiverName: { type: String },

      //订单状态  0=待付款，1=已付款(等价于已回答)，2 = 交易关闭
      state: { type: Number, default: 0 },

      // 下单时间
      createAt: { type: Number },

      // 付款时间
      payAt: { type: Number },

      // 结束类型 success Refund
      closeType: { type: String },

      // 结束时间
      closeTime: { type: Number },

      // 支付方式 (-1:他人赠送 0: 平台, 1: 支付宝)
      payMethod: { type: Number },

      // ping++ charge id
      chargeId: { type: String },

      // 支付链接地址
      QrUrl: { type: String },

      //订单对应课程信息
      info: {
        direction: { type: String },
        classify: { type: String },
      },

      //专题课程对应收款讲师
      collectionReceivers: [{
        receiverId: { type: String },
        receiverName: { type: String },
      }],
      // 域名
      domain: { type: String },
      // 优惠码
      promoCode: {
        // 优惠码号
        code: { type: String },
        // 优惠码次数
        count: { type: Number },
      },
      // 实际价格(处理优惠码)
      actualMoney: { type: Number },
    });

    mongoose.model(this.name, schema, 'orders');
  }
}


