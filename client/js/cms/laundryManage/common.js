import moment from 'moment';
export default {
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
      case 'peek':
        module = '偷看';
        break;
      case 'withdraw':
        module = '提现';
        break;
    }

    if (mrow.changes.cashPooling > 0) {
      form = '收入';
    } else {
      form = '支出';
      form = (type === "qa")? "退款": form;
    }

    if (mrow.state === 'uncommitted') {
      commit = '(处理中)';
    }

    return module + form + commit;
  },

  simpleDateForm(time) {
    return moment(time).format('YYYY-MM-DD HH:mm:ss'); 
  },

  amtFormat(amt) {
    return Number(amt).toFixed(3);
  }
}