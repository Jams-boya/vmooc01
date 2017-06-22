import '../../../css/selectpay.css';
import _ from 'lodash';
import React, {Component} from 'react';
import ReactDom from 'react-dom';
/**
 * 选择支付react组件
 * @author: gs
 */
class SelectPayWidget extends Component {
  constructor(props) {
    super(props);
    this.state={
      payMethod: 0,
    }
  }
  render() {
    return (
      <div className="modal fade" id="myModal" tabIndex="9" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="mbody modal-content">
          <div className="modal-header">
            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h4 className="modal-title" id="myModalLabel">购买课程</h4>
          </div>
          <div className="modal-body">
            <div className="way">
              <span className="menu">支付方式:</span>
              <div className="payment">
                <button type="button" className="zfspan btn btn-default btn-sm" id="zfye" onClick={() => this.setState({payMethod: 0})}>账户余额账户</button>
              </div>
              <div className="payment">
                <button type="button" className="zfspan btn btn-default btn-sm" id="zfb" onClick={() => this.setState({payMethod: 1})}>支付宝支付</button>
              </div>
              <div style={{'clear':'both'}}></div>
            </div>
            <div className="pays">
              {this.state.payMethod === 0 ?
              <div>
                <div className="balance">
                  <span className="alipay">支付金额:</span>
                  <span className="money">￥88.00</span>
                </div>
                
                <div className="footer">
                  <div id="line"></div>
                  <button type="button" className="topay btn btn-success" onClick={this.props.waitPay}>去付款</button>
                  <button type="button" className="back btn btn-default" >上一步</button>
                </div>
              </div>
              :
              <div className="pay">
                <span className="scan">扫一扫支付:</span>
                <img src="./alipay.jpg" />
                <div style={{'clear':'both'}}></div>
              </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  }
}

export default SelectPayWidget;

