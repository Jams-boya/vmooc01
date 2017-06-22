import _ from 'lodash';
import React, {Component} from 'react';
import ReactDom from 'react-dom';
import config from '../../../../server/config.js';

class UsersWidget extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {url, id} = this.props;
    if (!url) {
      return;
    }
    let users = [];
    let userlist = [];
    $.ajax({
      url: url,
      type: 'get',
      data:{id: id},
      async: false,
      success: (data) => {
        userlist = data;
          if (data[1].length == 0) {
            document.getElementsByClassName('usersContainer')[0].style.display = "none";
          } else {
          data[1] = _.uniqBy(data[1],'nickName');
          data[1].map((item, idx) => {
            console.log('item', item);
          users.push(
            <div className="stu" key={idx}>
              <div className="stuimg"><img src={`${config.avatorUrl}/vmooc/findPicOther/${item.userId}`}/></div>
              <span style={{width:55,margin:"auto",textOverflow:"ellipsis",whiteSpace:"nowrap",overflow:"hidden"}}>{ item.nickName ? item.nickName : "name_56764567" }</span>
            </div>
          );
        });
        }
      },
      error: function(err) {
        console.log('err', err);
      }
    });
      
    return (
      <div className="student">
        <span className="stutitle">
          购买该课程的用户
        </span>
        <div className="stucon">
          {users}
          <div className="clear"></div>
        </div>
      </div>
    );
  }
}

export default UsersWidget;

