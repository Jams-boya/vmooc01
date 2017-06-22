import './index.css';
import 'antd/dist/antd.min.css';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import MyNav from 'js/common/menu/MyNav.js';
import common from './common';
import ApplyWithdraw from './withdraw';
import AccountTab from './accountTab';

class MyAccount extends Component {
  constructor(props) {
    super(props);
		this.state = {
			course: [],
		}
	}
	componentDidMount() {
		//生成菜单栏
		$.ajax({
			url: '/menu/list',
			type: 'get',
			data: {
				name: "个人资料"
			},
			success: function (data) {
				let menuBar = ReactDOM.render(
					<MyNav
						nav={data}
					/>,
					document.querySelector('.pubmenu')
				);
			},
			error: function (xhr, status, err) {
				console.error(status, err.toString());
			}
		});
		$('.withdraw').on('click', () => {
			this.apply.showModal();
		});
	}

	render() {
		return (
			<div>
				<AccountTab />
				<ApplyWithdraw
					ref={rc => this.apply = rc}
				/>
			</div>
		);
	}
}

ReactDOM.render(
	<MyAccount />,
	document.querySelector('#laundrylist')
);