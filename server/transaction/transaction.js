import basic from './basicMethod';

export default {
  /** 生成ping++支付 */
  createPingppPay(order_no, amount, client_ip, info, callback) {
    basic.createCharge(order_no, amount, client_ip, info, (err, charge) => {
      if (err || !charge)
        return callback(err, null);
      callback(err, charge);
    });
  },

  /**
   * 发起退款
   * @param {String} ch_id 已付款的订单号
   * @param {Number} amt   退款金额
   * @param {String} desc  退款描述 
   */
  createRefund(ch_id, amt, desc, callback) {
    basic.createRefund(ch_id, amt, desc, (err, refund) => {
      if (err || !refund)
        return callback(err, null);
      callback(err, refund);
    });
  }


}