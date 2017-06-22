import _ from 'lodash';
import moment from 'moment';
import axios from 'axios';
import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { message, Button, Icon, Tooltip, Modal, Table } from 'antd';

class MyTableList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataField: [],
			curMrow: 0,
		}
		// console.log('this.props.children', this.props.children);
	}

	//设置表头信息（记录字段名、表中对应字段存放的内容类型）
	setDataField(field) {
		this.state.dataField = field;
	}

	//获取字段内容(行内结构)
	getDataField() {
		return this.state.dataField;
	}

	//获取当前要删除的行号
	setDelMrow(idx) {
		this.state.curMrow = idx;
	}

	//删除操作
	onDel(e) {
		if (this.props.onDel) {
			this.props.onDel(this.props.data[this.state.curMrow]);
		}
	}

	render() {
		return (
			<div>
				<table className="table table-hover">
					<MyTableHead setDataField={this.setDataField.bind(this)} showHeader={this.props.showHeader}>
						{this.props.children}
					</MyTableHead>
					<MyTableBody child={this.props.children} getDataField={this.getDataField.bind(this)} mrows={this.props.data}
						onEdit={this.props.onEdit} onDel={this.props.onDel} myClick={this.props.myClick} alert={this.refs.alert} setDelMrow={this.setDelMrow.bind(this)}
						editBtn={this.props.editBtn} delBtn={this.props.delBtn} myBtn={this.props.myBtn} progressBar={this.props.progressBar} btnField={this.props.btnField}
						diffStateClick={this.props.diffStateClick} trHeight={this.props.trHeight} onTrClick={this.props.onTrClick} onImgClick={this.props.onImgClick}
						onIconClick={this.props.onIconClick} onTextClick={this.props.onTextClick} />
				</table>
				{/*是否删除当前记录*/}
				<div className="modal fade" ref="alert" id="alert" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header">
								<button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times; </button>
								<h4 className="modal-title" id="myModalLabel">删除警告</h4>
							</div>
							<div className="modal-body" style={{ textAlign: 'center' }}>
								<h3>是否要删除当前记录</h3>
							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-default" data-dismiss="modal">取消</button>
								<button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.onDel.bind(this)}>删除</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

//表头
class MyTableHead extends Component {
	constructor(props) {
		super(props);
		this.state = {
			columns: null,
		}
	}
	//处理传入的表头
	attachSortFunc() {
		let fieldInfo = [];
		this.state.columns = React.Children.map(this.props.children, (child, idx) => {
			//记录表头信息
			fieldInfo.push({ dataField: child.props.dataField, type: child.props.type });
			return React.cloneElement(
				child,
				{
					key: idx,
				}
			);
		});
		this.props.setDataField(fieldInfo);
	}

	render() {
		this.attachSortFunc();
		return (
			<thead>
				<tr>
					{this.state.columns}
				</tr>
			</thead>
		);
	}
}

//表主体
class MyTableBody extends Component {
	constructor(props) {
		super(props);
		this.state = {
			mrows: this.props.mrows,
			visible: false,
			studyRecord: {},
			studyTab: [],
		}
	}

	//生成表中行信息
	genRows() {
		let dataField = this.props.getDataField();
		let _trs = [];
		let _tds = [];
		let optBtn = [];
		let trStyle = {
			'height': '110px',
			'cursor': 'pointer',
		}
		let tdStyle = {
			'paddingTop': '8px',
		}
		let imgStyle = {
			'width': '100px',
			'height': '65px',
			'backgroundColor': 'lightgrey',

		}
		let iconStyle = {
			'width': '55px',
			'height': '55px',
			'marginTop': '5px',
			'marginBottom': '5px',
			'border': '0px white',
			'borderRadius': '30px',
			'backgroundColor': 'lightgrey',

		}

		let subStyle = {
			'border': '0px',
		}

		if (this.props.trHeight) {
			trStyle.height = this.props.trHeight + 'px';
		}
		if (this.props.mrows != null && this.props.mrows.length != 0) {
			//遍历数据生成行信息
			this.props.mrows.map((mrow, idx) => {
				let _tds = [];
				dataField.map((data, i) => {
					//判断字段对应的数据类型
					let subText;
					let titleText;
					let progressBar;
					let titleField = this.props.child[i].props.titleField;
					let subField = this.props.child[i].props.subField;
					let progressField = this.props.child[i].props.progressField;
					let p_style;
					let tips = this.props.child[i].props.tips;
					let genIcon = this.props.child[i].props.genIcon;
					let tipText;
					let iconBind;
					//图片
					if (data.dataField === "discount") {
						_tds.push(
							<td>
								<a href="#" onClick={this.onTextClick.bind(this, mrow)} className="tooltip-test" data-toggle="tooltip" title={mrow.promoCode}>{mrow.discount}</a>
							</td>
						);
					} else if (data.type == "img") {
						//生成标题、子标题
						if (titleField) {
							titleText = this.genTitle(mrow, titleField);
						} else {
							imgStyle.marginTop = '16px';
						}
						if (subField) {
							subText = this.genSubTitle(mrow, subField);
						}
						_tds.push(
							<td style={tdStyle}>
								{titleText}
								<img onClick={this.onImgClick.bind(this, mrow)} src={mrow[data.dataField]} style={imgStyle} />
								{subText}
							</td>
						);
						//字符  
					} else if (data.type == "text") {
						//生成标题、子标题
						if (titleField) {
							titleText = this.genTitle(mrow, titleField);
						} else {
							p_style = {
								marginTop: '35px',
								marginBottom: '5px'
							};
						}

						if (this.props.trHeight) {
							p_style.marginTop = '5px';
						}

						if (subField) {
							subText = this.genSubTitle(mrow, subField);
						}

						//生成进度条
						if (progressField) {
							p_style = {
								marginBottom: '5px',
								paddingTop: '10px',
								fontSize: '14px'
							};
							progressBar = this.genProgressBar(mrow, progressField);
						}

						//生成提示
						if (tips) {
							tipText = this.genTips(mrow, tips, idx);
						}

						if (genIcon) {
							iconBind = genIcon(mrow);
						}

						_tds.push(
							<td style={tdStyle}>
								{titleText}
								<p style={p_style}>{iconBind} {mrow[data.dataField]} {tipText}</p>
								{subText}
								{progressBar}
							</td>
						);
						//按钮
					} else if (data.type == "btn") {
						//生成标题、子标题
						let style = { paddingTop: '40px', textAlign: 'center' };
						if (titleField) {
							titleText = this.genTitle(mrow, titleField);
						}
						if (subField) {
							subText = this.genSubTitle(mrow, subField);
						}
						// console.log(mrow.stateBtn);
						if (mrow.stateBtn && mrow.stateBtn.btn && mrow.stateBtn.btn.length >= 3) {
							style = {
								paddingTop: '18px',
								textAlign: 'center',
							}
						}

						_tds.push(
							<td style={style}>
								{titleText}
								{this.genOptBtn(mrow, idx)}
								{subText}
							</td>
						);
						//头像
					} else if (data.type == "icon") {
						//生成标题、子标题
						if (titleField) {
							titleText = this.genTitle(mrow, titleField);
						}
						if (subField) {
							subText = this.genSubTitle(mrow, subField);
						}
						_tds.push(
							<td style={tdStyle}>
								{titleText}
								<img src={mrow[data.dataField]} style={iconStyle} onClick={this.onIconClick.bind(this, mrow)} />
								{subText}
							</td>
						);
					}
				});

				_trs.push(
					<tr style={trStyle} onClick={this.onTrClick.bind(this, mrow)}>
						{_tds}
				</tr>);
			});
		} else {
			let _tds = [];

			dataField.map((data, i) => {
				if (data.type == "text") {
					_tds.push(<td>
						<p>无</p>
					</td>);
				} else if (data.type == "img") {
					//图片                         
					_tds.push(
						<td>
							无
						</td>
					);
				} else if(data.type == "btn"){
					_tds.push(<td style={{ textAlign:'center' }}>
						无
					</td>);
				} else {
					_tds.push(<td>
						无
					</td>);
				}
			});

			_trs.push(
				<tr style={trStyle}>
					{_tds}
				</tr>);
		}
		 return _trs;
	}

	//生成提示
	genTips(mrow, field, idx) {
		let tipStyle = {
			cursor: 'pointer',
			position: 'relative',
		}

		let tipDivStyle = {
			position: 'absolute',
			top: '-2px',
			left: '20px',
			zIndex: '999',
			border: '1px solid #e1e1e1',
			borderRadius: '4px',
			backgroundColor: '#FDE492',
			padding: '5px 5px 10px 5px',
			display: 'none',
			width: '200px',
			wordWrap: 'break-word',
		}

		function mouseTipShow(e) {
			$('#' + e.target.id).children('.tipDiv').show();
		}
		function mouseTipHide(e) {
			$('#' + e.target.id).children('.tipDiv').hide();
		}
		if (mrow.state == '售卖中' || mrow.state == '建设中' || mrow.state == '视频转码中') {
			return (<span></span>);
		} else {
			let spTip = '';
			if (mrow[field] == '' || !mrow[field]) {
				spTip = '';
			} else {
				spTip = <div className="tipDiv" style={tipDivStyle}>{mrow[field]}</div>
			}
			return (<span className="tipSpan" id={idx} style={tipStyle} onMouseMove={mouseTipShow.bind(this)} onMouseOut={mouseTipHide.bind(this)} className="glyphicon glyphicon-exclamation-sign">
				{spTip}
			</span>);
		}
	}

	//生成字段标题
	genTitle(mrow, field) {
		let titleStyle = {
			color: 'lightgrey',
			fontSize: '14px'
		}
		let title = "";
		if (field == 'order' || field == 'sn' || field == 'ordersCode') {
			title = "订单号:";
		}
		return (<p style={titleStyle}>{title}{mrow[field]}</p>)
	}

	//生成子标题
	genSubTitle(mrow, field) {
		let subStyle = {
			border: '0px',
			fontSize: '14px',
		}
		if (field == 'price' || field == 'itemAmount' || field == 'actualPay') {
			if (mrow[field])
				return (<p style={{ color: 'red', marginTop: '14px', fontSize: '14px' }}>￥{mrow[field].toFixed(0)}</p>)
		}
		if (field == 'promoCode') {
			if (mrow[field])
				return (<p style={{ color: 'lightgrey', fontSize: '12px' }}>优惠码:{mrow[field]}</p>)
		}
		return (<p style={subStyle}>{mrow[field]}</p>)
	}

	//生成操作按钮
	genOptBtn(mrow, idx) {
		let btns = [];
		if (this.props.editBtn) {
			btns.push(<button id={idx} className="btn btn-default" onClick={this.onEdit.bind(this)}>
				{this.props.editBtn}
			</button>);
		}
		if (this.props.delBtn) {
			btns.push(<button id={idx} className="btn btn-default" data-toggle="modal" data-target="#alert"
				onClick={this.getDelMrow.bind(this)}>
				{this.props.delBtn}
			</button>);
		}
		//自定义按钮
		if (this.props.myBtn) {
			let btnStr = '';
			for (let val in mrow) {
				if (this.props.myBtn == val) {
					btnStr = mrow[val];
				}
			}

			if (btnStr != "") {
				btns.push(
					<button id={idx} className="btn btn-default" onClick={this.myClick.bind(this)}>
						{btnStr}
					</button>
				);
			}
		}

		//根据状态生成按钮
		if (this.props.btnField) {
			let styleSpan = { width: '113px', height: '26px', fontSize: '14px' };
			mrow.stateBtn.btn.map(btn => {
				if (btn.type == "<a>") {
					btns.push(<br></br>);
					btns.push(
						<span style={styleSpan}>
							<a id={idx} className={btn.event} onClick={this.stateBtnClick.bind(this, btn)}>
								{btn.field}
							</a>
						</span>
					);
				} else {
					btns.push(
						<button id={idx} className={btn.event} className="btn btn-default" onClick={this.stateBtnClick.bind(this, btn)}>
							{btn.field}
						</button>
					);
				}
			});
		}


		return (<div>{btns}</div>);
	}

	onLinkClick = (studyRecord) => {
		$.ajax({
			type: "post",
			url: '/queryStudyRecord',
			data: studyRecord,
			async: false,
			success: res => {
				this.state.studyTab = res;
				// console.log(this.state.studyTab);
			},
			error: err => console.error('err', err)
		});
		this.setState({ studyRecord, visible: true });
	}
	onCancel = () => {
		this.setState({ visible: false });
	}

	//生成课程进度条(非通用)
	genProgressBar(mrow, field) {
		// console.log(mrow, + "------------" +  field);
		let progressBar;
		let learnButton;
		let learnRecord;
		let percent;
		//---测试数据---
		// if (!mrow.speedStu) {
		// 	mrow.speedStu = {
		// 		courseCount: 20,
		// 		lookedCount: 2,
		// 	}
		// }
		
		learnButton = mrow.speedStu.lookedCount == 0 ? "开始学习" : "继续学习";
		learnRecord = mrow.speedStu.lookedCount !== 0 ? "查看学习记录" : "";

		//--------------
		// console.log(mrow);
		percent = (mrow.speedStu.lookedCount / mrow.speedStu.courseCount) * 100 >= 100 ? 100
			: ((mrow.speedStu.lookedCount / mrow.speedStu.courseCount) * 100).toFixed(0);
		let barStyle = {
			width: percent + '%',
			height: '8px',
			backgroundColor: "grey"
		}
		let startAt = new Date();
		let endAt = new Date();
		if (mrow.startAt) {
			startAt = new Date(mrow.startAt).toLocaleDateString() + "开始";
		}

		if (mrow.endAt) {
			endAt = new Date(mrow.endAt).toLocaleDateString() + "结束";
		}

		progressBar = (
			<div className="progressBar" style={{ marginTop: '14px', backgroundColor: 'lightgrey', width: '66%', height: '8px', float: 'left' }}>
				<div className="currentPercent" style={barStyle}></div>
			</div>
		);
		const columns = [{
			title: '章节',
			dataIndex: 'chapterIdx',
			key: 'chapterIdx',
			render: text => <span style={{ fontSize: 12 }}>第{text}章</span>
		}, {
			title: '课时标题',
			dataIndex: 'clazzName',
			key: 'clazzName',
			render: text => <span style={{ fontSize: 12 }}>{text}</span>
		}, {
			title: '课时时间',
			dataIndex: 'time',
			key: 'time',
			render: text => <span style={{ fontSize: 12 }}>{Number(text / 60).toFixed(0)}分钟</span>
		}, {
			title: '是否完成学习',
			dataIndex: 'isFinish',
			key: 'isFinish',
			render: text => <span style={{ fontSize: 12 }}>{text ? '是' : '否'}</span>
		}, {
			title: '初考成绩',
			dataIndex: 'beginScore',
			key: 'beginScore',
			render: text => {
				// console.log(text);
				return (<span style={{ fontSize: 12 }}>{!!text ? `${text}分` : `未测试`}</span>);
			} 
		}, {
			title: '重考成绩',
			dataIndex: 'lastScore',
			key: 'lastScore',
			render: text => <span style={{ fontSize: 12 }}>{!!text ? `${text}分` : `未重考`}</span>
		}];

		const subSpanStyle = {
			fontSize: 15,
		}
		// console.log(this.state.studyRecord.name);
		return (
			<div>
				{/*学习记录详情*/}
				<div>
					<Modal
						width={"800"}
						style={{ top: 20 }}
						visible={this.state.visible}
						footer={null}
						onCancel={this.onCancel}
					>
						<div>
							<h1 style={{ marginTop: 0, color: '#000' }}>《{this.state.studyRecord.name}》学习记录</h1>
							<p style={subSpanStyle}>学习时间: 共学习{this.state.studyRecord.progress && (_.sum(this.state.studyRecord.progress.map(pt => Number(pt.playTime))) / 60).toFixed(0)}分钟</p>
							<p style={subSpanStyle}>课程总完成进度 { this.state.studyRecord.progress && ((this.state.studyRecord.speedStu.lookedCount / this.state.studyRecord.speedStu.courseCount) * 100) < 100 ? ((this.state.studyRecord.speedStu.lookedCount / this.state.studyRecord.speedStu.courseCount) * 100).toFixed(0) : 100 }%</p>
							<h4>学习记录详情</h4>
							<Table
								size={'small'}
								columns={columns}
								dataSource={this.state.studyTab}
							/>
						</div>
					</Modal>
				</div>
				<div className="name" style={{ color: 'grey', fontSize: '13px', marginTop: '5px' }}>
					共{mrow.speedStu.courseCount}课时,已完成{mrow.speedStu.lookedCount  }课时
				</div>
				<div style={{ width: '16%', float: 'left', color: 'grey', fontSize: '13px', marginTop: '8px' }}>{startAt}</div>
				{progressBar}
				<div style={{ marginLeft: '15px', marginTop: '8px', width: '16%', float: 'left', color: 'grey', fontSize: '13px', }}>{endAt}</div>
				<div style={{ width: '16%', marginLeft: '16%', float: 'left', color: 'grey', fontSize: '14px', }}>已完成{percent}%</div>
				<button style={{ float: 'right', marginRight: '136px', width: '72px', height: '28px', fontSize: '12px', borderRadius: '5px', textAlign: 'center' }} className="btn btn-success" onClick={() => { window.location.href = '/player/' + mrow.courseId; }}>{learnButton}</button>
				{/* 查看学习进度*/}
				<a href="#" style={{ float: 'right', height: '28xp', fontSize: '14px', marginTop: '30px', marginRight: '-77px' }} onClick={this.onLinkClick.bind(this, mrow)}>{learnRecord}</a>
			</div>
		);
	}

	//编辑操作
	onEdit(e) {
		if (this.props.onEdit)
			this.props.onEdit(this.props.mrows[e.target.id]);
	}

	//获取要删除的行号
	getDelMrow(e) {
		let idx = Number(e.target.id);
		this.props.setDelMrow(idx);
	}

	//自定义按钮点击事件
	myClick(e) {
		if (this.props.myClick) {
			this.props.myClick(this.props.mrows[e.target.id]);
		}
	}

	//根据状态匹配按钮事件
	stateBtnClick(btn, e) {
		if (this.props.diffStateClick) {
			this.props.diffStateClick(this.props.mrows[e.target.id], btn);
		}
	}

	onTrClick(mrow, e) {
		if (this.props.onTrClick) {
			this.props.onTrClick(mrow);
		}
	}

	onImgClick(mrow, e) {
		if (this.props.onImgClick) {
			this.props.onImgClick(mrow);
		}
	}

	onIconClick(mrow, e) {
		if (this.props.onIconClick) {
			this.props.onIconClick(mrow);
		}
	}
	onTextClick(mrow, e) {
		if (this.props.onTextClick) {
			this.props.onTextClick(mrow);
		}
	}

	render() {
		let trStyle = {
			'height': '110px',
		}
		let imgStyle = {
			'width': '100px',
			'height': '56px',
		}
		let alertStyle = {
			position: 'absolute',
			top: '500px',
			width: '400px',
			height: '240px',
		}
		return (
			<tbody>
				{this.genRows()}
			</tbody>
		);
	}
}

//提示模态框
class alertModal extends Component {
	constructor() {
		super(props);
	}
	style = {
		position: 'absolute',
	}
	render() {
		return (
			<div className="modal fade" id="alert" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times; </button>
							<h4 className="modal-title" id="myModalLabel">删除警告</h4>
						</div>
						<div className="modal-body" style={{ textAlign: 'center' }}>
							<h3>是否要删除当前记录</h3>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-default" data-dismiss="modal">取消</button>
							<button type="button" className="btn btn-primary" onClick={this.props.onDel}>删除</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default MyTableList;


