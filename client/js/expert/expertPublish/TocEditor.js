import _ from 'lodash';
import 'antd/dist/antd.min.css';
import { Modal, Input, Tooltip, Icon, Form, Upload, Affix, Button, message, Popover, Dropdown, Menu, Checkbox } from 'antd/dist/antd.min.js';
import axios from 'axios';
import React, { Component } from 'react';
import ReactDom from 'react-dom';
import Uploader from 'js/common/webuploader/Uploader.js';
import SHOWUPLOADER from 'js/common/webuploader/uploaderModel.js';
import bootbox from 'bootbox';



class TocEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toc: [],
      disabled: '',
      uploadFiles: [],
      visible: false,
      clazzIdx: '',
      tocIdx: '',
      data: {
        clazzName: '',
        createId: guser._id,
        createName: guser.name,
        questions: [{
          title: '',
          options: [
            { optDetail: '', isTrue: false },
            { optDetail: '', isTrue: false },
            { optDetail: '', isTrue: false },
            { optDetail: '', isTrue: false },
          ],
          result: '',
        }],
      }
    }
    this.reorderChapter = this.reorderChapter.bind(this);
    this.reorderClazz = this.reorderClazz.bind(this);
    this.deleteClazz = this.deleteClazz.bind(this);
    this.handleChapter = this.handleChapter.bind(this);
    this.handleClazz = this.handleClazz.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleExam = this.handleExam.bind(this);
    this.uploadExcel = this.genExam.bind(this);
  };

  componentDidMount() {
    $.ajax({
      url: '/course/toc/tocPublish',
      type: 'get',
      data: { teacherId },
      async: false,
      success: (data) => {
        if (data.length != 0) {
          return this.setState({ toc: data[0].toc });
        }
        return this.setState({ toc: [] });
      },
      error: (err) => {
        if (err) {
          console.log('err is:', err);
        }
      }
    });
  }

  componentDidUpdate() {
    //滚轮事件，定位顶部按钮
    $('.scrollQues').on("mousewheel",(e) => {
      var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) || 
                  (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1));            
      if (delta > 0) {
          // 向上滚
          if($('.scrollQues').parent().scrollTop() < 150){
            $('.fixBar').css({'position':'absolute', 'top':40});
          }
      } else if (delta < 0) {
          // 向下滚
          if($('.scrollQues').parent().scrollTop() > 150){
            $('.fixBar').css({'position':'fixed', 'top':0, 'z-index':999});
          }
      }
    });
  }

  //添加章节
  addChapter() {
    let toc = this.state.toc;
    toc.push({
      chapter: '',
      clazz: []
    });
    this.setState({ toc });
  }
  //添加课程
  addClazz(idx) {
    let toc = this.state.toc;
    toc[idx].clazz.push({
      title: '',
      isFree: ''
    });
    this.setState({ toc });
  }
  // 获取章节名
  handleChapter(tocIdx, e) {
    let chapterTitle = e.target.value;
    this.state.toc[tocIdx].chapter = chapterTitle;
    let toc = this.state.toc;
    this.setState({ toc });
  }
  // 获取课时名
  handleClazz(clazzIdx, tocIdx, e) {
    let clazzTitle = e.target.value;
    this.state.toc[tocIdx].clazz[clazzIdx].title = clazzTitle;
    let toc = this.state.toc;
    this.setState({ toc });
  }
  // 是否试学
  handleCheck(clazzIdx, tocIdx, e) {
    let checkValue = e.target.checked;
    this.state.toc[tocIdx].clazz[clazzIdx].isFree = checkValue;
    let toc = this.state.toc;
    this.setState({ toc });
  }
  onUpload(cIdx, index) {
    this.props.uploadClick(this.state.toc, this.state.uploadFiles, cIdx, index);
  }

  //  切换章节
  reorderChapter(direction, idx) {
    let toc = this.state.toc;
    let tocLength = toc.length - 1;
    let temp = {};
    //第一章且向上切换时跳出
    if (idx == 0 && direction == "up") {
      return;
    }
    //最后一张且向下切换时跳出
    if (idx == tocLength && direction == "down") {
      return;
    }
    //向上切换
    if (direction == "up") {
      temp = toc[idx];
      toc[idx] = toc[idx - 1];
      toc[idx - 1] = temp;
    }
    //向下切换
    if (direction == "down") {
      temp = toc[idx];
      toc[idx] = toc[idx + 1];
      toc[idx + 1] = temp;
    }
    this.setState({ toc });
  }
  //切换课时
  reorderClazz(direction, clazzIdx, tocIdx) {
    let clazz = this.state.toc[tocIdx].clazz;
    let clazzLength = this.state.toc[tocIdx].clazz.length - 1;
    let temp = {};
    //第一课时且向上切换时跳出
    if (clazzIdx == 0 && direction == "up") {
      return;
    }
    //最后一课时且向下切换时跳出
    if (clazzIdx == clazzLength && direction == "down") {
      return;
    }
    //向上切换
    if (direction == "up") {
      temp = clazz[clazzIdx];
      clazz[clazzIdx] = clazz[clazzIdx - 1];
      clazz[clazzIdx - 1] = temp;
    }
    //向下切换
    if (direction == "down") {
      temp = clazz[clazzIdx];
      clazz[clazzIdx] = clazz[clazzIdx + 1];
      clazz[clazzIdx + 1] = temp;
    }
    this.state.toc[tocIdx].clazz = clazz;
    let toc = this.state.toc;
    this.setState({ toc });
  }

  //删除课时
  deleteClazz(clazzIdx, tocIdx) {
    let toc = this.state.toc;
    //  bootbox.confirm({
    //   message: "是否要删除当前课时！",
    //   callback: function (result) {
    //     if (result == true) {
    let after = toc[tocIdx].clazz.splice(clazzIdx, 1);
    this.setState({ toc });
    //     }
    //   }.bind(this)
    // })

   // this.setState({ toc });
  }

  //删除章节
  deleteChapter(tocIdx) {
    let toc = this.state.toc;
    bootbox.confirm({
      message: "是否要删除当前章节(同时删除章节下所有课程！)",
      callback: function (result) {
        if (result == true) {
          let after = toc.splice(tocIdx, 1);
          this.setState({ toc });
        }
      }.bind(this)
    })
  }
  // 上传试题
  handleExam(clazzIdx, tocIdx, clazzTitle) {
    this.setState({clazzIdx, tocIdx});
    if (!this.state.toc[tocIdx].clazz[clazzIdx].isHasExam) {
      this.state.visible = true;
      this.state.data = {
        clazzName: this.state.toc[tocIdx].clazz[clazzIdx].title,
        createId: guser._id,
        createName: guser.name,
        questions: [{
          title: '',
          options: [
            { optDetail: '', isTrue: false },
            { optDetail: '', isTrue: false },
            { optDetail: '', isTrue: false },
            { optDetail: '', isTrue: false },
          ],
          result: '',
        }],
      }
      this.setState({});
    } else {
      axios.get(`/showExamByClazz?examTplId=${this.state.toc[tocIdx].clazz[clazzIdx].examTplId}`).then(res => {
        this.setState({ data: res.data, visible: true });
      }).catch(err => console.error('err', err));
    }
    // this.examModal.showModal(this.state.toc[tocIdx].clazz[clazzIdx].examTplId, clazzTitle);
    // delete this.state.toc[tocIdx].clazz[clazzIdx].id;
    // let toc = this.state.toc;
    // this.setState({ toc });
  }

  //生成课程
  genClazz(cha, idx) {
    if (!cha) {
      return;
    }
    let courses = cha.clazz.map((course, index) => {
      let uploadInfo = "上传课程";
      let uploadStyle = {};
      // 上传视频
      if (course.rawPath) {
        uploadInfo = "已上传";
        uploadStyle = {
          color: '#00AA00',
          fontWeight: 'bold',
        }
      }
      return (
        <div className="barclazz" key={index}>
          <table>
            <tbody>
              <tr>
                <td>
                  <span className="clazz">课时{index + 1}</span>&nbsp; &nbsp;
                  <span className="clazzname">
                    <Popover placement="top" content={<div>不要超过25个字</div>} trigger="click">
                      <input type="text" ref="clazzName" placeholder="填写课时名称" value={course.title} maxLength="25" style={{ width: '85.5%' }} onChange={this.handleClazz.bind(this, index, idx)} />
                    </Popover>
                  </span>
                </td>
                <td>
                  <Icon type="up-square" className="updown" onClick={this.reorderClazz.bind(null, 'up', index, idx)} />&nbsp;
                  <Icon type="down-square" className="updown" onClick={this.reorderClazz.bind(null, 'down', index, idx)} />
                </td>
                <td>
                  <img src="../../img/unupload.png" className="updown" style={{ marginTop: -5 }} />
                  <button type="button" className="upclazz" style={uploadStyle} data-toggle="tooltip" data-placement="bottom" onClick={this.onUpload.bind(this, idx, index)} title={this.state.toc[idx].clazz[index].name}>
                    {uploadInfo}
                  </button>
                </td>
                <td>
                  <Button type="primary" size="small" style={{ marginLeft: '2%' }} onClick={this.handleExam.bind(this, index, idx, course.title)} >{this.state.toc[idx].clazz[index].isHasExam ? `编辑试题` : `上传试题`}</Button>
                  <input type="checkbox" ref="checkValue" className="free" checked={course.isFree} onChange={this.handleCheck.bind(this, index, idx)} />试学
                  <span className="glyphicon glyphicon-remove updown" id="delete" style={{ color: 'red', marginLeft: '10px' }} onClick={this.deleteClazz.bind(null, index, idx)}></span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    });
    return courses;
  }
  // 课题组件的方法
  // 关闭
  handleCancel = () => {
    this.setState({ visible: false });
  }
  // 删除单个是试题
  delQuestion = (index) => {
    if (this.state.data.questions.length === 0) {
      return;
    }
    _.pullAt(this.state.data.questions, index);
    this.setState({});
  }
  // 题目标题
  handleTitle = (index, e) => {
    this.state.data.questions[index].title = e.target.value;
    this.setState({});
  }
  // 新增选项
  newOption = (index) => {
    if(this.state.data.questions[index].options.length >= 6){
       message.warn('答案不能超过六个');
        return;
    }
    this.state.data.questions[index].options.push({
      optDetail: '',
      isTrue: false,
    });
    this.setState({});
  }
  // 选项内容
  handleOption = (queidx, optidx, e) => {
    this.state.data.questions[queidx].options[optidx].optDetail = e.target.value;
    this.setState({});
  }
  // 勾选
  selOption = (queidx, optidx, e) => {
    let { questions } = this.state.data;
    if (e.target.checked) {
      questions[queidx].options[optidx].isTrue = true;
      questions[queidx].result += optidx;
    } else {
      questions[queidx].options[optidx].isTrue = false;
      questions[queidx].result = questions[queidx].result.replace(optidx, '');
    }
    this.setState({});
  }
  // 删除
  delOption = (queidx, optidx) => {
    let { options } = this.state.data.questions[queidx];
    let { result } = this.state.data.questions[queidx];

    _.pullAt(options, optidx);
    if(options.length < 2){
          message.warn('答案不能少于2个');
          return;
    };

    if (result.includes(optidx)) {
      result = result.replace(optidx, '');
    }
    this.setState({});
  }
  // 新建试题
  newQuestion = () => {
    this.state.data.questions.unshift({
      title: '',
      options: [
        { optDetail: '', isTrue: false },
        { optDetail: '', isTrue: false },
        { optDetail: '', isTrue: false },
        { optDetail: '', isTrue: false },
      ],
      result: '',
    });
    this.setState({});
  }
  // 保存试题
  saveQuestions = (queidx, optidx) => {
    if (this.state.data.questions.length < 15) {
      message.warn('考题数不可低于15个!');
      return;
    }
    let inputs =  $("input[class='ant-input']");
    let quesAns = this.state.data.questions;
    for(let d of quesAns){
      
      if(d.result == ""){
        message.warn('请勾选至少一个答案');
        return;  
      }
      if(d.title == ""){
        message.warn('题目标题不能为空');
        return;
      }
      for(let s of d.options){
        if(s.optDetail == ""){
          message.warn('题目答案不能为空');
          return;
        }
      };

    };

    axios.post('/saveExamByClazz', { data: this.state.data }).then(res => {
      if (res.data._id || !this.state.toc[this.state.tocIdx].clazz[this.state.clazzIdx].isHasExam) {
        this.state.toc[this.state.tocIdx].clazz[this.state.clazzIdx].examTplId = res.data._id;
        this.state.toc[this.state.tocIdx].clazz[this.state.clazzIdx].isHasExam = true;
        this.setState({});
      }
    }).catch(err => console.log('err', err));
    this.setState({ visible: false });
   
  }
  /*
   * 题目生成选项
   * @param {String} value 所有选择题
   * @param {any} index 第几道选择题
   * @param {any} val 每个选择题选项
   * @param {any} idx 第几个选择题选项
   */
  genOpts = (value, index) => {
    if (!value) {
      return;
    }
    return value.options.map((val, idx) => {
      return (
        <div key={idx} style={{ width: '90%' }}>
          <Input addonBefore={<Checkbox onChange={this.selOption.bind(null, index, idx)} checked={val.isTrue}></Checkbox>}
            addonAfter={<Icon type="close" className="delAnswer" onClick={this.delOption.bind(null, index, idx)} />} value={val.optDetail} onChange={this.handleOption.bind(null, index, idx)} />
        </div>
      )
    });
  }
  // 为了避免兄弟组件传值的尴尬，将课题组件建立于此
  //
  uploadXlsx = () =>{

  }
  //导出试题
  exportXlsx = () => {
    let date = this.state.data.questions;
    let optionAll = [];
    let optionItem = ["题目标题", "答案总数", "正确答案", "答案1", "答案2", "答案3", "答案4", "答案5", "答案6"];

    date.map(function(content, index){
      optionAll[index] = [];
      optionAll[index].push(content.title);     
      optionAll[index].push(content.options.length);
      optionAll[index].push(content.result);
      content.options.map((ctn) => {
      optionAll[index].push(ctn.optDetail);
      })
    });
    optionAll.unshift(optionItem);
    // console.log(optionAll);
     $.post("/downloadExcel", { result: JSON.stringify(optionAll), sheetname: '试题导出'}, function(exportresult) {
        // window.location.href = exportresult.path;
        $('#download').attr("href", exportresult.path);
    })
  }

  //批量删除
  deleteQues = () => {
    $('.deleteQues .ant-checkbox-checked').parent().parent('.examQues').find($('.delTitle')).map((index, ele) => {
      $(ele).trigger('click');
      $('.deleteQues>span').attr('class', 'ant-checkbox');
    });
  }


  genExam() {
    let dataQues = this.state.data.questions;
    const props = {
      name: 'file',
      action: '/uploadExcel',
      onChange(info) {
        if (info.file.status !== 'uploading') {
          // console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
          // console.log(info.file.response);
          let arr = info.file.response.arr;
          let examQues = $(".examQues");
          let textArea = [];
          let oneOrmore = [];

          examQues.map((ele, index) => {
            $(".delTitle").trigger("click");
            $('.examQues>textarea.ant-input').val("");
          })
          arr.map((eles, index)=> {
            $("#newQuestions").trigger("click");
            textArea.push($('.examQues>textarea.ant-input'));
          });
          
          textArea.map((ele, index) => {
            let leng = dataQues[index].options.length;
            let count = arr[index][1] - leng;
            let delAnswer = $('textarea.ant-input').eq(index).parent().find(".delAnswer");
            oneOrmore.push(arr[index][3]);
            for(var i=0; i < count;i++){
              $(".addAnswer").eq(index).trigger('click');
            };

            if(count < 0){
              for(var i=0; i < -count;i++){
                  dataQues[index].options.pop();
                  delAnswer.eq(leng - i - 1).trigger('click');
              }
            };

            ele.eq(index).val(arr[index][0]);
            dataQues[index].title = arr[index][0];

            for(var i=0;i < arr[index][1];i++){
              dataQues[index].options[i].optDetail = arr[index][i + 4];
              if(oneOrmore[index] == "多选"){
                let option = arr[index][2].split(' ');
                let result = option.join('');
                option.map((ele, idx) => {
                    dataQues[index].options[ele].isTrue = true;
                    dataQues[index].result = result;
                })
              }
              // console.log(dataQues[0].result);            
              if(arr[index][i + 2] == 0){
                dataQues[index].options[0].isTrue = true;
                dataQues[index].result = '0';
              }
              if(arr[index][i + 2] == 1){
                dataQues[index].options[1].isTrue = true;
                dataQues[index].result = '1';
              }
              if(arr[index][i + 2] == 2){
                dataQues[index].options[2].isTrue = true;
                dataQues[index].result = '2';
              } 
              if(arr[index][i + 2] == 3){
                dataQues[index].options[3].isTrue = true;
                dataQues[index].result = '3';
              }
              if(arr[index][i + 2] == 4){
                dataQues[index].options[4].isTrue = true;
                dataQues[index].result = '4';
              }
              if(arr[index][i + 2] == 5){
                dataQues[index].options[5].isTrue = true;
                dataQues[index].result = '5';
              }
            }
          });
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };
    const menu = (
      <Menu>
        <Menu.Item key="0">
            <Upload {...props}>
              <a href="javascript:;" onClick={this.uploadXlsx.bind(null)}>Excel导入试题<Icon type="upload" /></a>
            </Upload>
        </Menu.Item>
        <Menu.Item key="1">
          <a href="javascript:;" id="download" onClick={this.exportXlsx.bind(null)}>Excel导出试题<Icon type="download" /></a>
        </Menu.Item>
        <Menu.Item key="2">
          <a href="JavaScript:;" onClick={this.deleteQues.bind(null)}>批量删除试题<Icon type="delete" /></a>
        </Menu.Item>
      </Menu>
    );
    let posWidth = document.documentElement.offsetWidth;
    return (
      <div>
        <Modal
          visible={this.state.visible}
          onCancel={this.handleCancel}
          width={1000}
          style={{ top: 20 }}
          maskClosable={false}
          footer={null}
          className="scrollQues" 
        >
          <div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>新建试题(当前课程: {$('#name').val()})</div>
            <div className="fixBar">
              <Button id="newQuestions" onClick={this.newQuestion.bind(null)} style={{ marginRight:8 }}>新建试题</Button>
              <Button id="saveQuestions" onClick={this.saveQuestions.bind(null)} style={{ marginRight:8 }} >保存试题</Button>
              <Dropdown overlay={menu} trigger={['click']} style={{ marginLeft: 230 }}>
                <a className="ant-dropdown-link" href="#">更多操作<Icon type="down" /></a>
              </Dropdown>
            </div>
            <p style={{ color: "lightgrey", fontSize: 12, marginTop:30 }}>小提示：为了保证考试效果，建议考题数不得小于15道题，当前共{ this.state.data.questions.length }道题</p>
            {this.state.data.questions.map((question, index) => {
              let options = this.genOpts(question, index);
              return (
                <div style={{ paddingTop: 10 }} key={index} className="examQues">
                  <Checkbox className="deleteQues"></Checkbox>
                  <span style={{ fontWeight: 500, fontSize: 15 }}>题目标题</span>
                  <Input type="textarea" placeholder="填写题目标题" autosize value={question.title} onChange={this.handleTitle.bind(null, index)} style={{ width: '90%', display: 'block' }} />
                  <span style={{ fontWeight: 500, fontSize: 12, display: 'inline' }}>题目答案(请选中1个或多个选项，作为正确答案)</span>
                  {options}
                  <Button size="small" className="addAnswer" onClick={this.newOption.bind(null, index)}>新增选项</Button>
                  <Button size="small" className="delTitle" style={{ float: 'right', marginRight: '10%' }} onClick={this.delQuestion.bind(null, index)}>删除题目</Button>
                  <div className="clear"></div>
                </div>
              )
            })
            }
          </div>
        </Modal>
      </div>
    );
  }


  render() {
    //生成章节
    let body = this.state.toc.map((cha, idx) => {
      let clazz = this.genClazz(cha, idx);
      return (
        <div key={idx}>
          <div className="messdiv">
            <div className="bartoc">
              <table>
                <tbody>
                  <tr>
                    <td>
                      <span className="tocidx">章节{idx + 1}</span>&nbsp; &nbsp;
                      <span className="tocname">
                        <Popover placement="top" content={<div>不要超过25个字</div>} trigger="click">
                          <input type="text" ref='chapterName' placeholder="填写章节名称" value={cha.chapter} maxLength="25" style={{ width: '88%' }} onChange={this.handleChapter.bind(this, idx)} />
                        </Popover>
                      </span>
                    </td>
                    <td>
                      <Icon type="up-square" className="updown" onClick={this.reorderChapter.bind(null, 'up', idx)} />&nbsp;
                      <Icon type="down-square" className="updown" onClick={this.reorderChapter.bind(null, 'down', idx)} />
                    </td>
                    <td></td>
                    <td>
                      <span className="glyphicon glyphicon-remove updown" id="deleteChapter" onClick={this.deleteChapter.bind(this, idx)} style={{ color: 'red', textAlign: "left", marginLeft: 25 }} ></span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              {clazz}
            </div>
            <div className="addclazz"><button onClick={this.addClazz.bind(this, idx)}>+添加课时</button></div>
          </div>
        </div>
      )
    });

    return (
      <div>
        {this.genExam()}
        <div className="messdiv" id="toctop">
          <div className="addtoc">
            <button onClick={this.addChapter.bind(this)} disabled={this.state.disabled}>+ 添加章节</button>
          </div>
          <div className="tabtop">
            <table>
              <tbody>
                <tr>
                  <td>课程信息</td>
                  <td>移动</td>
                  <td>上传课程</td>
                  <td>操作</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {body}
      </div>
    );
  }
}

export default TocEditor;