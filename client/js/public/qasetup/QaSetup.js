import './qasetup.css';
import _ from 'lodash';
import { message, Button } from 'antd';
import React, { Component } from 'react';
import ReactDom from 'react-dom';

class QaSetup extends Component {
	constructor(props) {
		super(props);
		this.state = {
      msg:{
        money: "",
        systemMsg: "",
        emailMsg: "",
      }
		}
    $.ajax({
      url: '/getMsg',
      type: 'get',
      success: (data) => {
        let {msg} = this.state;
        if (data) {
          return this.setState({ msg: data });
        } else {
          return this.setState({ msg: "" });
        }
      },
      error: (err) => {
        console.log('err', err);
      }
    });
	};

  // 获取价钱
  handleCost(e) {
    let value = e.target.value;
    if (isNaN(value)) {
      message.warn("请输入数字!");
      return false;
    }
    this.state.msg.money = value;
    this.setState(this.state);
  }
  // 通知方式的选择-系统消息
  handleCheck1(e) {
    let value = e.target.checked;
    this.state.msg.systemMsg = value;
    this.setState(this.state);
  }
  // 通知方式的选择-邮件消息
  handleCheck2(e) {
    let value = e.target.checked;
    this.state.msg.emailMsg = value;
    this.setState(this.state);
  }
  // 确认点击
	onSubmit() {
    let Msg = {
      money: ReactDom.findDOMNode(this.refs.cost).value,
      systemMsg: ReactDom.findDOMNode(this.refs.systemMsg).checked,
      emailMsg:ReactDom.findDOMNode(this.refs.emailMsg).checked,
    }
    let setup = Msg;
    $.post("/submit/qasetup", {setup}, (result) => {
    if (result.nModified == 1) {
      message.success('修改成功');
      window.setTimeout("window.location='/qasetup'",1000);
    } else {
      message.warn('您未做任何修改！');
    }
  });
  }
	render() {
		return (
			<div>
        <div id="costdiv">向我提问需要花费&nbsp;<input type="text" id="cost" ref="cost" value={this.state.msg.money} onChange={this.handleCost.bind(this)}/>&nbsp;元</div>
        <div id="msgdiv">
          <span className="msgInfo">收到提问的通知方式</span>
          <input ref="systemMsg" id="msg" type="checkbox" checked={this.state.msg.systemMsg} onChange={this.handleCheck1.bind(this)}/>&nbsp; 系统消息
          <input ref="emailMsg" id="email" type="checkbox" checked={this.state.msg.emailMsg} onChange={this.handleCheck2.bind(this)}/>&nbsp; 邮件
        </div>
				<div id="footer">
					<button type="button" id="submitbtn" onClick={this.onSubmit.bind(this)}>确定</button>
				</div>
			</div>
		)
	}
}

export default QaSetup;