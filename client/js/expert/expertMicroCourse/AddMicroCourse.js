import _ from 'lodash';
import {Popover, message, Button } from 'antd';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';

class AddMicroCourse extends Component {
  constructor(props) {
    super(props);
    const {uploadCourse} = this.props;
    this.state = {
      microCourse: {},
      limit: '0',
      descriptionLimit:'0',
      priceLimit: '',
      toc: [],
      imgsrc: {
        default1:"img/courseManage/default1.png",
        default2:"img/courseManage/default2.png",
        default3:"img/courseManage/default3.png",
        default4:"img/courseManage/default4.png",
        default5:"img/courseManage/default5.png",
        default6:"img/courseManage/default6.png",
      },
      uploadFiles: [],
      data: {}
    }
  };

 componentDidMount() {
  $.ajax({
    url: '/courseMenuList',
    type: 'get',
    async: false,
    success: (selects) => {
      selects[0].values.map((val, index) => {
        $('.classify').append('<option value="' + val.name + '">' + val.name + '</option>');
      });
      selects[1].values.map((val, index) => {
        $('.direction').append('<option value="' + val.name + '">' + val.name + '</option>');
      });
      selects[2].values.map((val, index) => {
        $('.usePeriod').append('<option value="' + val.name.substring(0, 1) + '">' + val.name + '</option>');
      });
    },
    error: (err) => {
      console.log(err);
    }
  });
 }
  // 获取课程名
  handleName() {
    let name = ReactDOM.findDOMNode(this.refs.name).value;
    let nameLength = name.length;
    this.setState({"limit":name.substring(0,16)});
    nameLength < 17?this.setState({limit:(nameLength)}):this.setState({limit:"16"});
  }
  // 获取价格
  handlePrice() {
    let price = ReactDOM.findDOMNode(this.refs.price).value;
    let priceLength = price.length;
    this.setState({"price":price});
  }
  // 获取封面
  handleImg(e) {
    let cover = e.currentTarget.childNodes[0].attributes[0].nodeValue;
    let domLen = document.getElementsByClassName('imgbg').length;
    for(let i = 0; i < domLen; i ++) {
      document.getElementsByClassName('imgbg')[i].style.display = 'none';
      document.getElementsByClassName('selectImg')[i].style.display = 'none';
    }
    e.currentTarget.childNodes[1].style.display = 'block';
    e.currentTarget.childNodes[2].style.display = 'block';
    this.state.microCourse.cover = '/' + cover;
  }
  // 上传视频
  uploadVideo() {
    this.props.uploadClick(this.state.toc, this.state.uploadFiles, 0, 0);
  }
  // 下一步
  handleNext() {
    // 标题和费用
    let title = document.getElementById('name').value;
    let pricevalue = document.getElementById('price').value;
    if (isNaN(pricevalue)) {
      message.warn('请填写正确的价格!');
      return false;
    } else if (Number(pricevalue) > 1000) {
      message.warn('价格不能超过1000元!');
      return false;
    } else if (!pricevalue) {
      message.warn('请填写价格!');
      return false;
    } else if (Number(pricevalue) <= 0) { 
      message.warn('请填写大于0元的价格');
      return false;
    } else if (!title) { 
      message.warn('请填写课程名!');
      return false;
    }
    
    document.getElementById('one').style.display = 'none';
    document.getElementById('two').style.display = 'block';
    document.getElementById('disc2').style.background = '#3CCC86';
    document.getElementById('line2').style.background = '#3CCC86';
  }
  // 限制课程简介的字数
  handleDescription(e) {
    let description = e.target.value;
    let descriptionLength = description.length;
    this.setState({"descriptionLimit":description.substring(0,50)});
    descriptionLength < 51?this.setState({descriptionLimit:(descriptionLength)}):this.setState({descriptionLimit:"50"});
  }
  // 保存或者保存为草稿
  submitProv(e) {
    let desvalue = document.getElementById('description').value;
    let suivalue = document.getElementById('suitableCrowd').value;
    let prevalue = document.getElementById('preliminary').value;
    let tarvalue = document.getElementById('target').value;
    if (!desvalue || !suivalue || !prevalue || !tarvalue) {
      message.warn('请完整填写信息!');
      return false;
    }
    document.getElementById('disc3').style.background = '#3CCC86';
    if (window.location.search == "") {
      let microCourse = {
        name: ReactDOM.findDOMNode(this.refs.name).value,
        classify: ReactDOM.findDOMNode(this.refs.classify).value,
        direction: ReactDOM.findDOMNode(this.refs.direction).value,
        price: ReactDOM.findDOMNode(this.refs.price).value,
        usePeriod: ReactDOM.findDOMNode(this.refs.usePeriod).value,
        description: ReactDOM.findDOMNode(this.refs.description).value,
        suitableCrowd: ReactDOM.findDOMNode(this.refs.suitableCrowd).value,
        preliminary: ReactDOM.findDOMNode(this.refs.preliminary).value,
        target: ReactDOM.findDOMNode(this.refs.target).value,
        teacherId: guser._id,
        toc: this.state.toc,
        // teacherId: this.props.teacherId,
        // teacherName: this.props.teacherName,
      }
      Object.assign(this.state.microCourse, microCourse);
    } else {
      let IdPathname = window.location.search;
      let course_id = IdPathname.substring(10, IdPathname.length);
      let microCourse = {
        name: ReactDOM.findDOMNode(this.refs.name).value,
        classify: ReactDOM.findDOMNode(this.refs.classify).value,
        direction: ReactDOM.findDOMNode(this.refs.direction).value,
        price: ReactDOM.findDOMNode(this.refs.price).value,
        usePeriod: ReactDOM.findDOMNode(this.refs.usePeriod).value,
        description: ReactDOM.findDOMNode(this.refs.description).value,
        suitableCrowd: ReactDOM.findDOMNode(this.refs.suitableCrowd).value,
        preliminary: ReactDOM.findDOMNode(this.refs.preliminary).value,
        target: ReactDOM.findDOMNode(this.refs.target).value,
        teacherId: guser._id,
        toc: this.state.toc,
        _id: course_id,
        // teacherId: this.props.teacherId,
        teacherName: this.props.teacherName,
      }
      Object.assign(this.state.microCourse, microCourse);
    }
    const uploadType = e.target.innerHTML;
    let isDraft = uploadType === "提交" ? false : true;//是否是草稿
    if (this.state.microCourse.state >= 2) {
      this.state.microCourse.state = 3;
    }else if (this.state.uploadFiles.length > 0) {
      this.state.microCourse.state = -1;
    }
    let isMicroCourse = true;
    if (this.state.microCourse) {
      if (isDraft) {
        this.state.microCourse.state = 0;
      } else { 
        this.state.microCourse.state = 1;
      }
      if(this.state.microCourse.toc.length == 0 && !isDraft){ 
        message.warn('请上传视频');
        return false;
      }
      let createAt = new Date();
      this.props.uploadCourse(this.state.microCourse, this.state.uploadFiles, createAt, isDraft, isMicroCourse);
    }
  }

  render() {
    let microCourse = this.state.microCourse;
    let introplaceholder = `填写本课程的简单描述，方便学员快速了解学习本课程的意义`;
    let crowdplaceholder = `填写课程的使用人群是哪些
例如：有一定设备检验工作经验，想通过提升实践能力，进入外资企业就职的检验员`;
    let abilityplaceholder = `填写学习该课程需要的能力基础
例如：
了解设备的原理
有检验员实践工作经验`;
    let targetplaceholder = `填写学员通过学习该课程，可以掌握什么知识/技能
例如：通过本课程的学习，可以掌握监理基础知识`;
    let uploadInfo = '上传视频';
    let uploadStyle = {}
    let tooltip;
    if (this.state.toc[0] && this.state.toc[0].clazz[0].rawPath) {
      uploadInfo = "已上传";
      uploadStyle = {
        color: '#00AA00',
        fontWeight: 'bold',
      }
      tooltip = this.state.toc[0].clazz[0].name;
    }

  return (
    <div>
      <div id="one" style={{display:'block'}} className="microCourse">
        <table className="microCoursetab">
          <tbody>
          <tr>
            <td>
              <span className="star">* </span>课程名称
            </td>
            <td>
              <input id="name" ref="name" className="name" type="text" placeholder="填写课程名称" maxLength="50" defaultValue={microCourse.name} onChange={this.handleName.bind(this)}/>
              <span className="suffix"><span className="nameLength">{this.state.limit}</span>/50</span>
            </td>
          </tr>
          <tr>
            <td>
              <span className="star">* </span>课程分类
            </td>
            <td>
              <select id="classify" className="classify" defaultValue={microCourse.classify} ref="classify"></select>
            </td>
          </tr>
          <tr>
            <td>
              <span className="star">* </span>课程方向
            </td>
            <td>
              <select id="direction" className="direction" defaultValue={microCourse.direction} ref="direction"></select>
            </td>
          </tr>
          <tr>
            <td>
              <span className="star">* </span>费&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;用
            </td>
            <td>
                <Popover placement="right" content={<div>不要超过1千元</div>} trigger="click">
                 <input id="price" ref="price" className="price" type="text" placeholder="填写课程费用" maxLength="6" defaultValue={microCourse.price} onChange={this.handlePrice.bind(this)} />
                </Popover>
              <span className="suffix">元 / 人</span>
              <span className="suffixbr">课程建议价格：9.9 - 99元,平台会扣除一定费用作为平台建设费</span>
            </td>
          </tr>
          <tr>
            <td>
              <span className="star">* </span>使用期限
            </td>
            <td>
              <select id="usePeriod" className="usePeriod" defaultValue={microCourse.usePeriod} ref="usePeriod"></select>
            </td>
          </tr>
          <tr>
            <td>
              <span className="star">* </span>上传视频
            </td>
            <td>
              <div style={{height:100}}>
                <div id="uploaddiv" data-toggle="tooltip" data-placement="bottom" title={tooltip}>
                  <button id="upfile" onClick={this.uploadVideo.bind(this)}>
                    <div id="circle"><div id="triangle-left"></div></div>
                  </button>
                  <span id="uptext" style={uploadStyle}>{uploadInfo}</span>
                  </div>
                <div style={{ display: "none",width: 100, height: 100 }} id="previewpic"></div>
                <div style={{clear:"both"}}></div>
                </div>
              <div style={{clear:"both"}}></div>
              <span className="suffixbr">允许上传的视频格式为mp4,3gp,flv,avi，单个文件最大为1G</span>
            </td>
          </tr>
          <tr>
            <td>
              <span className="star">* </span>课程封面
            </td>
            <td>
              <div className="courseImg">
                <div className="imgDiv" onClick={this.handleImg.bind(this)}>
                    <img src={this.state.imgsrc.default1} className="imgcover"/>
                  <div className="imgbg"></div>
                  <div className="selectImg">
                    <img src="img/courseManage/select.png"/>
                  </div>
                </div>
                <div className="imgDiv" onClick={this.handleImg.bind(this)}>
                  <img src={this.state.imgsrc.default2} className="imgcover"/>
                  <div className="imgbg"></div>
                  <div className="selectImg">
                    <img src="img/courseManage/select.png"/>
                  </div>
                </div>
                <div className="imgDiv" onClick={this.handleImg.bind(this)}>
                <img src={this.state.imgsrc.default3} className="imgcover"/>
                  <div className="imgbg"></div>
                  <div className="selectImg">
                    <img src="img/courseManage/select.png"/>
                  </div>
                </div>
                <div className="imgDiv" onClick={this.handleImg.bind(this)}>
                  <img src={this.state.imgsrc.default4} className="imgcover"/>
                  <div className="imgbg"></div>
                  <div className="selectImg">
                    <img src="img/courseManage/select.png"/>
                  </div>
                </div>
                <div className="imgDiv" onClick={this.handleImg.bind(this)}>
                  <img src={this.state.imgsrc.default5} className="imgcover"/>
                  <div className="imgbg"></div>
                  <div className="selectImg">
                    <img src="img/courseManage/select.png"/>
                  </div>
                </div>
                <div className="imgDiv" onClick={this.handleImg.bind(this)}>
                  <img src={this.state.imgsrc.default6} className="imgcover"/>
                  <div className="imgbg"></div>
                  <div className="selectImg">
                    <img src="img/courseManage/select.png"/>
                  </div>
                </div>
                <div className="clear"></div>
              </div>
            </td>
          </tr>
          <tr>
            <td colSpan="2">
              <div className="next1 next" onClick={this.handleNext.bind(this)}>下一步</div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <div id="two" style={{display:'none'}} className="microlecture2">
        <table className="microlecturetab2">
          <tbody>
          <tr>
            <td>
              <span className="star">* </span>课程简介
            </td>
            <td>
              <textarea id="description" maxLength="50" placeholder={introplaceholder} defaultValue={microCourse.description} ref="description" onChange={this.handleDescription.bind(this)}></textarea>
              <span className="suffix"><span className="desLength">{this.state.descriptionLimit}</span>/50</span>
            </td>
          </tr>
          <tr>
            <td>
              <span className="star">* </span>适用人群
            </td>
            <td>
              <textarea id="suitableCrowd" placeholder={crowdplaceholder} defaultValue={microCourse.suitableCrowd} ref="suitableCrowd"></textarea>
            </td>
          </tr>
          <tr>
            <td>
              <span className="star">* </span>基础能力
            </td>
            <td>
              <textarea id="preliminary" placeholder={abilityplaceholder} defaultValue={microCourse.preliminary} ref="preliminary"></textarea>
            </td>
          </tr>
          <tr>
            <td>
              <span className="star">* </span>授课目标
            </td>
            <td>
              <textarea id="target" placeholder={targetplaceholder} defaultValue={microCourse.target} ref="target"></textarea>
            </td>
          </tr>
          <tr>
            <td colSpan="3">
                <div className="btnDiv">
                <button id="back">上一步</button>
                <div id="prov" className="isdraft next" onClick={this.submitProv.bind(this)}>提交</div>
                <div id="next2" className="isdraft next" onClick={this.submitProv.bind(this)}>保存为草稿</div>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
  }
}
export default AddMicroCourse;