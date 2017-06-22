import './courseManage.css';
import _ from 'lodash';
import React, { Component } from 'react';
import ReactDom from 'react-dom';
import MyContainer from 'js/common/myContainer.js';
import MyTableList from 'js/common/myTableList.js';
import moment from 'moment';
import RC_MyCalendar from 'js/common/myform/mycalendar.js';

(() => {
  let start = ReactDom.render(
    <RC_MyCalendar />,
    document.querySelector('.start')
  );
  let end = ReactDom.render(
    <RC_MyCalendar />,
    document.querySelector('.end')
  );
  let selCondition = {};
  let selOption = () => {
    $.ajax({
      url: '/cmList',
      type: 'get',
      async: false,
      success: (data) => {
        if (data.length > 0) {
          data[0].values.map((val, idx) => {
            $('.courseType').append('<option value=' + val.name + '>' + val.name + '</option>');
          });
          data[1].values.map((val, idx) => {
            $('.direction').append('<option value=' + val.name + '>' + val.name + '</option>');
          });
        }
      },
      error: (err) => {
        console.log('cmOption: ', err);
      }
    });
  }
  selOption();
  let conditions = () => {
    let selCondition = {};
    if ($('.courseType').val() != '全部') {
      selCondition.classify = $('.courseType').val();
    }
    if ($('.direction').val() != '全部') {
      selCondition.direction = $('.direction').val();
    }
    if ($('.courseState').val() != '全部') {
      selCondition.state = parseInt($('.courseState').val());
    }
    if ($('.domain').val() != '全部') { 
      selCondition.domain = $('.domain').val();
    }
    let createAt = {};
    let startTime = start.state.value._d;
    let endTime = end.state.value._d;
    if (!startTime && !endTime) {
      //nothing
    } else {
      if (startTime && endTime) {
        if (startTime <= endTime) {
          createAt.$gte = startTime;
          createAt.$lte = endTime;
        } else {
          alert('起始时间不能大于结束时间!');
          createAt = {};
        }
      } else {
        if (startTime) {
          createAt.$gte = startTime;
        }
        if (endTime) {
          createAt.$lte = endTime;
        }
      }
      selCondition.createAt = createAt;
    }
    return selCondition;
  }

  function onEdit(mrow) {
    window.open('/course/' + mrow._id);
  }

  function soldOut(mrow) {
    //违规下架点击事件
    if (mrow.state == 1) {
      $('.messagebox').show();
      $('.courseId').html(mrow._id);
    }
    if (mrow.state == 3) {
      if (confirm('确定审核通过?')) {
        $.ajax({
          url: '/audit',
          type: 'post',
          data: {
            courseId: mrow._id
          },
          success: (result) => {
            if (result.ok) {
              alert('审核通过成功!');
              selectCourse(selCondition);
            }
          },
          error: (err) => {
            console.log('audit: ', err);
          }
        });
      }
    }
  }
  let searchData = [{
    condition: conditions,
    curPage: 1,
    limit: 5
  }];
  let thStyle = {
    'textAlign': 'left'
  }

  let limit = 5;
  let page_url = "/cmSelectCount";
  let data_url = "/cmSelect";

  let tableList = ReactDom.render(
    <MyContainer searchData={searchData} limit={limit}>
      <MyTableList showHeader={true} showIcon={true} editBtn={"查看"} onEdit={onEdit} myBtn={"delStr"} myClick={soldOut} doPage={true} page_url={page_url} loadModels={true} data_url={data_url}> 
          <th dataField="cover" type="img" style={thStyle}>课程封面</th>
          <th dataField="name" type="text" style={thStyle}>课程名称</th>
          <th dataField="classify" type="text" style={thStyle}>课程类型</th>
          <th dataField="status" type="text" style={thStyle}>课程状态</th>
          <th dataField="teacherName" type="text" style={thStyle}>上传者</th>
          <th dataField="domain" type="text" style={thStyle}>来源</th>
          <th dataField="operation" type="btn" style={thStyle}>操作</th>
      </MyTableList>
    </MyContainer>,
    document.querySelector('.courseList')
  );

  let selectCourse = (condition) => {
    searchData = [{
      condition,
      curPage: 1,
      limit: 5
    }];
    tableList.setState({ searchData: searchData, curPage: 1, init: true });
    console.log("state", tableList.state);
  }
  //筛选
  $('.selbtn').click(() => {
    selCondition = {};
    selCondition = conditions();
    selectCourse(selCondition);
  });
  //查询
  $('.shbtn').click(() => {
    selCondition = {};
    if ($('.search').val() != '') {
      selCondition.$or = [{ name: $('.search').val() }, { teacherName: $('.search').val() }];
    }
    selectCourse(selCondition);
  });

  $('.closeMs').click(() => {
    $('.soldOutCon').val('');
    $('.courseId').html('');
    $('.messagebox').hide();
  });
  //soldOutReason
  $('.soldOut').click(() => {

    let soldOutReason = $('.soldOutCon').val();
    if (soldOutReason != '') {
      if (confirm('确定违规下架?')) {
        let soldOut = {};
        soldOut._id = $('.courseId').html();
        soldOut.soldOutReason = soldOutReason;
        $.ajax({
          url: '/soldOut',
          type: 'get',
          data: {
            soldOut
          },
          success: (result) => {
            if (result && result.state && result.state == 2) {
              $('.closeMs').click();
              selectCourse(selCondition);
            }
          },
          error: (err) => {
            console.log('soldOut: ', err);
          }
        });
      }
    }
  });
})()