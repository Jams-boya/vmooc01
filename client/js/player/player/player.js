import _ from 'lodash';
import 'bootstrap/dist/js/bootstrap.min.js';
import React, { Component } from 'react';
import ReactDom from 'react-dom';
import videojs from 'video.js';
import axios from 'axios';
// import '../../common/video/video-js.min.css';
import './css/play.css';
import './css/buttons.css';
import { Modal, Input, Tooltip, Icon, Button, message, Checkbox, Affix, Popover } from 'antd';
import bootbox from 'bootbox';
import config from '../../../../server/config.js';
import ExamModal from './examModal';

class Player extends Component {
  constructor(props) {
    let video;
    super(props);
    this.state = {
      visible: false,
      data: this.props.data,
      curVideo: 0,
      payCheck: this.props.payCheck,
      videoUrl: '',
      lessonFree: 0,
      start: new Date().getTime(),
      video: null,
      courses: [],
      chapter: this.props.cidx,
      idx: this.props.index,
      qaSort: 'peek',
      myCourse: this.props.myCourse,
      modalFlag: true,
      examTitle: '',
      wasTest: false,
      exam: {
        examTplId: '',
        clazzName: this.props.data.name,
        courseId: this.props.data._id,
        studentId: guser._id,
        studentName: guser.name,
        questions: [],
        score: 0,
      },
    }
  }

  componentDidMount() {
    //判断是否是讲师 是=可以自由观看
    if (this.state.data.teacherId == guser._id) {
      this.state.payCheck = true;
    }

    let id = -1;
    //处理所有课时用于切换
    this.state.data.toc.map((chapter, cidx) => {
      chapter.clazz.map((clazz, index) => {
        if (clazz.isFree) this.state.lessonFree++;
        clazz.cidx = cidx;
        clazz.index = index;
        this.state.courses.push(clazz);
      });
    });

    let cid = _.findIndex(this.state.courses, (o) => { return o.cidx == this.state.chapter && o.index == this.state.idx; });
    //加载VIDEO控件
    this.state.video = videojs('video_player');
    if (!this.state.payCheck && !this.state.courses[cid].isFree) {
      this.refs.payModal.style.display = 'block';
      return;
    }

    //VIDEO控件初始化
    let thumbnail = `/getvideofile?path=/thumbnail/${this.state.data.toc[this.state.chapter].clazz[this.state.idx].videoPath.split('/')[2]}.png`;
    this.state.video.poster(thumbnail);
    if (this.state.payCheck && this.state.myCourse) {
      this.bindVideoFinish();
    }
    this.state.video.src(`/getvideofile?path=/${this.state.data.toc[this.state.chapter].clazz[this.state.idx].videoPath}`); //video_url

    //判断是否有我的课程数据，并自动定位
    if (this.state.myCourse) {
      let time = 0;
      id = _.findIndex(this.state.myCourse.progress, (o) => { return o.cidx == this.state.chapter && o.index == this.state.idx; });
      if (this.state.myCourse.progress[id])
        time = this.state.myCourse.progress[id].playTime;
      this.state.video.currentTime(time);
      this.state.video.play();
    }

  }

  //点击返回按钮时根据播放时长标记课时完成状态
  back(e) {
    let end = new Date().getTime();
    let curTime = (new Date().getTime() - this.state.start) / 1000;
    let videoTime = Math.ceil(this.state.video.duration());
    let playTime = this.state.video.currentTime();
    let courseId = this.state.data._id;
    let id = -1;
    if (this.state.myCourse)
      id = _.findIndex(this.state.myCourse.speedStu.lookedCourses, (o) => { return o.cidx == this.state.chapter && o.index == this.state.idx; });
    if (videoTime && playTime >= videoTime && this.state.myCourse) {
      bootbox.confirm({
        message: '您已观看本课时的大部分内容，是否要标记本课时为学习完成状态？',
        buttons: {
          confirm: {
            label: '是',
            className: 'btn-success'
          },
          cancel: {
            label: '否',
            className: 'btn-danger'
          }
        },
        callback: (result) => {
          if (result) {
            //添加课时学习进度
            $.ajax({
              url: '/updateStudySpeed',
              type: 'get',
              data: {
                courseId: courseId,
                cidx: this.state.chapter,
                index: this.state.idx,
                playTime: Math.ceil(playTime),
                progress: true,
              },
              success: (result) => {
                window.location.href = '/course/' + courseId;
              },
              error: (err) => console.log('err4', err)
            });
          }
        }
      });
    } else {
      window.location.href = '/course/' + this.props.data._id;
    }
  }

  genVideoPlayer() {
    let shadowStyle = { height: this.props.playerSize.height, width: this.props.playerSize.width, zIndex: '9998', backgroundColor: 'black', display: 'none' }
    let style = {}
    let info;
    let btn;
    if (!this.state.payCheck && !this.state.data.toc[this.state.chapter].clazz[this.state.idx].isFree) {
      shadowStyle.display = 'block';
      style.display = 'none';
    }
    //自动定位
    if (this.state.myCourse) {
      let time = 0;
      let id = _.findIndex(this.state.myCourse.progress, (o) => { return o.cidx == this.state.chapter && o.index == this.state.idx; });
      if (this.state.myCourse.progress[id])
        time = this.state.myCourse.progress[id].playTime;
      info = "系统为您自动定位到上次观看的时间" + parseInt(time / 60) + ':' + (time % 60 < 10 ? 0 : '') + Math.ceil(time % 60) + "开始播放";
      btn = (<button className="btn btn-xs play-start" onClick={this.restart.bind(this)} style={{ marginLeft: '10px' }}>从头开始</button>);
    }
    let title = this.state.data.isMicroCourse ? this.state.data.name : this.state.data.name + "--" + this.state.data.toc[this.state.chapter].clazz[this.state.idx].title;
    return (
      <div className="playRight">
        <div style={{ height: '7%', width: '100%', marginTop: '1%' }}>
          <span onClick={this.back.bind(this)} style={{ height: '30px', marginLeft: '15px', marginRight: '15px', float: 'left' }}>
            <Button type="default" shape="circle" icon="arrow-left" />
            &nbsp;返回课程主页
          </span>
          <p style={{ fontSize: '16px', marginTop: '3px', float: 'left', marginRight: '5px', color: '#108ee9' }}>
            您正在学习:
          </p>
          <p style={{ fontSize: '14px', float: 'left', marginTop: '6px' }}>
            {title}
          </p>
        </div>
        <div className="video-container" style={style}>
          <video id="video_player" className="video-js vjs-default-skin"
            controls
            width={this.props.playerSize.width} height={this.props.playerSize.height}>
          </video>
        </div>
        <div className="payShadow" ref="payShadow" style={shadowStyle}>
        </div>
        <div className="bottom" style={{ width: '100%', minHeight: '35px', margin: '0px', padding: '0px', backgroundColor: '#888888', float: 'right', height: '45px' }}>
          <div className="play-info" style={{ marginTop: '4px', float: 'left', marginLeft: '13px' }}>
            {info}
            {btn}
          </div>
          <div className="btn-group" style={{ float: 'right', marginTop: '10px', marginRight: '10px', marginBottom: '10px' }}>
            <Button type="button" id="prev" className="toggle">上一课时</Button>
            <Button type="button" id="next" style={{ 'marginLeft': '10px' }} className="toggle">下一课时</Button>
          </div>
        </div>
      </div>
    );
  }

  //从头开始播放
  restart() {
    this.state.video.currentTime(0);
    this.state.video.play();
    $(".play-info").empty();
  }

  //生成课程目录信息
  genCourseContent() {
    let count = 0;
    let chapter = this.state.data.toc.map((chapter, key) => {
      let clazz = chapter.clazz.map((c, idx) => {
        let course_span;
        let title_style = {
          fontSize: '14px',
          marginLeft: '8px',
          float: 'left',
          width: '33%',
          whiteSpace: 'nowrap',         /*不换行*/
          textOverflow: 'ellipsis',         /*超出的显示省略号*/
          overflow: 'hidden',                  /*超出部分隐藏*/
          wordWrap: 'normal'             /*长单词不换行-兼容ie*/
        }

        if (this.state.payCheck) {
          course_span = (<div className="circle">{idx + 1}</div>);
        } else {
          if (c.isFree == true) {
            course_span = (<div className="circle" style={{ 'borderColor': 'red', 'color': 'red' }}>试</div>);
          } else {
            course_span = (<div className="circle" style={{ 'borderColor': 'red', 'color': 'red' }}>&minus;</div>);
          }
        }
        count++;
        if (count == this.state.curVideo) {
          title_style.fontWeight = 'bold';
        }

        let id = key + "," + idx;
        //课时时间
        let time = "00:00";
        if (c.time) {
          time = parseInt(c.time / 60) + ':' + (c.time % 60 < 10 ? 0 : '') + Math.ceil(c.time % 60);
        }
        let selectClass = "catacontent btn-default";
        if (key == this.state.chapter && idx == this.state.idx) {
          selectClass = "catacontent btn-default select";
        }
        return (
          <div className={selectClass} key={idx} id={id} style={{ 'border': '0px' }}>
            {course_span}
            <span title={c.title} className="smtitle" className={idx} id={id}>
              <a id={id} style={title_style} onClick={this.courseSel.bind(this)}>{c.title}</a>
              <Button size="small" style={{ float: 'left', marginLeft: 3, marginRight: 3, display: !c.result || c.result === 0 ? 'none' : 'inline-block' }} onClick={this.showModal.bind(null, key, idx, c.result)}>{this.btnName(c.result)}</Button>
            </span>
            <i className='fa fa-play-circle-o playimg'></i>
            <span className="playtime" id={id}>{time}</span>
            <div className="clear"></div>
          </div>
        );
      });

      let chapterTitle = this.state.data.isMicroCourse ? "" : "章节" + (key + 1);
      if (chapter.chapter.length >= 14) {
        chapter.chapter = chapter.chapter.slice(0, 10);
        chapter.chapter += "...";
      }
      return (
        <div className="catamain" key={key}>
          <div className="catatitle">
            <span className="lgchapter">{chapterTitle}</span>
            <span className="smchapter">{this.state.data.isMicroCourse ? '共一课时' : chapter.chapter}</span>
          </div>
          {clazz}
        </div>
      );
    });

    return (
      <div className="main" id="player_Content" style={{ 'overflow': 'auto', height: this.props.cataHeight, 'overflowX': 'hidden', 'marginTop': '5px' }}>
        {chapter}
      </div>
    );
  }

  //问答排序
  sortQA(sort, e) {
    this.setState({ qaSort: sort });
  }

  //生成问答目录
  genQAContent() {
    let teacher;
    let qa;
    let qaContent = [];
    $.ajax({
      url: '/playerTeacherInfo',
      type: 'get',
      async: false,
      data: {
        courseId: this.state.data._id,
        teacherId: this.state.data.teacherId
      },
      success: (result) => {
        teacher = result.teacher;
        qa = result.qa;
        // console.log(result);
      },
      error: (err) => console.log('err5', err)
    });
    if (this.state.qaSort == 'peek') {
      _.sortBy(qa, function (q) {
        return -q.peekCount;
      })
    } else {
      _.sortBy(qa, (q) => {
        return -q.likeCount;
      })
    }
    if (qa.length != 0) {
      qa.map((q, idx) => {
        let qa_url = "/expertqa/" + q._id + "/" + teacher.userId;
        qaContent.push(
          <div className="qmain">
            <div className="qleft">
              <img className="img-circle" src={`${config.avatorUrl}/uploadpic/${q.askerAvatar}`} />
            </div>
            <div className="qright">
              <span className="detail">{q.title}</span>
              <span className="qpa">偷看<span className="qpeek">{q.peekCount}</span>&nbsp;&nbsp;点赞<span className="qagree">{q.likeCount}</span></span>
            </div>
            <div className="qbuttom">
              <a href={qa_url} target="_blank" className="qbtn button button-primary button-rounded button-small">查看详情</a>
            </div>
            <div className="clear"></div>
          </div>
        );
      });
    }
    return (
      <div className="main" id="player_FAQ" style={{ 'display': 'none' }}>
        <div className="character">
          <div className="chleft">
            <img src={`${config.avatorUrl}/uploadpic/${teacher.avatar}`} alt="头像" />
          </div>
          <div className="chright">
            <div className="chintro">
              <span className="name">{teacher.name}</span>
              <span className="job">{teacher.professionalTitle}</span>
            </div>
          </div>
          <span className="declare">{teacher.briefDescription}</span>
          <div className='clear'></div>
        </div>
        <div className="money">
          <a href="javascript:;" onClick={this.props.quiz.bind(this, qa, teacher)} className="mbtn button button-primary button-rounded button-small">{teacher.money}元提问</a>
        </div>
        <div className="payask">
          <span className="pa">付费问答</span>
          <span className="paright">
            <span className="glyphicon glyphicon-sort" style={{ float: 'left' }}></span>
            <span className="btn-default" style={{ border: '0px', float: 'left' }} onClick={this.sortQA.bind(this, 'peek')}>偷看</span>
            <span className="linespan" style={{ float: 'left' }}>|</span>
            <span className="btn-default" style={{ border: '0px', float: 'left', 'marginRight': '5px' }} onClick={this.sortQA.bind(this, 'like')}>点赞</span>
          </span>
          <div className='clear'></div>
        </div>
        <div className="question" style={{ height: this.props.qaHeight }}>
          <div className="qblock" style={{ height: this.props.qaHeight }}>
            {qaContent}
          </div>
        </div>
      </div>
    );
  }

  //菜单
  genMenu() {
    return (
      <div className="playhead">
        <div className="hleft">
          <span className="title">{this.state.data.name}</span>
          <span className="peek"><span id="num">{this.state.data.purchaseCount}</span>人学过</span>
        </div>
        <div className="hright">
          <img src={this.state.data.cover} alt="监理工程图片" />
        </div>
        <div className="clear"></div>
      </div>
    );
  }

  //菜单切换
  menuSel(e) {
    if (e.target.id == "QA_sel") {
      $("#QA_sel").css('color', '#25AA1D');
      $("#Content_sel").css('color', '#A0A0A0');
      $("#player_FAQ").show();
      $("#player_Content").hide();
    } else {
      $("#QA_sel").css('color', '#A0A0A0');
      $("#Content_sel").css('color', '#25AA1D');
      $("#player_FAQ").hide();
      $("#player_Content").show();
    }
  }

  //选择课时播放
  courseSel(e) {
    this.savePlayProgress();
    let id = -1;
    this.state.chapter = Number(e.target.id.split(',')[0]);
    this.state.idx = Number(e.target.id.split(',')[1]);

    //判断当前能播放的第几课
    if (this.state.courses)
      id = _.findIndex(this.state.courses, (o) => { return o.cidx == this.state.chapter && o.index == this.state.idx; });
    //判断用户是否已付费
    if (!this.state.payCheck && !this.state.courses[id].isFree) {
      this.state.video.hide();
      this.refs.payShadow.style.display = 'block';
      this.refs.payModal.style.display = 'block';
      this.setState({});
      return;
    }
    //重新加载视频空间
    let thumbnail = `${config.videoStoreUrl}/thumbnail/${this.state.data.toc[this.state.chapter].clazz[this.state.idx].videoPath.split('/')[2]}.png`;
    this.state.video.poster(thumbnail);
    if (this.state.payCheck && this.state.myCourse)
      this.bindVideoFinish();
    //'http://116.193.48.186:8003/' + this.state.data.toc[this.state.chapter].clazz[this.state.idx].videoPath
    this.state.video.src(`${config.videoStoreUrl}/${this.state.data.toc[this.state.chapter].clazz[this.state.idx].videoPath}`);
    this.refs.payShadow.style.display = 'none';
    this.refs.payModal.style.display = 'none';
    this.state.video.show();
    this.state.video.play();
    this.setState({});
  }

  //切换课时
  toggleCourse(course) {
    this.savePlayProgress();
    this.state.chapter = course.cidx;
    this.state.idx = course.index;
    if (!this.state.payCheck && !course.isFree) {
      this.state.video.hide();
      this.refs.payShadow.style.display = 'block';
      this.refs.payModal.style.display = 'block';
      this.setState({});
      return;
    }
    let thumbnail = `${config.videoStoreUrl}/thumbnail/${this.state.data.toc[this.state.chapter].clazz[this.state.idx].videoPath.split('/')[2]}.png`;
    this.state.video.poster(thumbnail);
    if (this.state.myCourse)
      this.bindVideoFinish();
    //'http://116.193.48.186:8003/' + this.state.data.toc[this.state.chapter].clazz[this.state.idx].videoPath
    this.state.video.src(`${config.videoStoreUrl}/${this.state.data.toc[this.state.chapter].clazz[this.state.idx].videoPath}`);
    this.refs.payShadow.style.display = 'none';
    this.refs.payModal.style.display = 'none';
    this.state.video.show();
    this.state.video.play();
    this.setState({});
  }

  modalBlur(e) {
    this.refs.payModal.style.display = 'none';
  }

  //保存当前播放进度
  savePlayProgress() {
    if (this.state.payCheck) {
      $.ajax({
        url: '/updateStudySpeed',
        type: 'get',
        data: {
          courseId: this.state.data._id,
          cidx: this.state.chapter,
          index: this.state.idx,
          playTime: Math.ceil(this.state.video.currentTime()),
          totalTime: Math.ceil(this.state.video.duration()),
          progress: false,
        },
        success: (result) => {
        },
        error: (err) => console.log('err6', err)
      });
    }
  }


  //支付框显示
  onPay(e) {
    window.location.href = '/course/' + this.state.data._id;
  }

  bindVideoFinish() {
    let isHasExam = this.state.data.toc[this.state.chapter].clazz[this.state.idx].isHasExam;
    // console.log(this.state.chapter, this.state.idx);
    this.state.video.on('timeupdate', () => {
      // 播放进度判断
      let id = _.findIndex(this.state.myCourse.speedStu.lookedCourses, (o) => { return o.cidx == this.state.chapter && o.index == this.state.idx; });
      if (this.state.video.duration() != 0 && this.state.video.currentTime() >= this.state.video.duration()) {
        if (!this.state.modalFlag || id >= 0)
          return;
        this.state.modalFlag = false;
        bootbox.confirm({
          message: '该课时已播放完，是否要标记本课时为完成状态?',
          buttons: {
            confirm: {
              label: '是',
              className: 'btn-success'
            },
            cancel: {
              label: '否',
              className: 'btn-danger'
            }
          },
          callback: (result) => {
            // console.log(result);
            if (result) {
              //添加课时学习进度
              $.ajax({
                url: '/updateStudySpeed',
                type: 'get',
                data: {
                  courseId: courseId,
                  cidx: this.state.chapter,
                  index: this.state.idx,
                  playTime: Math.ceil(this.state.video.currentTime()),
                  totalTime: Math.ceil(this.state.video.duration()),
                  progress: true,
                  isHasExam: isHasExam,
                },
                success: (result) => {
                  let curVideo = _.findIndex(this.state.courses, o => o.cidx == this.state.chapter && o.index == this.state.idx);
                  this.toggleCourse(this.state.courses[curVideo + 1]);
                },
                error: (err) => console.log('err1', err)
              });
            } else {
              let curVideo = _.findIndex(this.state.courses, (o) => { return o.cidx == this.state.chapter && o.index == this.state.idx; }) + 1;
              if (curVideo == this.state.courses.length)
                curVideo--;
              this.toggleCourse(this.state.courses[curVideo]);
            }
            window.location.href = '/player/' + courseId;
          }
        });
      } else if (this.state.video.currentTime() != 0 && this.state.video.currentTime() % 30 == 0) {
        $.ajax({
          url: '/updateStudySpeed',
          type: 'get',
          data: {
            courseId: courseId,
            cidx: this.state.chapter,
            index: this.state.idx,
            playTime: Math.ceil(this.state.video.currentTime()),
            totalTime: Math.ceil(this.state.video.duration()),
            progress: false,
          },
          success: (result) => {
          },
          error: (err) => console.log('err2', err)
        });
      }
    });
  }
  // 考试modal------------
  showModal = (tidx, cidx, result) => {
    this.state.examTitle = this.state.data.toc[tidx].clazz[cidx].title;
    if (result === 3) {
      axios.get(`/queryPreScore?courseId=${this.state.data._id}&userId=${guser._id}&examTplId=${this.state.data.toc[tidx].clazz[cidx].examTplId}`).then(res => {
        res.data.questions.map(que => {
          let addOne = n => Number(n) + 1;
          que.tempAnswers = _.map([...que.answers], addOne);
          _.join(que.tempAnswers, '');
          return que;
        });
        this.setState({ exam: res.data, visible: true, wasTest: true });
      }).catch(err => console.log('err', err));
    } else {
      this.state.data.toc[tidx].clazz[cidx].examData.map(v => {
        v.answers = '';
        v.tempAnswers = '';
        return v;
      });
      this.state.exam.questions = this.state.data.toc[tidx].clazz[cidx].examData;
      this.state.exam.examTplId = this.state.data.toc[tidx].clazz[cidx].examTplId;
      this.setState({ wasTest: false, visible: true });
    }
  }
  onCancel = () => {
    this.setState({ visible: false });
  }

  // 交卷
  SubmitExam = () => {
    let examKey = _.findKey(this.state.exam.questions, question => question.answers == '');
    let quesCount = this.state.exam.questions.length;
    if (!!examKey) {
      return message.warning(`还有${quesCount - Number(examKey)}道题未回答`, 2);
    }
    axios.post(`/saveStudentExam`, { studentExam: this.state.exam }).then(res => {
      this.setState({ visible: false });
      if (res.data.score < 60) {
        Modal.warning({
          title: '尴尬了吧,你没能及格!',
          content: (<h3>此次得分{res.data.score}分</h3>),
          onOk: () => {
            this.state.data.toc[this.state.chapter].clazz[this.state.idx].result = 3;
            window.location.href = '/player/' + courseId;
          },
        });
      } else {
        Modal.success({
          title: '不错哦!你过关啦, 再接再厉哦!',
          content: (<h3>此次得分{res.data.score}分</h3>),
          onOk: () => {
            this.state.data.toc[this.state.chapter].clazz[this.state.idx].result = 2;
            window.location.href = '/player/' + courseId;
          },
        });
      }
      this.setState({});
    }).catch(err => console.log('err3', err));
  }
  // 选择
  selOption = (queidx, optidx, e) => {
    let { questions } = this.state.exam;
    if (e.target.checked) {
      questions[queidx].options[optidx].isTrue = true;
      questions[queidx].answers += optidx;
      optidx += 1;
      questions[queidx].tempAnswers += optidx;
    } else {
      questions[queidx].options[optidx].isTrue = false;
      questions[queidx].answers = questions[queidx].answers.replace(optidx, '');
      optidx += 1;
      questions[queidx].tempAnswers = questions[queidx].tempAnswers.replace(optidx, '');
    }
    questions[queidx].tempAnswers = _.join([...questions[queidx].tempAnswers].sort(), '');
    questions[queidx].answers = _.join([...questions[queidx].answers].sort(), '');
    this.setState({});
  }
  genOpts = (value, index) => {
    if (!value) {
      return;
    }
    return value.options.map((val, idx) => {
      return (
        <div key={idx} style={{ width: '90%' }}>
          <Checkbox onChange={this.selOption.bind(null, index, idx)} style={{ marginLeft: 10 }} defaultChecked={this.state.wasTest ? val.isTrue : false} disabled={this.state.wasTest}>{String.fromCharCode(64 + parseInt(idx + 1))} {val.optDetail}</Checkbox>
        </div>
      )
    });
  }
  // 重新测试
  reTest = (tidx, cidx) => {
    this.state.data.toc[tidx].clazz[cidx].result = 2;
    () => showModal(tidx, cidx, 2);
  }
  btnName = (result) => {
    // console.log(result);
    switch (Number(result)) {
      case 1:
        return '可测试';
      case 2:
        return '重新测试';
      case 3:
        return '查看成绩';
      default:
        return '没有测试';
    }
  }
  render() {
    //判断用户是否已付费
    return (
      <div style={{ 'height': '100%', 'width': '100%' }}>
        <div>
          <Modal
            width={"800"}
            style={{ top: 20 }}
            visible={this.state.visible}
            footer={null}
            onCancel={this.onCancel}
          >
            <div>
              <h1 style={{ textAlign: 'center' }}>课时《{this.state.examTitle}》测试题</h1>
              <h3 style={{ fontWeight: 500, color: 'red', display: !this.state.wasTest ? 'none' : 'block', float: 'right' }}>{this.state.exam.score}分</h3>
              <span style={{ fontSize: 16, fontWeight: 600 }}>共有10道不定向选择题，可从中选择一个或多个答案（每题10分，总计100分）</span>
              {this.state.exam.questions.map((question, index) => {
                let options = this.genOpts(question, index);
                return (
                  <div style={{ paddingTop: 10 }} key={index}>
                    <span style={{ fontWeight: 500, fontSize: 15 }}>{index + 1}、{question.title} ( )</span>
                    {options}
                    <span>我的答案: {[...this.state.exam.questions[index].tempAnswers].map(n => String.fromCharCode(64 + parseInt(n)))}
                      <Icon type="check" style={{ display: this.state.wasTest && _.isEqual(this.state.exam.questions[index].answers, this.state.exam.questions[index].result) ? 'inlineBlock' : 'none' }} />
                      <Icon type="close" style={{ display: this.state.wasTest && !_.isEqual(this.state.exam.questions[index].answers, this.state.exam.questions[index].result) ? 'inlineBlock' : 'none' }} /></span>
                    <div className="clear"></div>
                  </div>
                )
              })
              }
              <Button type="primary" style={{ display: this.state.wasTest ? 'none' : 'block' }} onClick={this.SubmitExam}>交卷</Button>
            </div>
          </Modal>
        </div>
        <span id='courseId' style={{ 'display': 'none' }}>{this.state.data.courseId}</span>
        {this.genVideoPlayer()}
        <div className="play">
          {this.genMenu()}
          <div className="btn-group" style={{ 'width': '100%', 'minWidth': '265px', height: '5%', paddingLeft: '1px' }}>
            <button className="btnDefault" id="Content_sel" onClick={this.menuSel} style={{ 'width': '50%', 'fontSize': '15px', 'color': '#25AA1D' }}>目录</button>
            <button className="btnDefault" id="QA_sel" onClick={this.menuSel} style={{ 'width': '50%', 'fontSize': '15px', 'color': '#A0A0A0' }}>问答</button>
          </div>
          {this.genQAContent()}
          {this.genCourseContent()}
        </div>
        <div className="jumbotron" id="payModal" ref="payModal"
          style={{ 'position': 'absolute', 'zIndex': '9999', 'textAlign': 'center', 'left': '27%', 'top': '20%', 'width': '520px', 'display': 'none' }}>
          <h1>￥{Number(this.state.data.price).toFixed(2)}</h1>
          <p>请付费后学习本课程</p>
          <button className="btn btn-default btn-lg" onClick={this.onPay.bind(this)}>点击购买课程</button>
        </div>
      </div>
    );
  }
}

export default Player;