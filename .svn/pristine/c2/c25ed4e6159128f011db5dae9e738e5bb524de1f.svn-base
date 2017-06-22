import _ from 'lodash';
import axios from 'axios';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal, Input, Tooltip, Icon, Button, message, Checkbox, Affix } from 'antd';
class ExamModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      questions: [{
          title: 'adsaldhaslhdlhlsajdlaks',
          options: [
            { optDetail: '仓日安你傻的叫撒刻录机', isTrue: false },
            { optDetail: '你傻的叫撒刻录机', isTrue: false },
            { optDetail: '阿萨德撒大所', isTrue: false },
            { optDetail: '使肌肤的金凤凰个', isTrue: false },
          ],
          result: '',
        }]
    }
  }
  showModal = () => {
    this.setState({ visible: true });
  }

  onCancel = () => {
    this.setState({ visible: false });
  }
  // 选择
  selOption = (queidx, optidx, e) => {
    let { questions } = this.state;
    if (e.target.checked) {
      questions[queidx].options[optidx].isTrue = true;
      questions[queidx].result += optidx;
    } else {
      questions[queidx].options[optidx].isTrue = false;
      questions[queidx].result = questions[queidx].result.replace(optidx, '');
    }
    this.setState({});
  }
  genOpts = (value, index) => {
    if (!value) {
      return;
    }
    return value.options.map((val, idx) => {
      return (
        <div key={idx} style={{ width: '90%' }}>
          <Checkbox onChange={this.selOption.bind(null, index, idx)} style={{ marginLeft: 10 }}>{String.fromCharCode(64 + parseInt(idx))} {val.optDetail}</Checkbox>
        </div>
      )
    });
  }
  render() {
    return (
      <div>
        <Modal
          width={"800"}
          style={{top: 20}}
          visible={this.state.visible}
          footer={null}
          onCancel={this.onCancel}
        >
          <div>
            <h1 style={{ textAlign: 'center' }}>课时《轴流压缩机》测试题</h1>
            <span style={{ fontSize: 16, fontWeight: 600 }}>共有10道不定向选择题，可从中选择一个或多个答案（每题10分，总计100分）</span>
            {this.state.questions.map((question, index) => {
              let options = this.genOpts(question, index);
              return (
                <div style={{ paddingTop: 10 }} key={index}>
                  <span style={{ fontWeight: 500, fontSize: 15 }}>{index+1}、{question.title} ( )</span>
                  {options}
                  <span>我的答案: </span>
                  <div className="clear"></div>
                </div>
              )
            })
            }
            <Button type="primary">交卷</Button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default ExamModal;