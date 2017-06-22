import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import './css/about.css';
import './css/banner.css';
import './css/student.css';
import './css/projectdetail.css';
import banner from './banner.js';
import { Popover, message, Button } from 'antd';
import projectdetail from './projectdetail.js';
import bootbox from 'bootbox';
import _ from 'lodash';
import React, { Component } from 'react';
import ReactDom from 'react-dom';
import UsersWidget from 'js/common/widget/UsersWidget';
import CoursesWidget from 'js/common/widget/CoursesWidget';
import ReplyWidget from 'js/common/widget/replyWidget';
import WaitPaymentWidget from 'js/common/widget/waitPaymentWidget';

import CourseIntro from './CourseIntro.js';
import CourseCatalog from './CourseCatalog.js';
import CourseSolve from './CourseSolve.js';


(() => {

  let purchase;
  let usersWidget;
  let coursesWidget;
  let courseIntro;
  let courseCatalog;
  let courseSolve;
  let courseClassify = $(".courseClassify").text();
  let courseId = $('#courseid').val();

  // 学员组件
  usersWidget = ReactDom.render(
    <UsersWidget
      url="/courselearners"
      id={courseId}
      />,
    document.querySelector('.usersContainer')
  );
  // 课程组件
  coursesWidget = ReactDom.render(
    <CoursesWidget
      url="/relevantcourse"
      classify={courseClassify}
      />,
    document.querySelector('.coursesContainer')
  );

  // 课程介绍
  courseIntro = ReactDom.render(
    <CourseIntro
      url="/courseintro"
      id={courseId}
      />,
    document.querySelector('.courseIntro')
  );

  // 课程目录
  courseCatalog = ReactDom.render(
    <CourseCatalog
      url="/coursecatalog"
      id={courseId}
      onPay={onPay}
      />,
    document.querySelector('.courseCatalog')
  );
  // 支付组件
  let payWidget = ReactDom.render(
    <WaitPaymentWidget data={courseCatalog.state.data[0]} orderType={"course"} />,
    document.querySelector('.buy-modal')
  );

  function onPay() {
    if (guser)
      $('.bancon').find('#myModal').modal("show");
    else {
      bootbox.alert({
        message: "请先登录!",
        size: 'small'
      });
      window.location.href = '/signin';
    }
  }

  $(".buybtn").click(e => {
    payWidget.componentWillReceiveProps({ orderType: 'course' });
    if (!guser) {
      message.warn('请先登录!');
      window.location.href = '/signin';
    }
    if (guser._id == courseIntro.state._id) {
      message.warn('不能购买自己发布的课程!');
      return false;
    }
    $.post('/findIsBuy', { userId: guser._id, courseId: courseId }, (results) => {
      if (results) {
        bootbox.confirm({
          message: "您已购买该课程，是否继续购买?",
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
          callback: function (result) {
            if (result) {
              $('.bancon').find('#myModal').modal("show");
            }
          }
        });
      } else {
        $('.bancon').find('#myModal').modal("show");
      }
    })
  })
  $('#classfy').attr('href', '/course/?classify=' + encodeURI(courseClassify));
  // 判断讲师的生活照有无图片
  if ($('#teclifePhoto')[0].attributes[0].nodeValue == "/undefined" || $('#teclifePhoto')[0].attributes[0].nodeValue == "/") {
    $("#teclifePhoto").attr('src', '/img/prot.png');
  }

  /**
   * 收藏功能
   * @author: wac
   */
  $.ajax({
    url: '/isEnshrine?userID=' + guser._id + '&courseID=' + courseId,
    type: 'get',
    async: false,
    success: (count) => {
      if (count > 0) {
        $('.collect').attr('src', '/images/course/redHeart.png');
        $('.collect').attr('heartFlag', '1');
        $('.cola').html('取消收藏');
      }
    }
  });
  $('.collect').click(() => {
    let heartFlag = $('.collect').attr('heartFlag');
    if (heartFlag == 0) {
      $.ajax({
        url: '/enshrine',
        type: 'post',
        data: {
          userID: guser._id,
          courseID: courseId,
        },
        async: false,
        success: (result) => {
          if (result) {
            message.success('收藏成功');
            $('.collect').attr('src', '/images/course/redHeart.png');
            $('.collect').attr('heartFlag', '1');
            $('.cola').html('取消收藏');
          }
        }
      });
    } else {
      $.ajax({
        url: '/delEnshrine?userID=' + guser._id + '&courseID=' + courseId,
        type: 'get',
        async: false,
        success: (result) => {
          if (result.ok == 1) {
            message.success('取消收藏成功');
            $('.collect').attr('src', '/images/course/heart.png');
            $('.collect').attr('heartFlag', '0');
            $('.cola').html('收藏');
          }
        }
      });
    }
  });
})();