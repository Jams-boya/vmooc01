import moment from 'moment';
import React from 'react';
import {Label} from 'react-bootstrap'; 
export default {
  /** 账户类型 */
  accountType(isInstructor) {
    if (isInstructor)
      return '认证讲师';
    return '注册会员';
  },
  
  /** 时间格式 */
  simpleDateFormat(date) {
    if (!date)
      return '';
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
  },

  /** 显示技能 */
  skills(skills) {
    let skilllabel;
    if (skills) {
      skilllabel = skills.map((skill, idx) => {
        return (<Label className = {"mr10"} key = {idx} bsStyle="info">{skill}</Label>);
      });
    }
    return skilllabel;
  }

}