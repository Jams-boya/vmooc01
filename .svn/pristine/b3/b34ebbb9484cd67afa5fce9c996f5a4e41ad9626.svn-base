import '../../../css/purchase.css';
import _ from 'lodash';
import React, {Component} from 'react';
import ReactDom from 'react-dom';
/**
 * 支付课程的模态框的react组件
 * @author: gs
 */
class PurchaseCourseWidget extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="modal fade" id="myModal" tabIndex="9" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style={{color:"black"}}>
        <div className="modal-dialog">
          <div className="mbody modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
              <h4 className="modal-title" id="myModalLabel">购买课程</h4>
            </div>
            <div className="modal-body">
              <div className="rows">
                <span className="condition">使用人数：</span>
                <span className="result"><input type="text" defaultValue="3" className="count" />&nbsp;人</span>
              </div>
              <div className="rows">
                <span className="condition">课程期限：</span>
                <span className="result">12月</span>
              </div>  
              <div className="rows">
                <span className="condition">金&nbsp;额：</span>
                <span className="result">￥88.00</span>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="submitbtn btn btn-success" onClick={this.props.buyButtonSuccess}>提交</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PurchaseCourseWidget;

