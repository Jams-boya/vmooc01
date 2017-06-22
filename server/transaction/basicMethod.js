import moment from 'moment';
var pingpp = require("pingpp")('sk_live_0aXLCSnbjr9C8Wbn5GPaLGiL');

pingpp.setPrivateKeyPath("server/transaction/rsa_private_key.pem");

/** 基础配置 */
let config = {
  currency: "cny",
  channel: "alipay_qr",
  app: {
    id: 'app_TuDKe5GK0OiHrT0W'
  },
  // time_expire: moment().add(2, 'days').format('x')
};

export default {
  /**
   * 
   * createCharge 创建ping++订单
   * @param {any} order_no 平台订单号
   * @param {any} amount 订单金额
   * @param {any} client_ip 客户端
   * @param {any} info 信息 {subject 标题, body 商品信息, metadata: 其他信息， description 订单附加说明}
   */
  createCharge(order_no, amount, client_ip, info, callback) {
    amount = Number(amount) * 100;
    pingpp.charges.create({
      ...config,
      order_no,
      amount,
      client_ip,
      ...info
    }, (err, charge) => {
      // 异步调用
      console.log("aaaa", err);
      console.log("bbbb", charge);
      callback(err, charge);
    });
  },

  /**
   * loadOneCharge 查询单条支付订单
   * @param {any} chargeId 支付Id
   * @param {any} callback
   */
  loadOneCharge(chargeId, callback) {
    pingpp.charges.retrieve(chargeId, callback);
  },

  /**
   * 发起退款
   * ch_id 已付款的订单号
   * amt 退款金额
   * desc 退款描述 
   */
  createRefund(ch_id, amt, desc, callback) {
    pingpp.charges.createRefund(
      ch_id,
      {
        amount: Number(amt) * 100,
        description: desc
      },
      (err, refund) => {
        console.log('======', err, refund);
        callback(err, refund);
      }
    );
  }
}