/*** 支付凭证模态框 */

import React, {Component} from 'react';
import Certificate from './certificate';
import 'antd/dist/antd.min.css';
import { Button, Modal, Form, Input, Radio, Cascader, Col, InputNumber, message} from 'antd';
const FormItem = Form.Item;

class CertificateModal extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.state.step = 1;
    this.state.title = '提现处理';
    this.state.visible = false;
    this.state.loading = false;
  }

  showModal(withdrawId, step, voucher, successOp) {
    this.state.step          = step;
    this.state.visible       = true;
    this.state['voucher']    = voucher;
    this.state['withdrawId'] = withdrawId;

    this.successOp = successOp;

    if (step === 2)
      this.state.title = '打款凭证';
    this.setState(this.state);
  }
 
  handleCancel() {
    this.setState({
      visible: false,
    });
  }

  /** 确认 */
  handleSure() {
    this.state.loading = true;
    this.setState(this.state);
    const withdrawId = this.state.withdrawId;
    const form = this.refs.certificate;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const voucher = values.voucher;
      $.post('/cms/surewithdraw', {withdrawId, voucher}, (result) => {
        this.state.loading = false;
        this.state.visible = false;
        this.setState(this.state);
        if (result && result.error) {
          return message.info(result.error);
        }

        this.successOp(result);
        return message.info('提现已标注完成！');
      });
      
    });
    
  }

  /** 显示底部操作栏 */
  modalOp() {
    let buttons = [];
    buttons.push((<Button key = {1} onClick = {this.handleCancel.bind(this)}>取消</Button>));
    if (this.state.step === 1) {
      buttons.push((<Button key = {2} onClick = {this.handleSure.bind(this)} type = 'primary'>确认</Button>));
    }
    return (
        <Col>
          {buttons}
        </Col>
      );
  }

  /** 显示当前操作 */
  showcurrentOp() {
    if (this.state.step === 1) {
      return (
        <Certificate ref = 'certificate'>
          
        </Certificate>
        );
    }
    /** 单行排布layout */
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };
    
    return (
      <Form horizontal >
        <FormItem label="打款凭证号" {...formItemLayout} hasFeedback>
          <span>{this.state.voucher}</span>
        </FormItem>
      </Form>
    );
  }
  
  render() {
    return (
      <div>
        <Modal title= {this.state.title}
          visible={this.state.visible}
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

export default CertificateModal;