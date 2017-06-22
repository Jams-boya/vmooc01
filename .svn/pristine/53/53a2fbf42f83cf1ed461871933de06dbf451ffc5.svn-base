/** 提现 */
import {Modal, Form, Button, Row, Col, Steps} from 'antd';
import 'antd/dist/antd.min.css';
import React, {Component} from 'react';
import SelectMyCard from './selectMyCard';
const FormItem = Form.Item;
const Step = Steps.Step;

class ApplyWithdraw extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.step = 1;
    this.state.title = '提现到银行卡';
    this.state.loading = false;
  }

  /** */
  showModal() {
    this.setState({visible: true});
  }
  handleOk() {
    this.setState({
      confirmLoading: true,
    });
    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false,
      });
    }, 2000);
  }
  handleCancel() {
    this.setState({
      visible: false,
    });
  }

  /** 保存提现信息 */
  saveWithdrawInfo() {
    const form = this.refs.withDrawInfo;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.state.withdraw = values;
      this.setState(this.state);
      this.goNext();

    });
  }

  /** 第一步 
   *  选择银行卡和提现金额
  */
  showStepOne() {
    return (
      <SelectMyCard ref = 'withDrawInfo'></SelectMyCard>
      );
  }

  /** 第二步 
   * 提现确认
  */
  showStepTwo() {
    /** 单行排布layout */
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };
    return (
      <Form horizontal>
        <FormItem label="支付宝账号" {...formItemLayout}>
          <span>{this.state.withdraw.alipay}</span>
        </FormItem>
        <FormItem label="提现金额" {...formItemLayout}>
          <span>{Number(this.state.withdraw.amt).toFixed(2)}元</span>
        </FormItem>
        <FormItem label="到账时间" {...formItemLayout}>
          <span> 预计72小时 </span>
        </FormItem>
      </Form>
    );
  }

  /**
   * 第三步
   * 温馨提示
   */
  showStepThree() {
    return (
      <Row type="flex" justify="center">
        <Col className = 'step' span = {16} style = {{fontSize: '18px'}}>您的提现申请已提交，等待平台处理</Col>
        <Col span = {24} className = "step">
          <Steps current={1}>
            <Step title="step 1" description="提现申请" />
            <Step title="step 2" description="处理中" />
            <Step title="step 3" description="提现成功(预计72小时内)" />
          </Steps>
        </Col>
        <Col className = "step"> 
          <span>如因支付宝账号填写错误，导致提现失败，平台将不予负责！</span>
        </Col>
      </Row>
      
    );
  }

  /** 显示title */
  showTitle() {
    this.state.title = this.state.step === 1 ? '提现到支付宝': 
                       this.state.step === 2 ? '提现确认': '温馨提示';
    this.setState(this.state);
  }

  /** 提交提现请求 */
  ApplyWithdraw() {
    this.state.loading = true;
    this.setState(this.state);
    $.post('/applywithdraw', {...this.state.withdraw}, (result) => {
      this.state.loading = false;
      this.setState(this.state);
      this.goNext();
      $.get('/getmyaccount', (account) => {
        $('.account_balance').html(Number(account.balance).toFixed(2));
      });
      
    });
  }

  /** 上一步 */
  goPre() {
    this.state.step  = this.state.step - 1;
    this.setState(this.state);
    this.showTitle();
  }

  /** 操作栏 */
  modalOp() {
    return this.state.step === 1 ? (<Button type= 'primary' onClick = {this.saveWithdrawInfo.bind(this)} >下一步</Button>) :
                            this.state.step === 2 ? 
                              [
                                (<Button loading = {this.state.loading} type= 'primary' onClick = {this.ApplyWithdraw.bind(this)} key = {1} >确认提现</Button>),
                                (<Button key = {2} onClick = {this.goPre.bind(this)} >上一步</Button>)
                              ] :
                            (<Button type= 'primary' onClick = {this.handleCancel.bind(this)} >关闭</Button>);
  }

  /** 下一步 */
  goNext() {
    
    this.state.step  = this.state.step + 1;
    this.setState(this.state);

    this.showTitle();
  }

  /** 当前操作 */
  showcurrentOp() {
    this.state['title'] = '提现到支付宝';
    return this.state.step === 1? this.showStepOne(): 
                                  this.state.step === 2 ? this.showStepTwo(): 
                                  this.showStepThree();
  }

  render() {
    return (
      <div>
        <Modal title= {this.state.title}
          visible={this.state.visible}
          onOk={this.handleOk.bind(this)}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel.bind(this)}
          maskClosable = {false}
          footer = {this.modalOp()}
        >
          {this.showcurrentOp()}
        </Modal>
      </div>
    );
  }
}

export default ApplyWithdraw;