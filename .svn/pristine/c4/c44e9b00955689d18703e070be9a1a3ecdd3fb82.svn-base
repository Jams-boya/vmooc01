import _ from 'lodash';
import { message, Button } from 'antd';
import Tip from 'arale-tip';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import ReactDom from 'react-dom';

class ModifyPwd extends Component {
	constructor(props) {
		super(props);
		this.state = {
			password:"",
			newPassword:"",
			repeatPassword:"",
		}
	};
	// 获取原密码
	handleChange(e) {
		let oldpwd = e.target.value;
		this.setState({ password: oldpwd });
		this.state.password = oldpwd;
	}
	// 原密码-触发焦点
	getFocus() {
		$(this.refs.pwdBubble).html("");
	}
	// 原密码-离开焦点
	getBlur() {
		let pwd = this.state.password;
		$.post('/checkpwd', { pwd }, (result) => {
			if (result.error == "旧密码输入错误!") {
				$(this.refs.pwdBubble).html(result.error);
				return false;
			} else {
				$(this.refs.pwdBubble).html("");
			}
		});
	}
	// 获取新密码
	handlePassword(e) {
		let newpwd =e.target.value;
		this.setState({ newPassword: newpwd });
		this.state.newPassword = newpwd;
		let re = /^(\w){8,20}$/;
		if (re.test(this.state.newPassword) == false) {
			$(this.refs.newpwdBubble).html("8-20位字符，只能由英文字母、数字组成，不能含空格及其他符号!");
			$(this.refs.newpwdBubble).css("color", "#D9DADB");
			return false;
		}
	}
	// 新密码-离开焦点
	getNewBlur() {
		let value =this.state.newPassword;
		let re = /^(\w){8,20}$/;
		if (re.test(value) == false) {
			$(this.refs.newpwdBubble).html("8-20位字符，只能由英文字母、数字组成，不能含空格及其他符号!");
			return false;
		} else {
			$(this.refs.newpwdBubble).html("");
		}
	}
	// 获取重复输入的密码
	handleRepeat(e) {
		let repeatpwd = e.target.value;
		this.setState({ repeatPassword: repeatpwd });
		this.state.repeatPassword = repeatpwd;
	}
	// 重复输入密码-触发焦点
	RepeatBlur() {
		let value =this.state.newPassword;
		let re = /^(\w){8,20}$/;
		if (re.test(value) == false) {
			$(this.refs.newpwdBubble).html("8-20位字符，只能由英文字母、数字组成，不能含空格及其他符号!");
			$(this.refs.newpwdBubble).css("color", "red");
			return false;
		}
	}

	// 更改确认
	onSubmit() {
		let pwd = this.state.password;
		// 确认原密码是否正确
		$.post('/checkpwd', { pwd }, (result) => {
			if (result.error == "旧密码输入错误!") {
				$(this.refs.pwdBubble).html(result.error);
				return false;
			} else {
				$(this.refs.pwdBubble).html("");
			}
		});
		let re = /^(\w){8,20}$/;
		if (re.test(this.state.newPassword) == false) {
			$(this.refs.newpwdBubble).html("8-20位字符，只能由英文字母、数字组成，不能含空格及其他符号!");
			$(this.refs.newpwdBubble).css("color", "red");
			message.warn('新密码按规则修改');
			return false;
		} else if (this.state.repeatPassword != this.state.newPassword) {
			$(this.refs.repeatBubble).html("两次密码输入不一致!");
			$(this.refs.repeatBubble).css("color", "red");
			return false;
		} else {
			$(this.refs.repeatBubble).css("color", "#D9DADB");
			$(this.refs.repeatBubble).html("验证通过！");
			// 保存密码
			let pwds = this.state;
			$.post("/submit/modifypwd", {pwds}, (result) => {
				if (result.nModified == 1) {
					message.success('修改成功！');
					window.setTimeout("window.location='/signin'",2000);
				} else {
					return false;
				}
		});
		}
	}
	render() {
		return (
			<div>
				<table>
				<tbody>
					<tr>
						<td><span className="star">* </span>当前密码:</td>
						<td>
							<input type="password" placeholder="请输入原密码" name="password" className="pholder" value = {this.state.password}
								onChange={this.handleChange.bind(this)} onFocus={this.getFocus.bind(this)} onBlur={this.getBlur.bind(this)} />
							<span ref="pwdBubble" className="newtip" style={{display:"block",color:"red"}}></span>
						</td>
					</tr>
					<tr>
						<td><span className="star">* </span>新密码:</td>
						<td>
							<input type="password" placeholder="请输入新密码" name="newpassword" className="pholder"
									onChange={this.handlePassword.bind(this)} onBlur={this.getNewBlur.bind(this)}/>
							<span ref="newpwdBubble" className="newtip" style={{display:"block"}}></span>
						</td>
					</tr>
					<tr>
						<td><span className="star">* </span>确认新密码:</td>
						<td>
							<input type="password" placeholder="请再一次输入新密码" name="repeatPassword" className="pholder"
									onChange={this.handleRepeat.bind(this)} onFocus={this.RepeatBlur.bind(this)}/>
							<span ref="repeatBubble" className="newtip" style={{display:"block"}}></span>
						</td>
        	</tr>
					<tr>
						<td colSpan="2">
							<div id="footer">
								<button type="button" id="submitbtn" onClick={this.onSubmit.bind(this)}>确定</button>
							</div>
            </td>
          </tr>
					</tbody>
				</table>
			</div>
		)
	}
}

export default ModifyPwd;