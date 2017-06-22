import './index.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from 'react-bootstrap';
import { Form, Input, Upload, Icon, Button, Tooltip, message } from 'antd';
import ReactDom from 'react-dom';
import showNav from './showNav';
import React, { Component } from 'react';
import FileUpload from 'react-fileupload';
import sweetAlert from 'sweetalert';

class TopNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nav: {},
      show: false,
      addmsg: "",
      delmsg: "",
      qrimg: "../../images/noQr.jpg",
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.showTopModal) {
      this.setState({
        show: true,
        nav: nextProps.showTopModal,
      });
    }
  }

  /**点击顶部公共区域 */
  handleTop() {
    this.refs.pTop.style.display = "block";
    this.refs.Logo.style.display = "none";
  }
  /**点击Logo */
  handleLogo() {
    this.refs.pTop.style.display = "none";
    this.refs.Logo.style.display = "block";
  }
  /**新增一条文字链 */
  addLink() {
    let {iterms} = this.state.nav;
    _.remove(iterms, { direct: 1 });
    if (iterms.length < 4) {
      iterms.push({
        title: '',
        link: '',
        direct: 0
      });
      this.setState({ iterms });
    } else {
      let addmsg = "至多添加4条文字链";
      this.setState({ addmsg });
      return false;
    }
  }
  /**删除一条文字链 */
  delLink(index) {
    let {iterms} = this.state.nav;
    if (iterms.length < 2) {
      let delmsg = "至少留一条文字链";
      this.setState({ delmsg });
      return false;
    }
    _.pullAt(iterms, index);
    this.setState({ iterms });
  }
  /**获取文字链的名称 */
  getTextTitle(index, e) {
    let title = e.target.value;
    this.state.nav.iterms[index].title = title;
    let {nav} = this.state;
    this.setState({ nav });
  }
  /**获取文字链的链接 */
  getTextLink(index, e) {
    let link = e.target.value;
    this.state.nav.iterms[index].link = link;
    let {nav} = this.state;
    this.setState({ nav });
  }
  /**修改二维码 */
  modifyQrCode(res) {
    let qrPath = res.path;
    this.refs.qrcode.src = '/' + qrPath;
    this.state.nav.qrcode = '/' + qrPath;
    this.setState(this.state);
    this.refs.qrintro.refs.input.disabled = false;
  }
  /**删除二维码 */
  delQrCode() {
    let delQrCode = this.state.qrimg;
    this.state.nav.qrcode = delQrCode;
    this.state.nav.qrintro = "";
    this.setState(this.state.nav);
    this.refs.qrintro.refs.input.disabled = true;
  }
  /**修改二维码介绍 */
  handleQrIntro(e) {
    let qrtitle = e.target.value;
    this.state.nav.qrintro = qrtitle;
    let {nav} = this.state;
    this.setState({ nav });
  }
  /**修改logo */
  logoModify(res) {
    let logoPath = res.path;
    this.refs.logo.src = '/' + logoPath;
    this.state.nav.logo = '/' + logoPath;
    this.state.nav.logolink = window.location.origin;
    this.setState(this.state);
  }
  /**关闭Modal */
  cancelModal() {
    this.state.nav.iterms.map((citem, cindex) => {
      if (citem.title == "") {
        _.pullAt(this.state.nav.iterms, cindex);
      }
    });
    this.setState({ show: false });
  };
  /**点击确定 */
  confirmModal() {
    console.log('sda', this.state.nav);
    this.state.nav.iterms.map((citem, cindex) => {
      if (citem.title == "") {
        _.pullAt(this.state.nav.iterms, cindex);
      }
    });
    this.setState({ show: false });
    this.props.topCallBack(this.state.nav);
  }

  /** 显示文字链信息 */
  showDetailInfo() {
    if (this.state.nav._id) {
      let topIterms = this.state.nav.iterms;
      _.remove(topIterms, { direct: 1 });
      let result = topIterms.map((item, index) => {
        let tLength = topIterms[index].title.length;
        return (
          <div key={index}>
            文字链：<Input placeholder="请输入文字链名称" style={{ width: "60%" }} value={item.title} onChange={this.getTextTitle.bind(this, index)} maxLength="12" /><span className="astrict"> {tLength < 12 ? tLength : 12}/12</span>
            <div className="clear"></div>
            <Input placeholder="请输入网址链接" className="link" value={item.link} onChange={this.getTextLink.bind(this, index)} />
            <Tooltip placement="topLeft" title={this.state.delmsg} arrowPointAtCenter>
              <Icon type="minus-circle-o" className="delLink" onClick={this.delLink.bind(this, index)} />
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
  showQrCode() {
    let options = {
      baseUrl: '/modifyQrCode',
      chooseAndUpload: true,
      timeout: 0,
      multiple: false,
      uploadSuccess: this.modifyQrCode.bind(this),
      beforeUpload: function (files, mill) {
        if (typeof files == "string") {
          return true;
        }
        if (files[0].size < 20 * 1024 * 1024) {
          files[0].mill = mill
          return true;
        } else {
          message.warn('超过20M，请选择小一点的图片！');
          return false;
        }
      },
    }
    return (
      <div id="qrcode">
        <span id="qrText">二维码：</span>
        <div style={{ width: 100, height: 100, float: "left" }}>
          <img ref="qrcode" src={!this.state.nav.qrcode || this.state.nav.qrcode == "../../images/noQr.jpg" ? this.state.qrimg : this.state.nav.qrcode} style={{ width: 100, height: 100 }} />
          <div id="qrhandle">
            <FileUpload options={options}>
              <span ref="chooseAndUpload" id="modify">更改</span>
            </FileUpload>
            <span id="delete" onClick={this.delQrCode.bind(this)}>删除</span>
          </div>
        </div>
        <div className="clear"></div>
        <Input ref="qrintro" placeholder="请输入软件名称" id="qrlink" value={this.state.nav.qrcode == "../../images/noQr.jpg" ? "" : this.state.nav.qrintro} onChange={this.handleQrIntro.bind(this)} maxLength="15" /><span> {this.state.nav.qrintro && this.state.nav.qrintro.length < 15 ? this.state.nav.qrintro.length : 15}/15</span>
      </div>
    )
  }
  showLogo() {
    let Logo_options = {
      baseUrl: '/modifylogo',
      chooseAndUpload: true,
      timeout: 0,
      multiple: false,
      uploadSuccess: this.logoModify.bind(this),
      beforeUpload: function (files, mill) {
        if (typeof files == "string") {
          return true;
        }
        if (files[0].size < 20 * 1024 * 1024) {
          files[0].mill = mill
          return true;
        } else {
          message.warn('超过20M，请选择小一点的图片！');
          return false;
        }
      },
    }
    return (
      <div id="plogo" ref="Logo" style={{ display: "none" }}>
        <img ref="logo" src={this.state.nav.logo == "../../images/noQr.jpg" ? this.state.qrimg : this.state.nav.logo} style={{ width: 190, height: 80, float: "left" }} id="logo" />
        <div>
          <FileUpload options={Logo_options}>
            <span ref="chooseAndUpload" id="logoModify" onClick={this.logoModify.bind(this)}>更换LOGO</span>
          </FileUpload>
        </div>
        <span style={{ marginLeft: 10 }}>建议尺寸: 190*80</span>
      </div>
    )
  }
  render() {
    return (
      <div>
        <Modal
          show={this.state.show}
          onHide={this.cancelModal.bind(this)}
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-lg">网站顶部配置</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='row'>
              <div className='col-md-12'>
                <div id="topDiv"><Button id="publicTop" ref="publicTop" onClick={this.handleTop.bind(this)}>顶部公共区域</Button><Button id="logo" onClick={this.handleLogo.bind(this)}>LOGO</Button></div>
                <div ref="pTop">
                  <div className="textChain">
                    {this.showDetailInfo()}
                  </div>
                  <Tooltip placement="topLeft" title={this.state.addmsg} arrowPointAtCenter>
                    <Button type="dashed" id="addLink" onClick={this.addLink.bind(this)}>新增一条文字链</Button>
                  </Tooltip>
                  {this.showQrCode()}
                </div>
              </div>
              {this.showLogo()}
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

export default TopNav;