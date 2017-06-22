import React, {Component} from 'react';
import UploadPic from './focuspic';
import MyNotify from 'js/common/MyNotify.js';
import _ from "lodash";
class My_FocusPic extends Component {
  constructor(props) {
    super(props);
    this.state = {value: this.props.value};
  }
  
  appendPic() {
    let pics = this.state.value.map((v, idx) => {
      return (
        <UploadPic idx = {idx} key = {idx} value = {v} onStateRemove = {this.onRemove.bind(this)} onOrderChnage = {this.onOrderChnage.bind(this)} onStateChnage = {this.onChange.bind(this)}>
        </UploadPic>
      );
    }); 
    this.pics = pics;
    return pics;
  }

  //state改变
  onChange(idx, value) {
    this.state.value[idx] = value;
    this.setState(this.state);
  }

  //顺序改变
  onOrderChnage(changeIdx, currIdx, value) {
    if (changeIdx < 0 )
      return MyNotify.warn('已经是第一个了！');
    
    if (changeIdx > this.state.value.length - 1)
      return MyNotify.warn('已经是最后一个了！');
      
    const temp  = this.state.value[changeIdx];
    const temp2 = this.state.value[currIdx];

    this.state.value[changeIdx] = temp2;
    this.state.value[currIdx]   = temp;

    this.setState(this.state);
  }

  //state删除
  onRemove(idx) {
    _.pullAt(this.state.value, [idx]);
    this.setState(this.state);
  }

  /** 上传焦点图 */
  onSave() {
    const pics = this.state.value;
    const platform = "lcpsp";
    console.log('pics', pics);
    if (!pics || pics == [] || pics.length === 0 || _.find(pics, function(o) {if (!o.url) return true;})) {
      return MyNotify.warn("焦点图不能为空，请完善后保存！");
    }
    $.post("/cms/focuspic", {pics, platform}, (result) => {
      MyNotify.info("保存成功");
    });
  }

  /** 添加一张 */
  onAddPic() {
    this.state.value.push({url:"", color: ""});
    this.setState(this.state);
  }

  showAddBtn() {
    if (this.state.value.length < 3) {
      return (<button className = "btn btn-primary margin-r" onClick = {this.onAddPic.bind(this)}>添加轮播</button>);
    } 
    return;
  }

  render() {
    return (
      <div>
        <div className = "row" style = {{marginBottom: "30px"}}>
          {this.appendPic()}
          <div className = "row">
            <div className = "col-sm-10 col-sm-offset-1" style = {{paddingLeft: "0px"}}>
              {this.showAddBtn()}
              <button className = "btn btn-success" onClick = {this.onSave.bind(this)}>保存</button>
            </div>
          </div>
          
        </div>
      </div>
    );
  }
}

export default My_FocusPic;
