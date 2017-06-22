/** 推荐位 - 焦点图 */

import React, {Component} from 'react';
import Colr from 'colr';
import ColorPicker from 'react-input-color';
import 'react-input-color/dist/input-color.css';
import FileUpload from 'react-fileupload';
import './focuspic.css';

class UploadPic extends Component {
  constructor(props) {
    super(props);
    this.state = this.props.value;
    this.state.url = this.props.value.url || "";
    this.state.clickUrl = this.props.value.clickUrl || '';
    this.state.color = this.props.value.color || "#FFFFFF";
    this.state.url ? this.state.buttonTitle = '修改图片': this.state.buttonTitle = '上传图片';
    this.uploadOptions = {
      "baseUrl": '/cms/upload',
      "chooseAndUpload": true,
      "fileFieldName": "file",
      "uploadSuccess": this.uploadSuccess.bind(this)
    };
  }
  
  /** 上传文件后 */
  uploadSuccess(res) {
    const url = res.path;
    this.state.url = url;
    this.state.buttonTitle = '修改图片';
    this.setState(this.state);
    this.props.onStateChnage(this.props.idx, this.state);
  }

  /** 点击颜色 */
  onClickColor(color) {
    this.state.color = color;
    this.setState(this.state);
    this.props.onStateChnage(this.props.idx, this.state);
  }

  /** 显示上传按钮 */
  showUploadBtn() {
    $(this.refs.UpImgBtn).toggle();
  }

  /** 删除当前轮播图片 */
  removePic() {
    this.props.onStateRemove(this.props.idx);
  }


  /** 生命周期 更改props */
  componentWillReceiveProps(newprops) {
    this.props = newprops;
    this.state = newprops.value;
    this.setState(this.state);
  }

  handleChnage(e) {
    const clickUrl = e.target.value;
    this.state.clickUrl = clickUrl;
    this.setState(this.state);
    this.props.onStateChnage(this.props.idx, this.state);
  }

  /** 上移 */
  moveUp() {
    this.props.onOrderChnage(this.props.idx - 1, this.props.idx, this.state);
  }

  /** 下移 */
  moveDown() {
   this.props.onOrderChnage(this.props.idx + 1, this.props.idx, this.state);
  }

  // componentWillUpdate() {
  //   console.log("aaa", this.props.value);
  //   this.state = this.props.value;
  //   console.log("wwww",this.state);
  // }
  
  render() {
    return (
      <div>
        <div className="row" style = {{"marginBottom": "20px"}}>
          <div className = "col-sm-1 text-right">轮播</div>
          <div className = "col-sm-10 UpImgContent">
            <div className = "Upremove" title = {"删除"} onClick = {this.removePic.bind(this)}><i className = "fa fa-remove fa-lg"></i></div>
            <div className = "col-sm-1 text-right wd-sm">图片</div>
            <div className = "col-sm-11" style = {{minWidth: "95%"}} onMouseEnter = {this.showUploadBtn.bind(this)} onMouseLeave = {this.showUploadBtn.bind(this)}>
              <img className = "uploadimg" src = {this.state.url} style = {{"backgroundColor": this.state.color}} />
              <div className = "UpImgBtn" ref = "UpImgBtn">
                <FileUpload options={this.uploadOptions}>
                    <button className = "btn btn-primary" ref="chooseAndUpload">{this.state.buttonTitle}</button>
                </FileUpload>
              </div>
              <span className = "UpImgInfo">图片尺寸为1920 * 400 最佳，大小不超过2M, 支持jpg、bmp、png</span>
            </div>
            <div className = "col-sm-12 bgColor">
              <div className = "col-sm-1 UpImgTitle">背景色</div>
              <div className = "col-sm-2">
                <ColorPicker
                  value={this.state.color}
                  defaultValue="#FFFFFF"
                  onChange={this.onClickColor.bind(this)}
                />
              </div>
              <div className = "col-sm-1 UpImgTitle">点击链接</div>
              <div className = "col-sm-3">
                <input value = {this.state.clickUrl} onChange = {this.handleChnage.bind(this)} className = 'form-control' style = {{height: '25px'}} />
                <span>(需在链接上加上https://或http://)</span>
              </div>
              <div className = "col-sm-3" style = {{paddingTop: '8px'}}>
                <i onClick = {this.moveUp.bind(this)} className = "fa fa-arrow-up fa-lg" style = {{marginRight: '8px', cursor: "pointer"}}> </i>
                <i onClick = {this.moveDown.bind(this)} className = "fa fa-arrow-down fa-lg" style = {{cursor: "pointer"}}> </i>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UploadPic;