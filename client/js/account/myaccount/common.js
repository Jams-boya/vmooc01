import moment from 'moment';

export default  {
  buildLaundryCode(id) {
    return id.substring(8);
  },

  buildLaundryType(type, mrow) {
    let module = '';
    let form = '';
    let commit = '';
    switch(type) {
      case 'course': 
        module = '课程';
        break;
      case 'qa': 
        module = '问答';
        break;
      case 'collection':
        module = '专题';
        break;
      case 'withdraw':
        module = '提现';
        break;
      case 'peek':
        module = '偷看'
        break;
    }

    if (mrow.changes[0].payBack) {
      module += '退款';
    }

    if (mrow.changes[0].amt > 0) {
      form = '收入';
      form = (type === "qa")? "": form;
    } else {
      form = '支出';
      
    }

    // if (mrow.changes[0])

    if (mrow.state === 'uncommitted') {
      commit = '(处理中)';
    }

    return module + form + commit;
  },

  simpleDateForm(time) {
    return moment(time).format('YYYY-MM-DD HH:mm:ss'); 
  },

  transactionType(type) {
    return type === 'alipay' ? '支付宝': type === 'platform' ? '账户余额': '';
  }
}