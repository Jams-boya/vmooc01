import moment from 'moment';

export default {

  /** 时间格式 */
  simpleDateForm(date) {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
  },

  /** 状态显示 */
  showState(state) {
    let note = '';
    switch(state){
      case 0 : 
        note = '已申请';
        break;
      case 1 :
        note = '已付款';
        break;
      default:
        note = '未知';
        break;
    }
    return note;
  }

}