import './index.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/css/bootstrap.min.css'
import { Modal } from 'react-bootstrap';
import { Form, Input, Upload, Icon, Button, Tooltip, message } from 'antd';
import ReactDom from 'react-dom';
import React, { Component } from 'react';
import FileUpload from 'react-fileupload';

class BottomNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bottomNav: {},
      show: false,
      addmsg: "",
      delmsg: "",
      qrimg: "../../images/noQr.jpg",
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.showBottomModal) {
      this.setState({
        show: true,
        bottomNav: nextProps.showBottomModal,
      });
    }
  }
  /**添加底部链接 */
  addFootLink() {
    let {bottomNav} = this.state;
    if (bottomNav.length < 4) {
      bottomNav.push({
        title: '',
        link: '',
        direct: 1
      });
      this.setState({ bottomNav });
    } else {
      let addmsg = "至多添加4条文字链";
      this.setState({ addmsg });
      return false;
    }
  }
  /**获取底部标题 */
  getFootTitle(index, e) {
    let footTitle = e.target.value;
    this.state.bottomNav[index].title = footTitle;
    let {bottomNav} = this.state;
    this.setState({ bottomNav });
  }
  /**获取底部链接 */
  getFootLink(index, e) {
    let footLink = e.target.value;
    this.state.bottomNav[index].link = footLink;
    let {bottomNav} = this.state;
    this.setState({ bottomNav });
  }
  /**删除底部文字链 */
  delFootLink(index) {
    let {bottomNav} = this.state;
    if (bottomNav.length < 2) {
      let delmsg = "至少留一条文字链";
      this.setState({ delmsg });
      return false;
    }
    _.pullAt(bottomNav, index);
    this.setState({ bottomNav });
  }
  /**关闭Modal */
  cancelModal() {
    this.state.bottomNav.map((bitem, bindex) => {
      if (bitem.title == "") {
        _.pullAt(this.state.bottomNav, bindex);
      }
    });
    this.setState({ show: false });
  };
  /**点击确定 */
  confirmModal() {
    this.state.bottomNav.map((bitem, bindex) => {
      if (bitem.title == "") {
        _.pullAt(this.state.bottomNav, bindex);
      }
    });
    this.setState({ show: false });
    this.props.bottomCallBack(this.state.bottomNav);
  }
  /** 显示文字链信息 */
  showBottomInfo() {
    if (this.state.bottomNav && this.state.bottomNav.length > 0) {
      let result = this.state.bottomNav.map((item, index) => {
        let tLength = this.state.bottomNav[index].title.length;
        return (
          <div key={index} style={{ marginLeft: "16%" }}>
            文字链：<Input placeholder="请输入文字链名称" style={{ width: "60%" }} value={item.title} onChange={this.getFootTitle.bind(this, index)} maxLength="12" /><span className="astrict"> {tLength < 12 ? tLength : 12}/12</span>
            <div className="clear"></div>
            <Input placeholder="请输入网址链接" className="footlink" value={item.link} onChange={this.getFootLink.bind(this, index)} />
            <Tooltip placement="topLeft" title={this.state.delmsg} arrowPointAtCenter>
              <Icon type="minus-circle-o" className="delbLink" onClick={this.delFootLink.bind(this, index)} />
            </Tooltip>
            <div className="clear" style={{ marginTop: "4%" }}></div>
          </div>
        );
      })
      return result;
    } else {
      return '';
    }
  }
  render() {
    return (
      <div>
        <Modal
          show={this.state.show}
          onHide={this.cancelModal.bind(this)}
          >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-lg">网站底部配置</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='row'>
              <div className='col-md-12'>
                {this.showBottomInfo()}
                <Tooltip placement="topLeft" title={this.state.addmsg} arrowPointAtCenter>
                  <Button type="dashed" id="addLink" onClick={this.addFootLink.bind(this)}>新增一条文字链</Button>
                </Tooltip>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.cancelModal.bind(this)}>取消</Button>
            <Button onClick={this.confirmModal.bind(this)} style={{ marginLeft: 40, marginRight: 20 }}>确定</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default BottomNav;