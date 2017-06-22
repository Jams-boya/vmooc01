import React, {Component} from 'react';
import _ from 'lodash';
import { Button, Modal, Form, Input, Radio, Cascader, Col, InputNumber} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
/** createform */
class SelectMyCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state['realName'] = this.props.realName;
    this.state.cards = [];
  }

  /** 显示个人账户 */
  componentWillMount() {
    $.get('/getmyaccount', (account) => {
      if (account) {
        this.state.cards = account.card;
        this.state.balance = account.balance;

        this.setState(this.state);
      }
      
    });
  }

  /** 检查金额 */
  checkPrime(rule, value, callback) {
    if (value > this.state.balance) {
      callback(new Error('提现金额不能大于账户余额'));
    } else {
      callback();
    }
  }

  onRadioChange(e) {
    const card = _.find(this.state.cards, {cardCode: e.target.value});
    this.props.form.setFieldsValue({card: {card: e.target.value, bank: card.bank}});
    this.setState({
      radio: e.target.value,
    });
  }
  render() {
    /** 单行排布layout */
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 12 },
    };

    /** 单选框样式 */
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };

    /**
     * 
     * <FormItem label="银行卡" {...formItemLayout} hasFeedback>
           {getFieldDecorator('card', {
              rules: [{ required: true, message: '请选择银行卡' }],
            })(
              <RadioGroup onChange={this.onRadioChange.bind(this)}>
                {this.state.cards.map((c, idx) => {
                  return (<Radio style={radioStyle} key= {`radio${idx}`} value={c.cardCode}>{c.cardCode}</Radio>);
                })}
              </RadioGroup>
            )}
          </FormItem>
    */

    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Form horizontal >
          <FormItem label="支付宝账号" {...formItemLayout} hasFeedback>
           {getFieldDecorator('alipay', {
              rules: [{ required: true, message: '请填写支付宝账号' }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="提现金额" labelCol = {{span: 4}} wrapperCol = {{span: 12}} hasFeedback help = {'注：提现金额不能大于账户余额'}>
            {getFieldDecorator('amt', {
              rules: [{required: true},{validator: this.checkPrime.bind(this)}],
            })(
              <InputNumber min={50} max={this.state.balance} />
            )}
            <span>元 </span>
            <span> 账户余额： {Number(this.state.balance).toFixed(2)}元</span>
          </FormItem>
        </Form>
      </div>
    );
  }
}
SelectMyCard = Form.create()(SelectMyCard);
export default SelectMyCard;