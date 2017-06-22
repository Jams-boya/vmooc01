import './index.css';
import _ from 'lodash';
import { Popover, message, Button } from 'antd';
import React, { Component } from 'react';
import ReactDom from 'react-dom';
import FileUpload from 'react-fileupload';
import TopNav from './topNav';
import BottomNav from './bottomNav';
import 'sweetalert/dist/sweetalert.css';
import sweetalert from 'sweetalert/dist/sweetalert.min.js';

class ShowNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topnav: {},
      footnav: [],
    };
  }
  componentWillMount() {
    $.post('/cms/editNav', (header) => {
      if (header == null) {
        this.state.topnav.logo = "/images/2dbarcode.png";
      } else {
        _.remove(header.iterms, { direct: 1 });
        this.setState({ topnav: header });
      }
    });
    $.post('/cms/bottomNav', (foot) => {
      this.setState({ footnav: foot });
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.topCallValue) {
      this.setState({ topnav: nextProps.topCallValue })
    }
    if (nextProps.bottomCallValue) {
      this.setState({ footnav: nextProps.bottomCallValue })
    }
  }
  /**顶部配置 */
  editHead() {
    this.props.showTopModal(this.state.topnav);
  }
  /**底部配置 */
  editBottom() {
    this.props.showBottomModal(this.state.footnav);
  }
  /**发布信息 */
  publish() {
    if (this.state.topnav.qrcode == "../../images/noQr.jpg") {
      this.state.topnav.qrcode = "";
    }
    let items = [...this.state.footnav, ...this.state.topnav.iterms];
    if (_.unset(this.state.topnav, 'iterms')) {
      this.state.topnav['iterms'] = items;
    }
   
    $.post('/cms/edit', { navigation: this.state.topnav }, (nav, result) => {
      if (result == "success") {
        swal({
          title: "发布成功!",
          text: "恭喜你，发布成功.",
          timer: 1000,
          showConfirmButton: false
        },
          function () {
            location.href = '/cms/frontDeploy';
          });
      } else {
        sweetAlert("警告...", "配置出错,请重新尝试!", "error");
      }
    });
  }

  render() {
    let firstHead;
    let nextHead;
    return (
      <div>
        <div id="topTitle">网站顶部配置</div>
        <div id="topConfig">
          <div className="upper">
            <div className="container-fluid head">
              <div className="container">
                <Button type="primary" id="editHead" onClick={this.editHead.bind(this)}>编辑</Button>
                {this.state.topnav.qrcode ?
                  <span className="erweima">
                    <img src="/images/2dbarcode.png" />
                  </span>
                  :
                  <span className="erweima"></span>}

                <span className="dropdown">
                  <span className="dropdown-toggle" id="dropdownMenu1" data-toggle="dropdown" aria-expanded="false">大王
                    <i className="caret"></i></span>
                </span>
                {!this.state.topnav.iterms ? null :
                  this.state.topnav.iterms.map((headItem, headIndex) => {
                    return (
                      <div key={headIndex}>
                        <span>{headItem.title}</span>
                      </div>
                    )
                  })
                }
              </div>
            </div>

            <div className="container-fluid nav">
              <div className="container">
                <img className="p_index_logo" src={this.state.topnav.logo} />
                <ul className="navul">
                  <li>首页</li>
                  <li>课程中心</li>
                </ul>
                <span className="couslin">我要开课</span>
                <span className="couslin">我的学习</span>
                <div className="sear">
                  <input type="text" placeholder="可搜索课程" />
                </div>
                <div className="clear"></div>
              </div>
            </div>
          </div>
        </div>
        <div id="footTitle">网站底部配置</div>
        <div id="footConfig">
          <div className="upper">
            <div className="container-fluid foot">
              <Button type="primary" id="editFoot" onClick={this.editBottom.bind(this)}>编辑</Button>
              <ul className="footul" >
                {!this.state.footnav ? null :
                  this.state.footnav.map((footItem, footIndex) => {
                    return (
                      <li key={footIndex}>{footItem.title}</li>
                    )
                  })
                }
              </ul>
            </div>
          </div>
        </div>
        <button id="publish" onClick={this.publish.bind(this)}>发  布</button>
      </div>
    )
  }
}
export default ShowNav;