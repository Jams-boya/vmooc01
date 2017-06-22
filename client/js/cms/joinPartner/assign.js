/** 赋予权限 */
import React, { Component } from 'react';
import {Modal, Row, Col, Checkbox, Tabs, InputNumber, message} from 'antd';
import './assign.css';
class Assign extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      companyName: '',
      modules: [
        {label: '会员管理', value: ['account_manage', 'teacher_application', 'teacher_manage']},
        {label: '课程管理', value: ['course_type', 'course_manage', ]},
        {label: '订单管理', value: ['order_course', 'order_answer', 'order_peek']},
        {label: '提现管理(查看)', value: ['cash']},
        {label: '账户流水管理', value: ['accountdetails']},
        {label: '推荐位管理', value: ['recommend']},
        {label: '平台收入管理', value: ['income']},
        {label: '专题管理', value: ['specialManage']}
      ],
      pages: [
        {label: '顶部公共区域', value: 'top'},
        {label: '底部公共区域', value: 'bottom'},
        {label: '网站logo', value: 'logo'}
      ],
      questionDeduct: [{}, {}, {}],
      courseDeduct: [{}, {}, {}],
      peepDeduct: [{}, {}, {}]
    };
  }

  /** 提交更新 */
  handleOk() {
    console.log('result', this.state);
    let rights = [];
    let deducts = [];
    /** 权限 */
    rights.push({group: 'modules', codes: this.state.modulesVals});
    rights.push({group: 'pages', codes: this.state.pagesVals});
    /** 分成 */
    deducts = [
      {
        type: 'course',
        level: this.state.courseDeduct
      },
      {
        type: 'qa',
        level: this.state.questionDeduct
      },
      {
        type: 'peep',
        level: this.state.peepDeduct
      }
    ];

    $.post('/cms/editrights', {domain: this.state.domain, rights, deducts}, (result) => {
      this.setState({visible: false})      
      message.success('修改成功！');
    });
  }

  /** 取消模态框显示 */
  handleCancel() {
    this.setState({visible: false});
  }

  /** 显示模态框 */
  showModal(domain, companyName, rights, level) {
    const modulesVals = _.find(rights, {group: 'modules'});
    const pagesVals = _.find(rights, {group: 'pages'});
    const courseDeduct = _.find(level, {type: 'course'});
    const questionDeduct = _.find(level, {type: 'qa'});
    const peepDeduct = _.find(level, {type: 'peep'});
    this.setState({
      visible: true, 
      domain, 
      companyName, 
      courseDeduct: this.handleDeductArray((courseDeduct && courseDeduct.level) || []),
      questionDeduct: this.handleDeductArray(questionDeduct && questionDeduct.level || []),
      peepDeduct: this.handleDeductArray(peepDeduct && peepDeduct.level || []),
      modulesVals: modulesVals && modulesVals.codes || [],
      pagesVals: pagesVals && pagesVals.codes || []
    });
  }

  /** 处理分成数组数据 */
  handleDeductArray(array) {
    let result = [];
    for (let i = 0; i < 3; i++) {
      result.push((array && array[i]) || {});
    }
    return result;
  }

  /**
   * 分成管理(change事件)
   * @param {any} location {module, idx, field}
   * @param {any} value 
   * 
   * @memberOf Assign
   */
  onDeductChange(location, value) {
    this.state[`${location.module}Deduct`][location.idx][location.field] = value;
    this.setState(this.state);
  }

  /** 课程content */
  courseDeduct() {
    let courses = [];
    for (let i = 0;i < 3; i++) {
      courses.push((
        <Col className='deductContent' span={24}>
          <Col span={6}>
            总次数 
            <InputNumber onChange={this.onDeductChange.bind(this, {module: 'course', idx: i, field: 'start'})} value={this.state.courseDeduct[i].start} min={0} className='deductInput' />
             - 
            <InputNumber onChange={this.onDeductChange.bind(this, {module: 'course', idx: i, field: 'end'})} value={this.state.courseDeduct[i].end} min={0} className='deductInput' /> 次
          </Col>
          <Col span={4}>平台分成 <InputNumber onChange={this.onDeductChange.bind(this, {module: 'course', idx: i, field: 'commission'})} value={this.state.courseDeduct[i].commission} min={0} className='deductInput' /> % </Col>
          <Col span={6}>课程提供者 <InputNumber onChange={this.onDeductChange.bind(this, {module: 'course', idx: i, field: 'expert'})} value={this.state.courseDeduct[i].expert}  min={0} className='deductInput' /> % </Col>
        </Col>
      ));
    }
    return (
      <Row className='deductContent'>
        <Col span={12} className='deductTitle'>按课程提供者售卖出课程的总次数进行阶梯分成</Col>
        {courses} 
      </Row>
    );
  }

  /** 提问content */
  questionDeduct() {
    let questions = [];
    for (let i = 0;i < 3; i++) {
      questions.push((
        <Col className='deductContent' span={24}>
          <Col span={6}>
            总次数 
            <InputNumber onChange={this.onDeductChange.bind(this, {module: 'question', idx: i, field: 'start'})} value={this.state.questionDeduct[i].start} min={0} className='deductInput' />
             - 
            <InputNumber onChange={this.onDeductChange.bind(this, {module: 'question', idx: i, field: 'end'})} value={this.state.questionDeduct[i].end} min={0} className='deductInput' /> 次
          </Col>
          <Col span={4}>平台分成 <InputNumber onChange={this.onDeductChange.bind(this, {module: 'question', idx: i, field: 'commission'})} value={this.state.questionDeduct[i].commission} min={0} className='deductInput' /> % </Col>
          <Col span={6}>回答者 <InputNumber onChange={this.onDeductChange.bind(this, {module: 'question', idx: i, field: 'expert'})} value={this.state.questionDeduct[i].expert}  min={0} className='deductInput' /> % </Col>
        </Col>
      ));
    }
    return (
      <Row className='deductContent'>
        <Col span={12} className='deductTitle'>按回答者回答问题的总次数进行阶梯分成</Col>
        {questions}
      </Row>
    );
  }

  /** 偷看content */
  peepDeduct() {
    let peeps = [];
    for (let i = 0;i < 3; i++) {
      peeps.push((
        <Col className='deductContent' span={24}>
          <Col span={6}>
            总次数 
            <InputNumber onChange={this.onDeductChange.bind(this, {module: 'peep', idx: i, field: 'start'})} value={this.state.peepDeduct[i].start} min={0} className='deductInput' />
             - 
            <InputNumber onChange={this.onDeductChange.bind(this, {module: 'peep', idx: i, field: 'end'})} value={this.state.peepDeduct[i].end} min={0} className='deductInput' /> 次
          </Col>
          <Col span={4}>平台分成 <InputNumber onChange={this.onDeductChange.bind(this, {module: 'peep', idx: i, field: 'commission'})} value={this.state.peepDeduct[i].commission} min={0} className='deductInput' /> % </Col>
          <Col span={6}>回答者 <InputNumber onChange={this.onDeductChange.bind(this, {module: 'peep', idx: i, field: 'expert'})} value={this.state.peepDeduct[i].expert}  min={0} className='deductInput' /> % </Col>
          <Col span={6}>提问者 <InputNumber onChange={this.onDeductChange.bind(this, {module: 'peep', idx: i, field: 'answer'})} value={this.state.peepDeduct[i].answer}  min={0} className='deductInput' /> % </Col>
        </Col>
      ));
    }
    return (
      <Row className='deductContent'>
        <Col span={12} className='deductTitle'>按提问被他人付费浏览的总次数进行阶梯分成</Col>
        {peeps}
      </Row>
    );
  }

  /** checkbox 选中 */
  onChange(module, e) {
    let result = {};
    result[`${module}Vals`] = e;
    console.log('------------', e, result);
    this.setState(result);
  }

  /** 全选 */
  onAllChecked(module, e) {
    const isChecked = e.target.checked;
    let values = [];
    /** 全选 */
    if(isChecked) 
      values = _.map(this.state[module], 'value');

    let result = {};
    result[`${module}Vals`] = values;
    this.setState(result);
  }

  render() {
    return (
      <div>
        <Modal 
          title="权限管理" 
          width='60%'
          visible={this.state.visible}
          onOk={this.handleOk.bind(this)} 
          okText={'分配权限'}
          onCancel={this.handleCancel.bind(this)}
        >
          <Row>
            <Col span={24} style={{paddingLeft: '10px'}}>
              <h5>公司：{this.state.companyName}</h5>
            </Col>
          </Row>
          {/* 权限管理 */}
          <Row>
            <Col span={24} style={{backgroundColor: '#E4E4E4', 'paddingLeft': '10px'}}>
              <h5><b>权限管理</b><span className='colorGrery'>（为该公司分配管理权限后，该公司仅能管理自身的信息，不能管理其它公司或平台的信息。）</span></h5>
            </Col>
            <Col span={24} className='marginTop'>
              <Col span={4}>
                <Checkbox onChange={this.onAllChecked.bind(this, 'modules')}>网站管理</Checkbox>
              </Col>
              <Col span={18}>
                <Checkbox.Group onChange={this.onChange.bind(this, 'modules')} options={this.state.modules} defaultValue={this.state.modulesVals} value={this.state.modulesVals}></Checkbox.Group>
              </Col>
            </Col>
            <Col span={24} className='marginTop'>
              <Col span={4}>
                <Checkbox onChange={this.onAllChecked.bind(this, 'pages')}>前台网页配置</Checkbox>
              </Col>
              <Col span={18}>
                <Checkbox.Group onChange={this.onChange.bind(this, 'pages')} options={this.state.pages} value={this.state.pagesVals}></Checkbox.Group>
              </Col>
            </Col>
          </Row>

          {/* 分成管理 */}
          <Row>
            <Col span={24} style={{backgroundColor: '#E4E4E4', 'paddingLeft': '10px'}}>
              <h5><b>分成管理</b><span className='colorGrery'>（第三方公司更改分成比例时，需要报备Vmooc平台，以免成为竞争对手。）</span></h5>
            </Col>
            <Col span={24} className='card-container'>
              <Tabs type="card">
                <Tabs.TabPane tab="课程" key="1">
                 {/* 课程Tab */}
                  <Row>
                  {this.courseDeduct()}
                  </Row>
                </Tabs.TabPane>
                <Tabs.TabPane tab="提问" key="2">
                  {/* 提问Tab */}
                  <Row>
                  {this.questionDeduct()}
                  </Row>
                </Tabs.TabPane>
                <Tabs.TabPane tab="偷看" key="3">
                  {/* 偷看Tab */}
                  <Row>
                  {this.peepDeduct()}
                  </Row>
                </Tabs.TabPane>
              </Tabs>
            </Col>
          </Row>

        </Modal>
      </div>
    );
  }
}

export default Assign;