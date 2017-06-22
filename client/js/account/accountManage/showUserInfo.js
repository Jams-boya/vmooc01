// import 
import {Modal, Button, Tabs, Tab, Row, Col, Image} from 'react-bootstrap'; 
import RC_MyForm from 'js/common/myform/myform';
import RC_MyStatic from 'js/common/myform/mystatic';
import React, {Component} from 'react';
import common from './common';
import './index.css';
import config from '../../../../server/config';

class componentName extends Component {
  constructor(props) {
    console.log('----', config);
    super(props);
    this.state = {};
    this.state.dialogClassName = this.props.dialogClassName || "custom-modal";
  }

  showModal(row) {
    this.setState(row || {});
    this.setState({show: true});
  }
  hideModal() {
    this.setState({show: false});
  }

  /** 显示基础的用户信息 */
  showBasicInfo() {
    return (
      <dl className="dl-horizontal">
        <dt>头像</dt>
        <dd><Image style = {{height:"100px", width: '100px'}} alt = '' src = {`${config.avatorUrl}/uploadpic/${this.state.Avatar}` || '/img/prot.png'} /></dd>
        <dt></dt>
        <dd>{common.accountType(this.state.isInstructor)}</dd>
        <dt>邮箱</dt>
        <dd>{this.state.email}</dd>
        <dt>昵称</dt>
        <dd>{this.state.nickName}</dd>
        <dt>姓名</dt>
        <dd>{this.state.name}</dd>
        <dt>联系电话</dt>
        <dd>{this.state.phone}</dd>
        <dt>注册时间</dt>
        <dd>{common.simpleDateFormat(this.state.registrationAt)}</dd>
      </dl>
    );
  }

  /** 显示讲师信息 */
  showExpertInfo() {
    let infModal = '';

    $.ajax({
      headers : {
        'Accept'       : 'application/json',
        'Content-Type' : 'application/json'
      },
      url  : '/findExpert',
      type : 'get',
      data : {teacherId: this.state._id},
      async: false,
      success : (data) => {
        if (data)
          infModal = (
            <div>
              <Row>
                <Col sm={6} md={3}>
                  <Image style = {{width: "100px", height: "100px"}} src = {`${config.avatorUrl}/uploadpic/${data.avatar}` || '/img/prot.png'} thumbnail />
                </Col>
                <Col sm={10} md={6}>
                  <label>邮箱：</label><span>{data.email}</span><br /><br />
                  <label>昵称：</label><span>{data.nickName}</span><br /><br />
                  <label>注册时间：</label><span>{common.simpleDateFormat(this.state.registrationAt)}</span>
                </Col>
              </Row>
              <Row className = 'pt30'>
                <Col sm={12} md={6}>
                  <label>姓名：</label><span>{data.name}</span><br />
                  <label>职称：</label><span>{data.professionalTitle}</span><br />
                </Col>
                <Col sm={12} md={6}>
                  <label>联系：</label><span>{data.phone}</span><br />
                  <label>擅长：</label><span>{common.skills(data.skilled)}</span><br />
                </Col>
              </Row>
              <Row className = 'pt30'>
                <Col sm={12} md={12}>
                  <label>自我介绍：</label><span>{data.briefDescription}</span><br />
                </Col>
              </Row>
              <Row className = 'pt30'>
                <Col sm={12} md={12}>
                  <label>生活照： </label>
                  <Image style = {{width: "150px", height: "150px"}} src = {data.lifePhoto || '/img/prot.png'} thumbnail />
                </Col>
              </Row>
              <Row className = 'pt30'>
                <Col sm={12} md={12}>
                  <label>认证时间：</label><span>{common.simpleDateFormat(data.updateAt)}</span><br />
                </Col>
              </Row>
            </div>
          );
      },
      error : function(err) {
      
      }
    }); 
    return infModal;
  }

  /** 显示详细信息 */
  showDetailInfo() {
    return this.state.isInstructor ? this.showExpertInfo() : this.showBasicInfo();
  }

  render() {
    return (
      <div>
        <Modal
          {...this.props}
          show = {this.state.show}
          onHide = {this.hideModal.bind(this)}
          dialogClassName = {this.state.dialogClassName}
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-lg">会员详情</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className = 'row'>
              <div className = 'col-md-12'>
                {this.showDetailInfo()}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.hideModal.bind(this)}>关闭</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default componentName;