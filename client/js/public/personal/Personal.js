import './personal.css';
import _ from 'lodash';
import { Popover, message, Button } from 'antd';
import React, { Component } from 'react';
import ReactDom from 'react-dom';
import FileUpload from 'react-fileupload';
import config from '../../../../server/config.js';

class Personal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {
        email: "",
        nickName: "",
        Avatar: "",
        name: "",
      },
      expertOther: {
        email: "",
        nickName: "",
        avatar: "",
        name: "",
        phone: "",
        lifePhoto: "",
        professionalTitle: "",
        briefDescription: "",
        money: "20",
      },
      initialAvatar: "img/prot.png",
    }
  };

  componentWillMount() {
    this.state.info.email = guser.email;
    this.state.info.nickName = guser.nickName,
    this.state.info.Avatar = guser.Avatar;
    this.state.info.name = guser.name;
  }

  componentDidMount() {
    $.ajax({
      url: '/expertOther',
      type: 'get',
      data: {
        userId: guser._id,
      },
      async: false,
      success: (data) => {
        if (data) {
          data.nickName = guser.nickName;
          data.avatar = guser.Avatar;
          return this.setState({ expertOther: data });
        } else {
          return this.setState({ expertOther: {} });
        }
      },
      error: (err) => {
        console.log('err is:', err);
      }
    });
  }

  // 用户板块
  // 获取用户昵称
  handleNickName(e) {
    let nickName = e.target.value;
    this.state.info.nickName = nickName;
    let {info} = this.state;
    this.setState({ info });
  }
  // 获取用户头像
  handleAvatar(res) {
    let picPath = res.path;
    this.state.info.Avatar = picPath;
    this.setState(this.state);
  }
  // 获取用户姓名
  handleName(e) {
    let name = e.target.value;
    this.state.info.name = name;
    let {info} = this.state;
    this.setState({info});
  }

  // 讲师板块
  // 获取讲师昵称
  ehandleNickName(e) {
    let nickName = e.target.value;
    this.state.expertOther.nickName = nickName;
    let {expertOther} = this.state;
    this.setState({expertOther});
  }
  // 获取讲师头像
  ehandleAvatar(res) {
    let picPath = res.path;
    guser.avatar = picPath;
    this.state.expertOther.avatar = picPath;
    this.setState(this.state);
  }
  // 获取讲师姓名
  ehandleName(e) {
    let name = e.target.value;
    this.state.expertOther.name = name;
    let {expertOther} = this.state;
    this.setState({ expertOther });
  }
  // 获取讲师手机号
  ehandlPhone(e) {
    let phone = e.target.value;
    this.state.expertOther.phone = phone;
    let {expertOther} = this.state;
    this.setState({ expertOther });
  }
  // 获取讲师职称
  handleprofessionalTitle(e) {
    let professionalTitle = e.target.value;
    this.state.expertOther.professionalTitle = professionalTitle;
    let {expertOther} = this.state;
    this.setState({ expertOther });
  }
  // 获取讲师简介
  handlebriefDescription(e) {
    let briefDescription = e.target.value;
    this.state.expertOther.briefDescription = briefDescription;
    let {expertOther} = this.state;
    this.setState({ expertOther });
    if (this.state.expertOther.briefDescription.length > 149) {
      message.warn('请不要超过150个字!');
      return false;
    }
  }
  // 获取生活照
  handleLifePhoto(res) {
    let picPath = res.path;
    this.refs.lifePhoto.src = '../' + picPath;
    this.state.expertOther.lifePhoto = picPath;
  }
  // 获取价钱
  handleCost(e) {
    let money = e.target.value;
    this.state.expertOther.money = money;
    let {expertOther} = this.state;
    this.setState({ expertOther });
    if (isNaN(this.state.expertOther.money)) {
      message.warn("请输入数字!");
      return false;
    } else if (Number(this.state.expertOther.money) > 1000) {
      message.warn("费用不能高于1000元!");
      return false;
    } else if (Number(this.state.expertOther.money) <= 0) {
      message.warn("费用不能低于0元!");
      return false;
    }
  }
  // 保存用户信息
  onSubmit() {
    if (!this.state.info.nickName) {
      message.warn('请填写昵称');
      return false;
    }
    if (this.state.info.nickName == guser.nickName &&
      this.state.info.Avatar == guser.Avatar &&
      this.state.info.name == guser.name) {
      message.warn('您未做任何修改！');
      return false;
    }
    let userId = this.state.info._id;
    let id = guser._id;
    let perInfo = this.state.info;
    let email = guser.email;
    let path = this.state.info.Avatar;
    $.post("/submit/perInfo", { userId, ...perInfo }, (res1) => {
      $.post(`${config.avatorUrl}/vmooc/updatePic`, { email, path }, (res2) => {
        if (res1.nModified == 1 || res2.nModified == 1) {
          message.success('修改成功！');
          window.setTimeout("window.location='/personal?url=/personal'", 1000);
        }
      })
    });
  }

  // 保存讲师信息
  onSubmitExpert() {
    if (isNaN(this.state.expertOther.phone)) {
      message.warn('手机号请输入数字');
      return false;
    }
    if (!this.state.expertOther.nickName) {
      message.warn('请填写昵称');
      return false;
    } else if (!this.state.expertOther.name) {
      message.warn('请填写姓名');
      return false;
    } else if (!this.state.expertOther.briefDescription) {
      message.warn('请填写讲师介绍');
      return false;
    }
    if (!this.state.expertOther.lifePhoto) {
      this.state.expertOther.lifePhoto = "img/prot.png";
      let {expertOther} = this.state;
      this.setState({ expertOther });
    }
    if (isNaN(this.state.expertOther.money)) {
      message.warn('提问费用请输入数字');
      return false;
    } else if (this.state.expertOther.money == "") {
      message.warn('提问费用不能为空');
      return false;
    } else if (Number(this.state.expertOther.money) > 1000) {
      message.warn("费用不能高于1000元");
      return false;
    } else if (Number(this.state.expertOther.money) <= 0) {
      message.warn("费用不能低于0元!");
      return false;
    }

    let perInfo = {};
    perInfo.nickName = this.state.expertOther.nickName;
    perInfo.Avatar = this.state.expertOther.avatar;
    perInfo.name = this.state.expertOther.name;
    perInfo.phone = this.state.expertOther.phone;

    let userId = this.state.expertOther._id;
    if (this.state.expertOther) {
      this.state.expertOther.email = guser.email;
      this.state.expertOther.nickName = guser.nickName;
      let expertPerInfo = this.state.expertOther;
      let email = guser.email;
      let path = this.state.expertOther.avatar;
      $.post("/submitExpert/perInfo", { userId, ...expertPerInfo }, (result) => {
        $.post("/submit/perInfo", { userId, ...perInfo }, (userResult) => {
          $.post(`${config.avatorUrl}/vmooc/updatePic`, { email, path }, (res2) => {
            if (result.nModified == 1 || userResult.nModified == 1 || res2.nModified == 1) {
              message.success('修改成功!');
              window.setTimeout("window.location='/personal?url=/personal'", 1000);
            } else {
              message.warn('您未做任何修改!');
              return false;
            }
          });
        });
      });
    }
  }

  // 保存按钮选择
  saveBtn() {
    if (guser.isInstructor == true) {
      return (
        <button type="button" className="submitbtn" onClick={this.onSubmitExpert.bind(this)}>保存</button>
      )
    } else {
      return (
        <button type="button" className="submitbtn" onClick={this.onSubmit.bind(this)} style={{ disabled: true }}>保存</button>
      )
    }
  }

  // 用户信息
  userInfo() {
    if (!guser.isInstructor) {
      let options = {
        baseUrl: `${config.avatorUrl}/vmooc/uploadAvatarOther`,
        chooseAndUpload: true,
        timeout: 0,
        multiple: false,
        uploadSuccess: this.handleAvatar.bind(this),
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
        doUpload: function (files, mill) {
          console.log('you just uploaded', typeof files == 'string' ? files : files[0].name)
        },
        uploading: function (progress) {
          console.log('loading...', progress.loaded / progress.total + '%')
        },
        uploadError: function (err) {
          alert(err.message)
        },
        uploadFail: function (resp) {
          alert(resp)
        }
      }
      return (
        <table style={{ width: "45%" }}>
          <tbody>
            <tr>
              <td className="firsttd"><span>邮箱:</span></td>
              <td className="firsttd"><span id="email">{this.state.info.email}</span>
                <span id="etip">不可更改</span>
              </td>
            </tr>
            <tr>
              <td>
                <span className="star">* </span>昵称:</td>
              <td>
                <Popover placement="right" content={<div>不要超过10个字</div>} trigger="click">
                  <input type="text"
                    value={this.state.info.nickName}
                    onChange={this.handleNickName.bind(this)} maxLength="10" />
                </Popover>
              </td>
            </tr>
            <tr>
              <td><span>头像:</span></td>
              <td>
                <div id="avatar">
                  <div id="pic">
                    <img ref='picAvatar'
                      src={`${config.avatorUrl}/uploadpic/${this.state.info.Avatar}`}
                      className="imgSize" /></div>
                  <div id="picTip">
                    <div id="tip1">支持jpg、png的图片</div>
                    <FileUpload options={options}>
                      <button ref="chooseAndUpload" id="tip2">修改头像</button>
                    </FileUpload>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td><span>我的姓名:</span></td>
              <td><input type="text"
                value={this.state.info.name}
                onChange={this.handleName.bind(this)} /></td>
            </tr>
          </tbody>
        </table>
      )
    }
  }

  // 专家信息
  expertOther() {
    if (guser.isInstructor == true) {
      let options_avatar = {
        baseUrl: `${config.avatorUrl}/vmooc/uploadAvatarOther`,
        chooseAndUpload: true,
        timeout: 0,
        multiple: false,
        uploadSuccess: this.ehandleAvatar.bind(this),
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
      let options = {
        baseUrl: '/uploadAvatar',
        chooseAndUpload: true,
        timeout: 0,
        multiple: false,
        uploadSuccess: this.handleLifePhoto.bind(this),
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
        <div>
          <div style={{ float: "left", width: '20%', height: '100%' }}>
            <p style={{ paddingTop: '18px', paddingLeft: '66%', paddingBottom: '121%' }}>基本资料:</p>
            <p style={{ paddingTop: '18px', paddingLeft: '66%' }}>讲师资料:</p>
          </div>
          <table>
            <tbody>
              <tr>
                <td className="firsttd"><span>邮箱:</span></td>
                <td className="firsttd"><span id="email">{guser.email}</span>
                  <span id="etip">不可更改</span>
                </td>
              </tr>
              <tr>
                <td><span className="star">* </span>昵称:</td>
                <td>
                  <Popover placement="right" content={<div>不要超过10个字</div>} trigger="click">
                    <input type="text"
                      value={this.state.expertOther.nickName}
                      onChange={this.ehandleNickName.bind(this)} maxLength="10" />
                  </Popover>
                </td>
              </tr>
              <tr>
                <td><span>头像:</span></td>
                <td>
                  <div id="avatar">
                    <div id="pic">
                      <img ref='picAvatar'
                        src={`${config.avatorUrl}/uploadpic/${this.state.expertOther.avatar}`}
                        className="imgSize" /></div>
                    <div id="picTip">
                      <div id="tip1">支持jpg、png的图片</div>
                      <FileUpload options={options_avatar}>
                        <button ref="chooseAndUpload" id="tip2">修改头像</button>
                      </FileUpload>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td><span>我的姓名:</span></td>
                <td>
                  <input type="text"
                    value={this.state.expertOther.name}
                    onChange={this.ehandleName.bind(this)} /></td>
              </tr>
              <tr>
                <td><span>手机号:</span></td>
                <td>
                  <input type="text"
                    value={this.state.expertOther.phone}
                    onChange={this.ehandlPhone.bind(this)} /></td>
              </tr>
              <tr>
                <td><span>生活照:</span></td>
                <td>
                  <div id="avatar">
                    <div id="pic">
                      <img ref='lifePhoto'
                        src={this.state.expertOther.lifePhoto ? this.state.expertOther.lifePhoto : this.state.initialAvatar}
                        className="imgSize" /></div>
                    <div id="picTip">
                      <div id="tip1">支持jpg、png的图片</div>
                      <FileUpload options={options}>
                        <button ref="chooseAndUpload" id="tip3">修改生活照</button>
                      </FileUpload>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>职称:</td>
                <td><input type="text" id="pTitle"
                  value={this.state.expertOther.professionalTitle}
                  onChange={this.handleprofessionalTitle.bind(this)} /></td>
              </tr>
              <tr>
                <td>讲师介绍:</td>
                <td>
                  <textarea id="bDescription" value={this.state.expertOther.briefDescription}
                    onChange={this.handlebriefDescription.bind(this)} maxLength="150"></textarea>
                </td>
              </tr>
              <tr>
                <td>提问费用:</td>
                <td>向我提问需要花费&nbsp;<input type="text" id="cost" style={{ width: 40 }} value={this.state.expertOther.money} onChange={this.handleCost.bind(this)} maxLength="6" />&nbsp;元
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    }
  }

  render() {
    let {lifePhoto} = this.state.expertOther;
    let userInfo;
    let expertOther;
    let saveBtn;
    return (
      <div>
        {this.userInfo()}
        {this.expertOther()}
        <div id="footer">
          {this.saveBtn()}
        </div>
      </div>
    )
  }
}

export default Personal;

