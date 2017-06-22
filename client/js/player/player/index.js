import 'bootstrap/dist/js/bootstrap.min.js';
import '../../common/video/video-js.min.css';
import './css/buttons.css';
import './css/play.css';
import bootbox from 'bootbox';
import videojs from 'video.js';
import ReactDom from 'react-dom';
import WaitPaymentWidget from 'js/common/widget/waitPaymentWidget';
import React, { Component } from 'react';
import { Popover, message, Button, Icon } from 'antd';
import Player from './player.js';

let result = null;
let payCheck = false;
let myCourse = null;
let width = (document.body.clientWidth) * 0.8;
let qaHeight = document.body.clientHeight * 0.78 - 220;
let cataHeight = document.body.clientHeight * 0.78 + 20;
let playerSize = {
  width: width + 'px',
  height: (document.body.clientHeight * 0.9) + 'px'
}

//获取课程详细信息
$.ajax({
  url: '/courseDetails',
  type: 'get',
  async: false,
  data: {
    courseId
  },
  success: (data) => {
    result = data;
  },
  error: (err) => console.log('err', err)
});
//获取我的课程详细信息
$.ajax({
  url: '/getMyCourseByInfo',
  type: 'get',
  async: false,
  data: {
    courseId: result._id,
  },
  success: (data) => {
    if (data) {
      // console.log('myCourse', data);
      myCourse = data;
    }
  }
});
// console.log(result.toc[0].clazz[0].isHasExam);
$(".head,.nav,.foot").hide();
//验证课程是否已购买
$.ajax({
  url: '/courseCheck',
  type: 'get',
  async: false,
  data: {
    courseId
  },
  success: (count) => {
    if (count >= 1)
      payCheck = true;
  },
  error: (err) => {
    console.log('error', err);
  }
});

//支付组件
let payWidget = ReactDom.render(
  <WaitPaymentWidget data={result} orderType={"course"} />,
  document.querySelector('.buy-modal')
);

//判断是否是讲师
if (result.teacherId == guser._id) {
  payCheck = true;
}

//播放页面组件
let player = ReactDom.render(
  <Player payCheck={payCheck} data={result} myCourse={myCourse} quiz={quiz}
    playerSize={playerSize} qaHeight={qaHeight} cataHeight={cataHeight} cidx={cidx} index={index} />,
  document.querySelector('#player_container')
);

//切换课时按钮
$(".toggle").click((e) => {
  let id = _.findIndex(player.state.courses, function (o) { return o.cidx == player.state.chapter && o.index == player.state.idx; });
  if (e.target.id == 'prev') {
    if (id == 0)
      return;
    player.toggleCourse(player.state.courses[id - 1]);
  } else {
    if (id >= player.state.courses.length - 1)
      return;
    player.toggleCourse(player.state.courses[id + 1]);
  }
});

//付费提问事件
function quiz(qa, teacher, e) {
  if (guser._id == teacher.userId) {
    message.warn('不能向自己提问！');
    bootbox.alert({ message: "不能向自己提问！", size: 'small' });
    return;
  }
  if (!payCheck) {
    bootbox.alert({ message: "请购买课程后再提问！", size: 'small' });
    return;
  }
  payWidget.componentWillReceiveProps({ orderType: 'qa', totalPrice: teacher.money, qaTeacher: teacher, data: result });

  $("#myModal").modal('show');
}



window.onbeforeunload = function () {
  if (myCourse) {
    $.ajax({
      url: '/updateStudySpeed',
      type: 'get',
      data: {
        courseId: result._id,
        cidx: player.state.chapter,
        index: player.state.idx,
        playTime: Math.ceil(player.state.video.currentTime()),
        progress: false,
      },
      success: function (result) {
      },
      error: function (err) {
        console.log('err', err);
      }
    });
  }
}




