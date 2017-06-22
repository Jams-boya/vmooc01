import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { message } from 'antd';

class Enshrine extends Component {
  constructor(props) {
    super(props);
    this.courseBuy = this.courseBuy.bind(this);
  }
  courseBuy(e) {
    window.open('/course/' + e.target.id);
  }
  dropEnshrine(courseID, userID, courseName) {
    $('#modalCon').html('是否取消收藏课程《' + courseName + '》?');
    $('#myModal').modal({
      keyboard: false
    });
    let dthis = this;
    $('#dropEnshrine').click(() => {
      dthis.props.delEn(courseID, userID);
      $('#myModal').modal('hide');
      $('#dropEnshrine').unbind('click');
    });
  }
  render() {
    let shrineInfo = this.props.data ? this.props.data : [];
    let encourse = [];
    shrineInfo.map((val, idx) => {
      encourse.push(
        <div className="encourse">
          <div className="encover">
            <img src={val.course.cover} />
          </div>
          <div className="enmiddle">
            <div className="entitle">{val.course.name}</div>
            <div className="encon">{val.course.description}</div>
            <div className="enbottom">
              <span>￥{val.course.price}</span>
              <span>{val.course.purchaseCount}人学过</span>
            </div>
          </div>
          <div className="enright">
            <div id={val.courseID} className="enbuy" onClick={this.courseBuy}>去购买</div>
            <div className="endel" onClick={this.dropEnshrine.bind(this, val.courseID, val.userID, val.course.name)}><a className="delShrine" href="javascript: void(0)">取消收藏</a></div>
          </div>
          <div className="clear"></div>
        </div>
      );
    });
    return (
      <div className="shrineDom">
        {encourse}
      </div>
    );
  }
}
export default Enshrine;