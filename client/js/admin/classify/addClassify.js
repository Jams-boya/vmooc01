import _ from 'lodash';
import {Popover, message, Button, Icon} from 'antd';
import React, { Component } from 'react';
import ReactDom from 'react-dom';

class AddClassify extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  };

  componentWillMount() {
    $.ajax({
      url: '/getclassify',
      type: 'get',
      async: false,
      success: (data) => {
        if (data.length != 0) {
          // 学习方向
          this.state[1] = data[1];
          // 课程类型
          this.state[0] = data[0];
        }
      },
      error: (err) => {
          console.log('err is:', err);
      }
    });
  }
  // 添加学习方向
  addDirection() {
    let {values} = this.state[1];
    values.push({
      name: '',
    });
    this.setState({ values });
  }
  // 获取添加的学习方向(可简化)
  handleDirection(index, e) {
    let {values} = this.state[1];
    values[index].name = e.target.value;
    this.setState({ values });
  }
  // 调整学习方向的上下顺序(可简化)
  reorderDirection(change, index) {
    let {values} = this.state[1];
    let dLength = this.state[1].values.length - 1;
    let temp = {};
    //第一个向上切换时跳出
    if (index == 0 && change == "up") {
      return;
    }
    //最后一张且向下切换时跳出
    if (index == dLength && change == "down") {
      return;
    }
    //向上切换
    if (change == "up") {
      temp = values[index];
      values[index] = values[index - 1];
      values[index - 1] = temp;
    }
    //向下切换
    if (change == "down") {
      temp = values[index];
      values[index] = values[index + 1];
      values[index + 1] = temp;
    }
    this.setState({ values });
  }
  // 删除学习方向单行
  deleteDirection(index) {
    let {values} = this.state[1];
    if (this.state[1].values.length == 1) {
      message.warn('请至少保留一个分类');
      return false;
    }
    _.pullAt(values, index);
    this.setState({ values });
  }

  // 添加课程类型
  addCourseType() {
    let {values} = this.state[0];
    values.push({
      name: '',
    });
    this.setState({ values });
  }
  // 获取添加的课程类型
  handleCourseType(index, e) {
    let {values} = this.state[0];
    values[index].name = e.target.value;
    this.setState({ values });
  }
  // 调整课程类型的上下顺序(可简化)
  reorderCourseType(change, index) {
    let {values} = this.state[0];
    let cLength = this.state[0].values.length - 1;
    let temp = {};
    //第一个向上切换时跳出
    if (index == 0 && change == "up") {
      return;
    }
    //最后一张且向下切换时跳出
    if (index == cLength && change == "down") {
      return;
    }
    //向上切换
    if (change == "up") {
      temp = values[index];
      values[index] = values[index - 1];
      values[index - 1] = temp;
    }
    //向下切换
    if (change == "down") {
      temp = values[index];
      values[index] = values[index + 1];
      values[index + 1] = temp;
    }
    this.setState({ values });
  }
  // 删除课程类型单行
  deleteCourseType(index) {
    let {values} = this.state[0];
    if (this.state[0].values.length == 1) {
      message.warn('请至少保留一个分类');
      return false;
    }
    _.pullAt(values, index);
    this.setState({ values });
  }

// 保存并更新学习方向、课程类型
  onSubmit() {
    let result = this.state;
    let a = {};
    a.state0 = this.state[0].values;
    a.state1 = this.state[1].values;
    a.state0.map((i, j) => {
      if (i.name == "") {
        _.pullAt(a.state0, j);
      }
    });
    a.state1.map((x, y) => {
      if (x.name == "") {
        _.pullAt(a.state1, y);
      }
    })
    $.get('/saveAndUpdate', { result });
    message.success('保存成功');
    window.setTimeout("window.location='/coursetype'",1000);
}
render() {
  let direction = this.state[1].values.map((direction, index) => {
    return (
      <div key={index}>
        <table id="direction" className="detail">
          <tbody>
            <tr>
              <td><input type="text" className="addInput" placeholder="添加方向" value={direction.name} onChange={this.handleDirection.bind(this, index)} /></td>
              <td>
                <Icon type="up-square" className="up" onClick={this.reorderDirection.bind(this, 'up', index)}  />&nbsp;
                <Icon type="down-square" className="down" onClick={this.reorderDirection.bind(this, 'down', index)}/>&nbsp;
              </td>
              <td><span className="delete" onClick={this.deleteDirection.bind(this, index)}>删除</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  });

  // 课程类型
  let courseType = this.state[0].values.map((coursetype, index) => {
    return (
      <div key={index}>
        <table id="classNameify" className="detail">
          <tbody>
            <tr>
              <td><input type="text" className="addInput" placeholder="添加类型" value={coursetype.name} onChange={this.handleCourseType.bind(this, index)} /></td>
              <td>
                <Icon type="up-square" className="up" onClick={this.reorderCourseType.bind(this, 'up', index)}/>&nbsp;
                <Icon type="down-square" className="down" onClick={this.reorderCourseType.bind(this, 'down', index)}/>&nbsp;
              </td>
              <td><span className="delete" onClick={this.deleteCourseType.bind(this, index)}>删除</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  });
  return (
    <div>
      <table id="tableTop">
        <tbody>
          <tr>
            <td>课程分类</td>
            <td>移动分类</td>
            <td>操作</td>
          </tr>
        </tbody>
      </table>
      <div className="titlebox">
        <div className="title">课程类型</div>
      </div>
      {courseType}
      <div className="addclassify">
        <button onClick={this.addCourseType.bind(this)}>添加分类</button>
      </div>
      <div className="titlebox">
        <div className="title">学习方向</div>
      </div>
      {direction}
      <div className="addclassify">
        <button onClick={this.addDirection.bind(this)}>添加分类</button>
      </div>
      <div className="save" style={{ marginBottom: 20 }}>
        <button className="save" onClick={this.onSubmit.bind(this)}>保存</button>
      </div>
    </div>
  )
}
}

export default AddClassify;