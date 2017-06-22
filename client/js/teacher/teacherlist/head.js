import './index.css';

import moment from 'moment';
import util from 'js/common/myform/util';
import React, { Component } from 'react';
import config from '../../../../server/config';

class componentName extends Component {
	constructor(props) {
		super(props);
		this.state = {
			type: this.props.type || "text",
			label: this.props.label,
			label1: this.props.label1,
			label2: this.props.label2,
			label3: this.props.label3,
			field: this.props.field,
			avatar: this.props.avatar,
			nickName: this.props.nickName,
			field1: this.props.field1,
			field2: this.props.field2,
			field3: this.props.field3,
			value: this.props.defaultValue || '',
			value1: this.props.defaultValue1 || '',
			value2: this.props.defaultValue2 || '',
			value3: this.props.defaultValue3 || '',

		}
		this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		const {initData} = nextProps;
		let v = '', v1 = '', v2 = '', v3 = '', avatar = '', nickName = '';

		if (initData) {
			v = util.getFieldVal(initData, this.state.field);
			v1 = util.getFieldVal(initData, this.state.field1);

			avatar = util.getFieldVal(initData.user, 'Avatar');
			if (this.state.field2) {
				v2 = util.getFieldVal(initData, this.state.field2);
			}
			if (this.state.field3) {
				v3 = util.getFieldVal(initData, this.state.field3);
			}
			this.setState({
				value: v,
				value1: v1,
				value2: v2,
				value3: v3,
				avatar: avatar,

			});
		}
	}
	handleChange(event) {
		let value = event.target.value;
		this.setState({ value: value });

		if (this.props.onHandleChange) {
			this.props.onHandleChange({ [this.state.field]: value });
		}
	}
	render() {
		//debugger

		if (this.props.initData) {

		}
		let date = '';
		let date1 = '';
		let validClass = '';//this.valid() ? 'has-success' : 'has-error'; 
		let className = this.props.className;
		let avatar = '/' + this.state.avatar;
		// if (this.state.avatar === "/img/prot.png") {
			avatar = `${config.avatorUrl}/uploadPic/${this.state.avatar}`;
		// }

		// if (!this.state.avatar) {
		// 	avatar = "/img/prot.png";
		// }

		if (this.props.style) {
			className += ' ' + this.props.style(this.state.value);
		}
		if (this.state.value2) {
			date = moment(this.state.value2).format('YYYY-MM-DD HH:mm');
		}
		if (this.state.value3) {
			date1 = moment(this.state.value3).format('YYYY-MM-DD HH:mm');
		}

		return (

			<div className="row">
				<div className="col-md-2">
					<img src={avatar} className="img-rounded pull-right size" />
				</div>
				<div className="col-md-10">

					<div className={className}>
						<label className="control-label col-md-3 col-sm-3 col-xs-12">
							{this.state.label}
						</label>
						<div className="col-md-9 col-sm-9 col-xs-12">
							<p className="form-control-static">{this.state.value}</p>
						</div>
					</div>
					<div className={className}>
						<label className="control-label col-md-3 col-sm-3 col-xs-12">
						</label>
						<div className="col-md-9 col-sm-9 col-xs-12">
							<p className="form-control-static"></p>
						</div>
					</div>

					<div className={className}>
						<label className="control-label col-md-3 col-sm-3 col-xs-12">
							{this.state.label1}
						</label>
						<div className="col-md-9 col-sm-9 col-xs-12">
							<p className="form-control-static">{this.state.value1}</p>
						</div>
					</div>
					<div className={className}>
						<label className="control-label col-md-3 col-sm-3 col-xs-12">
						</label>
						<div className="col-md-9 col-sm-9 col-xs-12">
							<p className="form-control-static"></p>
						</div>
					</div>

					<div className={className}>
						<label className="control-label col-md-3 col-sm-3 col-xs-12">
							{this.state.label2}
						</label>
						<div className="col-md-9 col-sm-9 col-xs-12">
							<p className="form-control-static">{date}</p>
						</div>
					</div>
					<div className={className}>
						<label className="control-label col-md-3 col-sm-3 col-xs-12">
						</label>
						<div className="col-md-9 col-sm-9 col-xs-12">
							<p className="form-control-static"></p>
						</div>
					</div>

					<div className={className}>
						<label className="control-label col-md-3 col-sm-3 col-xs-12">
							{this.state.label3}
						</label>
						<div className="col-md-9 col-sm-9 col-xs-12">
							<p className="form-control-static">{date1}</p>
						</div>
					</div>

				</div>
			</div>
		);
	}
}

export default componentName;