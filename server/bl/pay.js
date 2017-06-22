import pingpp from '../transaction/basicMethod';

export default {
  /** 生成ping++支付 */
  createPingppPay(order_no, amount, client_ip, info, callback) {
    pingpp.createCharge(order_no, amount, client_ip, info, (err, charge) => {
      callback(err, charge);
    });
  }
}