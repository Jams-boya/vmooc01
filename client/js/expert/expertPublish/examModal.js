import _ from 'lodash';
import axios from 'axios';
import 'antd/dist/antd.min.css';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal, Input, Tooltip, Icon, Button, message, Popover, Dropdown, Menu, Checkbox, Affix } from 'antd/dist/antd.min.js';

class ExamModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      data: {
        clazzName: '',
        createId: guser._id,
        createName: guser.name,
        questions: [{
          title: '',
          options: [
            { optDetail: '', isTrue: false },
            { optDetail: '', isTrue: false },
            { optDetail: '', isTrue: false },
            { optDetail: '', isTrue: false },
          ],
          result: '',
        }],
      }
    }
  }
  // 显示新增或比编辑题库页面
  showModal = (examTplId, clazzName, clazzIdx, tocIdx) => {
    this.setState({ clazzIdx, tocIdx });
    if (!examTplId) {
      this.state.visible = true;
      this.state.data = {
        clazzName,
        createId: guser._id,
        createName: guser.name,
        questions: [{
          title: '',
          options: [
            { optDetail: '', isTrue: false },
            { optDetail: '', isTrue: false },
            { optDetail: '', isTrue: false },
            { optDetail: '', isTrue: false },
          ],
          result: '',
        }],
      }
      this.setState({});
    } else {
      axios.get(`/showExamByClazz?examTplId=${examTplId}`).then(res => {
        this.setState({ data: res.data, visible: true });
      }).catch(err => console.error('err', err));
    }
  }
  // 关闭
  handleCancel = () => {
    this.setState({ visible: false });
  }
  // 删除单个是试题
  delQuestion = (index) => {
    if (this.state.data.questions.length === 1) {
      return;
    }
    _.pullAt(this.state.data.questions, index);
    this.setState({});
  }

  // 题目标题
  handleTitle = (index, e) => {
    this.state.data.questions[index].title = e.target.value;
    this.setState({});
  }
  // 新增选项
  newOption = (index) => {
    if(this.state.data.questions[index].options.length >= 6){
       message.warn('答案不能找过六个');
        return;
    };
    this.state.data.questions[index].options.push({
      optDetail: '',
      isTrue: false,
    });
    this.setState({});
  }
  // 选项内容
  handleOption = (queidx, optidx, e) => {
    this.state.data.questions[queidx].options[optidx].optDetail = e.target.value;
    this.setState({});
  }
  // 勾选
  selOption = (queidx, optidx, e) => {
    let { questions } = this.state.data;
    if (e.target.checked) {
      questions[queidx].options[optidx].isTrue = true;
      questions[queidx].result += optidx;
    } else {
      questions[queidx].options[optidx].isTrue = false;
      questions[queidx].result = questions[queidx].result.replace(optidx, '');
    }
    questions[queidx].result = _.join([...questions[queidx].result], '');
    this.setState({});
  }
  // 删除
  delOption = (queidx, optidx) => {
    let { options } = this.state.data.questions[queidx];
    let { result } = this.state.data.questions[queidx];
    _.pullAt(options, optidx);
    if(options.length < 2){
          message.warn('答案不能少于2个');
          return;
    };
    if (result.includes(optidx)) {
      result = result.replace(optidx, '');
    }
    if (result.includes(optidx)) {
      result = result.replace(optidx, '');
    }
    this.setState({});
  }
  // 新建试题
  newQuestion = () => {
    this.state.data.questions.unshift({
      title: '',
      options: [
        { optDetail: '', isTrue: false },
        { optDetail: '', isTrue: false },
        { optDetail: '', isTrue: false },
        { optDetail: '', isTrue: false },
      ],
      result: '',
    });
    this.setState({});
  }
  // 保存试题
  saveQuestions = () => {
    console.log('this.state.questions.data :', this.state.data);
    if (this.state.data.questions.length < 15) {
      message.warn('考题数不可低于15个!');
      return;
    }
    axios.post('/saveExamByClazz', { data: this.state.data }).then(res => {
      if (res.data._id) {
        this.setState({ visible: false });
        // this.tocEditor.state.toc[this.state.tocIdx].clazz[this.state.clazzIdx].examTplId = res.data._id;
        // this.tocEditor.setState({});
      }
    }).catch(err => console.log('err', err));

    for(let f of this.state.data.questions){
      if(f.title == ""){
        message.warn('题目标题不能为空');
        return;
      }
    };
    for(let s of inputs){
      if(s.value == ""){
        message.warn('题目答案不能为空');
        return;
      }
    };
  }
  /*
   * 题目生成选项
   * @param {String} value 所有选择题
   * @param {any} index 第几道选择题
   * @param {any} val 每个选择题选项
   * @param {any} idx 第几个选择题选项
   */
  genOpts = (value, index) => {
    if (!value) {
      return;
    }
    return value.options.map((val, idx) => {
      return (
        <div key={idx} style={{ width: '90%' }}>
          <Input addonBefore={<Checkbox onChange={this.selOption.bind(null, index, idx)} checked={val.isTrue}></Checkbox>}
            addonAfter={<Icon type="close" onClick={this.delOption.bind(null, index, idx)} />} value={val.optDetail} onChange={this.handleOption.bind(null, index, idx)} />
        </div>
      )
    });
  }
  render() {
    const menu = (
      <Menu>
        <Menu.Item key="0">
          <a href="#">Excel导入试题<Icon type="cloud-upload-o" /></a>
        </Menu.Item>
        <Menu.Item key="1">
          <a href="#">Excel导出试题<Icon type="download" /></a>
        </Menu.Item>
        <Menu.Item key="2">
          <a href="#">批量删除试题<Icon type="delete" /></a>
        </Menu.Item>
      </Menu>
    );
    return (
      <div>
        {/*<TocEditor ref={rc => this.tocEditor = rc} />*/}
        <Modal
          title={this.state.title}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          width={1000}
          style={{ top: 20 }}
          maskClosable={false}
          footer={null}
        >
          <div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>新建试题(当前课程: {$('#name').val()})</div>
            {/*<Affix offsetTop={120} onChange={affixed => console.log(affixed)}>*/}
            <Button id="newQuestions" onClick={this.newQuestion.bind(null)}>新建试题</Button>
            {/*</Affix> */}
            {/*<Affix offsetTop={120} onChange={affixed => console.log(affixed)}>*/}
            <Button id="saveQuestions" onClick={this.saveQuestions.bind(null)}>保存试题</Button>
            {/*</Affix>   */}
            <Dropdown overlay={menu} trigger={['click']}>
              <a className="ant-dropdown-link" href="#">更多操作<Icon type="down" /></a>
            </Dropdown>
            <p style={{ color: "lightgrey", fontSize: 12 }}>小提示：为了保证考试效果，建议考题数不得小于15道题，当前共4道题</p>
            {this.state.data.questions.map((question, index) => {
              let options = this.genOpts(question, index);
              return (
                <div style={{ paddingTop: 10 }} key={index}>
                  <span style={{ fontWeight: 500, fontSize: 15 }}>题目标题</span>
                  <Input type="textarea" placeholder="填写题目标题" autosize value={question.title} onChange={this.handleTitle.bind(null, index)} style={{ width: '90%', display: 'block' }} />
                  <span style={{ fontWeight: 500, fontSize: 12, display: 'inline' }}>题目答案(请选中1个或多个选项，作为正确答案)</span>
                  {options}
                  <Button size="small" onClick={this.newOption.bind(null, index)}>新增选项</Button>
                  <Button size="small" style={{ float: 'right', marginRight: '10%' }} onClick={this.delQuestion.bind(null, index)}>删除题目</Button>
                  <div className="clear"></div>
                </div>
              )
            })
            }
          </div>
        </Modal>
      </div>
    );
  }
}

export default ExamModal;
