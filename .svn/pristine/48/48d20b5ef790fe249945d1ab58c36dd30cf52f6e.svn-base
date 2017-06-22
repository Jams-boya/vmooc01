/** 支付凭证 */

import React, {Component} from 'react';
import _ from 'lodash';
import { Button, Modal, Form, Input, Radio, Cascader, Col, InputNumber} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
/** createform */
class Certificate extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

 

  /** 检查金额 */
  checkPrime(rule, value, callback) {
    if (value > this.state.balance) {
      callback(new Error('提现金额不能大于账户余额'));
    } else {
      callback();
    }
  }


  render() {
    /** 单行排布layout */
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };

    /** 单选框样式 */
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };

    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Form horizontal >
          <FormItem label="打款凭证号" {...formItemLayout} hasFeedback>
           {getFieldDecorator('voucher', {
              rules: [{ required: true, message: '请输入打款凭证号' }],
            })(
              <Input />
            )}
          </FormItem>
        </Form>
      </div>
    );
  }
}
Certificate = Form.create()(Certificate);
export default Certificate;