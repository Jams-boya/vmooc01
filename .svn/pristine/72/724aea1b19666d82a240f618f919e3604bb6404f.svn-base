import React, {Component} from 'react';
import {Modal, Button, Row, Col} from 'react-bootstrap';
import RC_MyTable, {RC_MyTableHeaderColumn} from 'js/common/mytable/mytable';
import ReactDOM from 'react-dom';
import BindCard from './bindCard.js';
import {Popconfirm} from 'antd';
import './mycard.css';
class MyCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  /** 绑定银行卡 */
  bindCard() {
    return (<BindCard ref = 'addCard' realName = {this.props.realName}></BindCard>);
  }

  componentWillMount() {
    $.get('/getmyaccount', (account) => {
      this.state.account = account;
      this.setState(this.state);
    });
  }

  /** 操作栏 */
  onCustomizeOpr(code, row, idx, target, rcTable) {

    // 修改
    if (code === 'edit') {

    }

    // 删除
    if (code === 'del') {
      console.log('target',target);
      
    }
  }

  modelProvider(account) {
    const card = account.card;
    let model = {
      getTotalCount: function () {
        return card.length;
      },
      getRows: function () {
        return card;
      }
    };
    return model;
  }

  /** 显示银行卡信息 */
  showCard() {

    if (!this.state.account || !this.state.account.card) {
      return '您还未添加银行卡信息';
    } else {

      return (
        <RC_MyTable 
          url='' 
          bodyHeight='auto' 
          keyField='_id' 
          limit={10}
          paging={false}
          hidePagination={true}
          onCustomizeOpr={this.onCustomizeOpr.bind(this)}
          modelProvider = {this.modelProvider(this.state.account)}
        > 
          <RC_MyTableHeaderColumn 
            key={4}
            dataField='name' 
            title={"开户人姓名"}
            width="10%">
          </RC_MyTableHeaderColumn>
          <RC_MyTableHeaderColumn 
            key={4}
            dataField='bank' 
            title={"开户银行"}
            width="10%">
          </RC_MyTableHeaderColumn>
          <RC_MyTableHeaderColumn 
            key={4}
            dataField='cardCode' 
            title={"银行卡号"}
            width="20%">
          </RC_MyTableHeaderColumn>
          <RC_MyTableHeaderColumn 
            key={9}
            isOpr={true} 
            customizeOpr={[
              // {code: 'edit', title: '修改'}, 
              // {code: 'del', title: '删除'},
            ]}
            title={"操作"}
            width="8%">
          </RC_MyTableHeaderColumn>
        </RC_MyTable>
      );
    }
  }
  render() {
    return (
      <div className="static-modal">
        <Modal.Dialog>
          <Modal.Body>
           <Row className = 'mycard_row'>
            <Col md = {12} className = 'nocard'>
              {this.showCard()}
            </Col>
            <Col md = {12} className = 'nocard'>
              {this.bindCard()}
            </Col>
           </Row>
          </Modal.Body>
        </Modal.Dialog>
      </div>
    );
  }
}

export default MyCard;