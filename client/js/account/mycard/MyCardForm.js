import React, {Component} from 'react';
import { Button, Modal, Form, Input, Radio, Cascader } from 'antd';
const FormItem = Form.Item;
/** createform */
const options = [{
  value: '上海',
  label: '上海',
  children: [{
    value: '上海',
    label: '上海',
    children: [{
      value: '闸北区',
      label: '闸北区',
      code: 752100,
    },
    {
      value: '静安区',
      label: '静安区',
      code: 752100,
    },
  ],
  }],
}];
class MyCardForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state['realName'] = this.props.realName;
    
  }

  checkAddress(rule, value, callback) {
    callback();
  }
  render() {
    /** 单行排布layout */
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Form horizontal >
          <FormItem label="开户人姓名" {...formItemLayout} hasFeedback>
            {getFieldDecorator('name', {
              initialValue: this.state.realName,
              rules: [{ required: true, message: '请输入真实姓名' }],
            })(
              <Input disabled = {true} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="开户银行" hasFeedback>
            {getFieldDecorator('area', {
              rules: [
                { 
                  required: true, 
                  message: '请输入开户银行所在地',
                  type: 'array'
                }, {
                  validator: this.checkAddress.bind(this)
                }

              ],
            })(<Cascader options={options}  placeholder="选择城市" />)}
          </FormItem>
          <FormItem 
            {...formItemLayout} 
            labelCol =  {{ span: 6 }}
            label="银行卡号"
            hasFeedback
            help = {'请保证银行卡号姓名与开户人姓名一致，以免提现不成功.'}
          >
            {getFieldDecorator('cardCode', {
              rules: [{ required: true, message: '请输入银行卡号' }],
            })(<Input />)}
          </FormItem>
        </Form>
      </div>
    );
  }
}
MyCardForm = Form.create()(MyCardForm);
export default MyCardForm;