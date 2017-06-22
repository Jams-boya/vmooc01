import 'antd/dist/antd.min.css';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import MyNav from 'js/common/menu/MyNav.js';
import CodeTab from './codeTab';
import NewCode from './newCode';

class PromoCode extends Component {
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
				name: "讲师端"
			},
			success: (data) => {
				let menuBar = ReactDOM.render(
					<MyNav
						nav={data}
						queryUrl={'/promoCode'}
					/>,
					document.querySelector('.pubmenu')
				);
			},
		error: (err) => {
				console.log(err);
			}
		});
	}

  render() {
		return (
			<div>
				<CodeTab />
			</div> 
    );
  }
}

ReactDOM.render(
	<PromoCode />,
	document.querySelector('.tableContainer')
);

