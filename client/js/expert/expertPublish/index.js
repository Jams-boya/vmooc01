import './message.css';
import _ from 'lodash';
import {Popover, message, Button } from 'antd';
import React, {Component} from 'react';
import ReactDom from 'react-dom';
import TocEditor from './TocEditor.js';
import MyNav from 'js/common/menu/MyNav.js';
import SHOWUPLOADER from 'js/common/webuploader/uploaderModel.js';
//wac
import 'js/courseManage/basicInfo/css/basicInfo.css';
import bootbox from 'bootbox';
import moment from 'moment';
import config from '../../../../server/config';

$('.basicInfoA').show();
$('.navdisc span').eq(0).children('div').css('background', '#3CCC86');
let basic = {};
let courseInfo;
//初始化下拉框数据
function initSelect() {
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

    },
    error: (err) => {
      console.log(err);
    }
  });
}
initSelect();
// 监听课程名称输入字数
document.getElementById('name').addEventListener('input', function () {
  if ($('#name').val().length < 50) {
    $('.nameLength').html($('#name').val().length);
  } else {
    $('.nameLength').html("50");
  }
});
// 监听费用是否是正确格式
document.getElementById('price').addEventListener('input', function () {
  if (isNaN($('#price').val())) {
    message.warn('请填写正确的价格');
    return false;
  } else if(Number($('#price').val()) > 10000){
    message.warn('费用不可超过10000元的限额');
    return false;
  } else if(Number($('#price').val()) <= 0){
    message.warn('费用必须大于0');
    return false;
  }
});
$('.imgDiv').click(function () {
  basic.cover = $(this).children('img').attr('src');
  $('.imgDiv').children('.imgbg,.selectImg').css('display', 'none');
  $(this).children('.imgbg,.selectImg').css('display', 'block');
});
$('.imgDiv').eq(0).click();
$('.next1').click(function () {
  let name = $('#name').val();
  let classify = $('#classify').val();
  let direction = $('#direction').val();
  let price = $('#price').val();
  let usePeriod = 12;
  if (!name) {
    message.warn('请填写课程名!');
    return false;
  } else if (!price) {
    message.warn('请填写价格!');
    return false;
    } else if (Number(price) > 10000) {
        message.warn('费用不可超过10000元的限额!');
        return false;
      } else if (isNaN(price)) {
          message.warn('请填写正确的价格!');
          return false;
        } else if (Number(price) <= 0) {
            message.warn('请填写大于0元的价格!');
            return false;
        } else {
          basic.name = name;
          basic.classify = classify;
          basic.direction = direction;
          basic.price = price;
          basic.usePeriod = usePeriod;
          //下一步
          $('.navdisc span').eq(1).children('div').css('background', '#3CCC86');
          $('.basic').hide();
          $('.basicInfoB').show();
      }
});

document.getElementById('description').addEventListener('input', function () {
  $('.desLength').html($('#description').val().length);
});

$('#description').attr('placeholder', `填写本课程的简单描述，方便学员快速了解学习本课程的意义`);
$('#suitableCrowd').attr('placeholder', `填写课程的使用人群是哪些
例如：有一定设备检验工作经验，想通过提升实践能力，进入外资企业就职的检验员`);
$('#preliminary').attr('placeholder', `填写学习该课程需要的能力基础
例如：
了解设备的原理
有检验员实践工作经验`);
$('#target').attr('placeholder', `填写学员通过学习该课程，可以掌握什么知识/技能
例如：通过本课程的学习，可以掌握监理基础知识`);

// 点击第二页面的上一步
$('.prov').click(function () {
  $('.navdisc span').eq(1).children('div').css('background', '#DDDEDF');
});
// 点击第二页面的下一步
$('.next2').click(function () {
  let description = $('#description').val();
  let suitableCrowd = $('#suitableCrowd').val();
  let preliminary = $('#preliminary').val();
  let target = $('#target').val();
  if (description != '' && suitableCrowd != '' && preliminary != '' && target != '') {
    basic.description = description;
    basic.suitableCrowd = suitableCrowd;
    basic.preliminary = preliminary;
    basic.target = target;
    //下一步
    $('.navdisc span').eq(2).children('div').css('background', '#3CCC86');
    $('.basic').hide();
    $('.basicInfoC').show();
  } else {
    message.warn('请完整填写信息');
  }
});
$('.prov').click(function () {
  $('.basic').hide();
  $('.basicInfoA').show();
});
// 点击第三页面的上一步
$('.backclazz').click(function () { 
    $('.navdisc span').eq(2).children('div').css('background', '#DDDEDF');
})
//课程发布
function uploadCourse(toc, uploadFiles, isDraft, createAt, teacherName) {
  $.post("/course/toc/saveToc", {...toc, isDraft, createAt, teacherName}, (result, err) => {
      console.log('=====', result);
      if (result) {
      uploadFiles.map(file => {
        file.courseId = result;
      });
      console.log('----', uploadFiles);
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
      // if (toc.state == 1)
        // window.location.href = '/course?from=expertPublish';
      // else
        window.location.href = '/courseManage';
    }
  });
}

let menuBar;
let tocEditor;
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

// 章节细节
tocEditor = ReactDom.render(
  <TocEditor
    teacherId={teacherId}
    uploadClick={uploadClick}
  />,
  document.querySelector('.tocbody')
)

function setToc(toc, uploadFiles) {
  tocEditor.setState({toc: toc, uploadFiles: uploadFiles});
}

//生成上传课程模态框
let uploader = new SHOWUPLOADER('上传视频');
function uploadClick(toc, uploadFiles, cidx, index) {
  uploader.show(toc, uploadFiles, cidx, index, setToc);
}

//编辑时加载课程数据
if (courseId) {
  $.ajax({
    url: '/getCourseById?courseId=' + courseId,
    type: 'get',
    async: false,
    success: (course) => {
      courseInfo = course;
      console.log(course);
      //课程名称
      $("#name").val(course.name);
      //名称长度
      $(".nameLength")[0].innerHTML = course.name.length;
      //下拉框
      $("#classify option[value='"+course.classify+"']").attr("selected",true);
      $("#direction option[value='" + course.direction + "']").attr("selected", true);
      // 课程封面
      let imgcourse = course.cover;
      let imgLength = $('.imgbg').length;
      let imgNumber = imgcourse.substring(imgcourse.length - 5, imgcourse.length - 4);
      $('.imgDiv').eq(parseInt(imgNumber) - 1).click();
      //课程价格
      $("#price").val(course.price);
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
      tocEditor.setState({toc});
    },
    error: (err) => {
      console.log(err);
    }
  });
}

if (location.href == 'localhost:7070/coursepublish') {
  $('#accordion li:first-child .submenu li:first-child a').css("background", "red");
}

/** 发布 */
$('[option="addcourse"]').on("click", (event) => {
  const uploadType = $(event.target).attr("uploadType");
  let isDraft = uploadType === "1" ? true : false;//是否是草稿
  let toc = {};//章节信息
  let flag;
  let videoFiles = [];
  let changeState = true;
  if (tocEditor.state) {
    toc = tocEditor.state;//章节信息
    //判断信息填写是否完整(视频上传还未判断)
    if (toc.toc.length == 0) {
      flag = "请填写完整章节信息";
      bootbox.alert(flag);
      return;
    }

    toc.toc.map((chapter, tIdx) => {
      if (chapter.chapter == "" || chapter.clazz.length == 0) {
        flag = "请填写完整章节信息";
        return;
      }
      console.log( chapter.clazz);
      chapter.clazz.map((clazz, cIdx) => {
        if (clazz.title == "") {
          flag = "请填写完整课时信息";
          return;
        } else if (!isDraft && (!clazz.rawPath || clazz.rawPath == "")) {
          if (!flag)
            flag = "请上传第" + (tIdx+1) + "章 第" + (cIdx+1) + "课的视频";
          return;
        }
      });

    });

    if (flag) {
      bootbox.alert(flag);
      return;
    }

    toc.toc.map((chapter, tIdx) => {
      chapter.clazz.map((clazz, cIdx) => {
        if (!clazz.transCoding)
          videoFiles.push(clazz.rawPath);
        else if (tocEditor.state.uploadFiles.length > 0 || clazz.transCoding)
          flag = "newVideo";
      });
    });

    basic.toc = toc.toc;
    if (courseId) {
      basic._id = courseId;
    }

    basic.teacherId = guser._id;
    basic.teacherName = guser.name;
    //判断状态(转码中编辑时不改变) -1=视频转码中 0=建设中 1=发售中 2=违规下 3=违规下架待审核

    if (isDraft) {
      basic.state = 0;
    } else if (uploadType === "2") {
      //状态为下架时提交审批
      basic.state = 3;
    } else if (flag == "newVideo") {
      basic.state = -1;
    } else {
      basic.state = 1;
    }

    let createAt = new Date();
    let teacherName = guser.name;
    uploadCourse(basic, tocEditor.state.uploadFiles, isDraft, createAt, teacherName);

  }
});

$('.backclazz').click(function () {
  $('.basic').hide();
  $('.basicInfoB').show();
});

$("[data-toggle='tooltip']").tooltip(); 

