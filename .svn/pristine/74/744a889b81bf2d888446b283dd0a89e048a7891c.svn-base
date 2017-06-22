import 'antd/dist/antd.min.css';
import { Cascader } from 'antd';
import React, {Component} from 'react';
import { Button, Modal, Form, Input, Radio } from 'antd';
import MyCardForm from './MyCardForm';

class BindMyCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.visible = false;
    this.state.confirmLoading = false;
  }

  /** 显示绑定界面 */
  showModal() {
    this.setState({ visible: true });
  }

  /** 退出 */
  handleCancel() {
    this.setState({ visible: false });
  }

  /** 点击添加 */
  handleAdd() {
    
    const form = this.refs.mycardform;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      let bank = '';
      values.area.map(v => {
        bank += v;
      });
      values['bank'] = bank;

      $.post('/bindmycard', {cardInfo: values}, (result) => {
        this.state['cardinfo'] = values;
        form.resetFields();
        this.setState({ visible: false , confirmLoading: false});
      });
      
    });
  }

  render() {
    return (
      <div>
        <Button type="primary" onClick={this.showModal.bind(this)}>添加银行卡</Button>
        <Modal
          visible={this.state.visible}
          title="添加银行卡"
          okText="添加"
          onCancel={this.handleCancel.bind(this)}
          confirmLoading={this.state.confirmLoading}
          onOk={this.handleAdd.bind(this)}
        >
          <MyCardForm ref = 'mycardform' realName = {this.props.realName}></MyCardForm>
        </Modal>
      </div>
    );
  }
}

export default BindMyCard;