import './microCourse.css';
import _ from 'lodash';
import React, { Component } from 'react';
import eventproxy  from 'eventproxy';
import ReactDom from 'react-dom';
import {Popover, message, Button, Icon} from 'antd';
import MyNav from 'js/common/menu/MyNav.js';
import AddMicroCourse from './AddMicroCourse.js';
import SHOWUPLOADER from 'js/common/webuploader/uploaderModel.js';
import config from '../../../../server/config';
const ep = new eventproxy();

//发布微课程
function uploadCourse(microCourse, uploadFiles, createAt, isDraft, isMicroCourse) {
  isMicroCourse = true;
  $.post("/course/micro/saveMicro", {...microCourse, isDraft, createAt, isMicroCourse}, (result) => {
    if (result) {
      uploadFiles.map(file => {
        file.courseId = result;
      });
      if (uploadFiles.length != 0) {
        //执行队列中的视频转码
        //server 'http://116.193.48.186:8007/videoTranscode'
        //test 'http://localhost:3000/videoTranscode'
        $.ajax({
            url: `${config.videoUrl}/videoTranscode`,
            type: 'get',
            data: {
              files: uploadFiles,
            },
            success: function(data) {
              console.log(data);
            },
            error: function(err) {
              console.log(err);
            },
        });
      }
      // if (microCourse.state == 1)
        // window.location.href = '/course?from=expertPublish';
      // else
        window.location.href = '/courseManage';
    }
  });
  }

let addMicroCourse;
let menuBar;
$.ajax({
  url: '/menu/list',
  type: 'get',
  data: {
    name: "讲师端"
  },
  success: function (data) {
    menuBar = ReactDom.render(
      <MyNav
        nav={data}
        queryUrl={'/courseManage'}
      />,
      document.querySelector('.pubmenu')
    );
  },
  error: function (xhr, status, err) {
    console.error(status, err.toString());
  }
});


//生成上传课程模态框
let uploader = new SHOWUPLOADER('上传视频');

  addMicroCourse = ReactDom.render(
    <AddMicroCourse
      teacherId={guser._id}
      teacherName={guser.name}
      uploadCourse={uploadCourse}
      uploadClick={uploadClick}
    />,
    document.querySelector('.conbody')
  )

$('.imgDiv').eq(0).click();


//编辑时加载课程数据
if (courseId) {
  $.ajax({
    url: '/getCourseById?courseId=' + courseId,
    type: 'get',
    async: false,
    success: (course) => {
      //课程名称
      $("#name").val(course.name);
      //名称长度
      $(".nameLength")[0].innerHTML = course.name.length;
      //下拉框
      $("#classify option[value='"+course.classify+"']").attr("selected",true);
      $("#direction option[value='" + course.direction + "']").attr("selected", true);
      $("#usePeriod option[value='" + course.usePeriod + "']").attr("selected", true);
      //课程价格
      $("#price").val(course.price);
      // 课程上传按钮
      if(course.toc.length == 1) {
        $('#circle').css("border-color", "#59c890");
        $('#uptext').html(" 已 上 传");
      }
      // 课程封面
      let imgcourse = course.cover;
      let imgLength = $('.imgbg').length;
      let imgNumber = imgcourse.substring(imgcourse.length - 5, imgcourse.length - 4);
      $('.imgDiv').eq(parseInt(imgNumber) - 1).click();

      //课程简介
      $("#description").val(course.description);
      //课程简介长度
      $(".desLength")[0].innerHTML = course.description.length;
      //课程适用人群
      $("#suitableCrowd").val(course.suitableCrowd);
      //课程基础能力
      $("#preliminary").val(course.preliminary);
      //授课目标
      $("#target").val(course.target);
      //章节信息
      let toc = course.toc;
      addMicroCourse.setState({ toc: toc, microCourse: course, });
    },
    error: (err) => {
      console.log(err);
    }
  });
}



function uploadClick(toc, uploadFiles, cidx, index) {
  uploader.show(toc, uploadFiles, cidx, index, setToc);
}
//更新上传文件状态
function setToc(toc, uploadFiles) {
  addMicroCourse.setState({toc: toc, uploadFiles: uploadFiles});
}

$('#back').click(function () {
  $('#two').hide();
  $('#one').show();
  $('#disc2').css('background', '#DDDEDF');
  $('#line2').css('background', '#DDDEDF');
});
