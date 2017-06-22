import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/css/bootstrap.min.css'
import { Modal } from 'react-bootstrap';
import { Form, Input, Upload, Icon, Button, Tooltip, message, DatePicker } from 'antd';
import ReactDom from 'react-dom';
import React, { Component } from 'react';
import './index.css';
import moment from 'moment';
import config from '../../../../server/config';
import 'sweetalert/dist/sweetalert.css';
import sweetalert from 'sweetalert/dist/sweetalert.min.js';
import bootbox from 'bootbox/bootbox.min.js';
bootbox.setLocale('zh_CN');

class newJoin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      show: '',
      oldDomain: ""
    };
  }
  // 获取合作方名称
  hanlePartner(e) {
    this.state.data.name = e.target.value;
    let {data} = this.state;
    this.setState({ data });
  }
  // 获取联系人
  hanleName(e) {
    this.state.data.contactName = e.target.value;
    let {data} = this.state;
    this.setState({ data });
  }
  // 获取联系电话
  handlePhone(e) {
    this.state.data.phone = e.target.value;
    let {data} = this.state;
    this.setState({ data });
  }
  // 获取域名
  handleDomain(e) {
    this.state.data.domain = e.target.value;
    let {data} = this.state;
    this.setState({ data });
  }
  // 获取合作期限
  handleDeadline(date, dateString) {
    this.state.data.startAt = dateString[0];
    this.state.data.endAt = dateString[1];
    let {data} = this.state;
    this.setState({ data });
  }
  showNewModal() { 
    this.setState({ show: true });
  }
  showModal(row) {
    this.setState({ data: row || {} });
    this.setState({ oldDomain: row.domain });
    this.setState({ show: true });
  }
  cancelModal() {
    this.setState({ show: false });
  };
  confirmModal() {
    let {data} = this.state;
    let {oldDomain} = this.state;
    if (isNaN(this.state.data.phone)) {
      bootbox.alert({
        message: "手机号请输入数字!",
        size: "small"
      });
    } else if (!this.state.data.startAt) {
      bootbox.alert({
        message: "请重新输入合作期限!",
        size: "small"
      });
    } else {
      this.setState({ show: false });
      $.post('/saveOrEditPartner', { partner: data }, (result) => {
        let {domain} = result;
        if (result.updateAt == result.createAt) {
          $.post('/cms/addNav', { domain }, (data, status) => {
            swal({
              title: "添加成功!",
              text: "恭喜你，添加成功!",
              timer: 1000,
              showConfirmButton: false
            },
              function () {
                location.href = '/cms/joinPartner';
              });
          });
        } else if (result.updateAt !== result.createAt && oldDomain !== domain) {
          $.post('/editNavDomain', { oldDomain, newDomain: domain }, (isOk) => {
            if (isOk.nModified == 1) {
              swal({
                title: "编辑成功!",
                text: "恭喜你，编辑成功!",
                timer: 1000,
                showConfirmButton: false
              },
                function () {
                  location.href = '/cms/joinPartner';
                });
            }
          });
        } else {
          swal({
            title: "添加成功!",
            text: "恭喜你，添加成功!",
            timer: 1000,
            showConfirmButton: false
          },
            function () {
              location.href = '/cms/joinPartner';
            });
        }
      });
    }
  }

  render() {
    const { MonthPicker, RangePicker } = DatePicker;
    return (
      <div>
        <Modal
          show={this.state.show}
          onHide={this.cancelModal.bind(this)}
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-lg">新增合作方</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='row'>
              <div className='col-md-12'>
                <div style={{ marginLeft: "16%", width: "70%" }}>
                  <div className="prow" style={{ marginTop: "5%" }}>合作方名称:<Input placeholder="合作方名称" className="pinput" value={this.state.data.name} onChange={this.hanlePartner.bind(this)} />
                  </div>
                  <div className="clear"></div>
                  <div className="prow">联系人:<Input placeholder="联系人" className="pinput" value={this.state.data.contactName} onChange={this.hanleName.bind(this)} /></div>
                  <div className="clear"></div>
                  <div className="prow">联系电话:<Input placeholder="联系电话" className="pinput" value={this.state.data.phone} onChange={this.handlePhone.bind(this)} /></div>
                  <div className="clear"></div>
                  <div className="prow">域名:<Input placeholder="域名格式:xxx.com/net/cn..." className="pinput" value={this.state.data.domain} onChange={this.handleDomain.bind(this)} /></div>
                  <div className="clear"></div>
                  <div style={{ marginBottom: "6%", lineHeight: "26px" }}>合作期限: <RangePicker value={[moment(this.state.data.startAt), moment(this.state.data.endAt)]} className="pinput" onChange={this.handleDeadline.bind(this)} /></div>
                  <div className="clear"></div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.cancelModal.bind(this)} id="cancel">取消</Button>
            <Button onClick={this.confirmModal.bind(this)} id="confirm">确定</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default newJoin;