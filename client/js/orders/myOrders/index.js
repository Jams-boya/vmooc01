import _ from 'lodash';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import React, { Component } from 'react';
import ReactDom from 'react-dom';
import MyNav from 'js/common/menu/MyNav.js';
import MyTableList from 'js/common/myTableList.js';
import MyContainer from 'js/common/myContainer.js';
import WaitPaymentWidget from 'js/common/widget/waitPaymentWidget';
import bootbox from 'bootbox';
import { Popover, message, Button } from 'antd';
import StudyRecord from './studyRecord';
//生成菜单栏
let menuBar;
$('#HomePage').css("color", "#21BA10");
$.ajax({
  url: '/menu/list',
  type: 'get',
  data: {
    name: "学员端"
  },
  success: function (data) {
    let menuBar = ReactDom.render(
      <MyNav
        nav={data}
        queryUrl={'/myOrders'}
      />,
      document.querySelector('.pubmenu')
    );
  },
  error: function (xhr, status, err) {
    console.error(status, err.toString());
  }
});

//生成分页列表组件
let filter = {
  payerId: guser._id,
  $or: [
    { type: 'course' },
    { type: 'collection' }
  ]
}

let searchData = [{
  filter: filter,
  curPage: 1,
  limit: 5,
}];

let page_url = "/getMyOrdersCount";
let data_url = "/getMyOrders";

let tableList = ReactDom.render(
  <MyContainer searchData={searchData} limit={5}>
    <MyTableList showHeader={true} showIcon={true} doPage={true} page_url={page_url} loadModels={true}
      data_url={data_url} btnField={true} diffStateClick={diffStateClick} onImgClick={onImgClick}>
      <th dataField="cover" type="img" style={{ width: '20%' }} titleField="createAt" subField="promoCode"></th>
      <th dataField="itemName" type="text" titleField="sn" subField="itemAmount">订单信息</th>
      <th dataField="itemLicense" type="text">使用人数</th>
      <th dataField="usePeriod" type="text">使用时间</th>
      <th dataField="state" type="text">状态</th>
      <th dataField="operation" type="btn" style={{ width: '10%', textAlign: 'center' }}>操作</th>
    </MyTableList>
  </MyContainer>,
  document.querySelector('.tableContainer')
);


//根据订单状态绑定不同按钮事件
function diffStateClick(mrow, btn) {
  //支付事件
  if (btn.event == 'pay') {
    payOrder(mrow);

    //取消订单事件
  } else if (btn.event == "cancel") {
    cancelOrder(mrow);

    //赠送好友事件
  } else if (btn.event == "give") {
    giveCourse(mrow);
    //查看赠送记录
  } else if (btn.event == "log") {
    let _tr = '';
    $("#recordList .recordListBody").empty();
    if (mrow.licenseRecord) {
      mrow.licenseRecord.map(record => {
        _tr += '<tr>'
          + '<td>' + record.name + '</td>'
          + '<td>' + record.email + '</td>'
          + '<td>' + record.amount + '</td>'
          + '</tr>';
      });
    } else {
      _tr = '<tr>'
        + '<td></td>'
        + '<td>暂无</td>'
        + '<td></td>'
        + '</tr>';
    }
    $("#recordList .recordListBody").append(
      '<table class="table table-hover">'
      + '    <thead>'
      + '      <tr>'
      + '        <th>姓名</th>'
      + '        <th>邮箱</th>'
      + '        <th>数量</th>'
      + '      </tr>'
      + '    </thead>'
      + '    <tbody>'
      + _tr
      + '    </tbody>'
      + ' </table>'
    );
    $("#recordList").modal('show');
    //查看学习记录
  } else if (btn.event == "view") {

    //删除订单事件
  } else if (btn.event == "del") {
    bootbox.confirm({
      size: "small",
      message: "课程删除后不可恢复，确认要删除当前课程?",
      callback: function (result) {
        if (result) {
          $.ajax({
            url: '/delOrderById',
            type: 'get',
            data: {
              orderId: mrow._id
            },
            success: function (data) {
              window.location.href = '/myOrders';
            },
            error: function (err) {
              console.log("err", err);
            }
          });
        }
      }
    });
  } else if (btn.event == "record") {
    let studyRecord = ReactDom.render(
      <StudyRecord />,
      document.querySelector('.record-modal'));
      studyRecord.showModal(mrow);
  }
}

//支付订单
function payOrder(mrow) {
  let payWidget = ReactDom.render(
    <WaitPaymentWidget payInfo={mrow} data={mrow} />,
    document.querySelector('.buy-modal'));
  $("#myModal").modal('show');
}

//取消订单
function cancelOrder(mrow) {
  bootbox.confirm({
    size: "small",
    message: "是否取消当前订单?",
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
        $.ajax({
          url: '/cancelOrderById?orderId=' + mrow._id,
          type: 'get',
          success: function (data) {
            tableList.setState({});
          },
          error: function (err) {
            console.log("err", err);
          }
        });
      }
    }
  });
}

//赠送课程
function giveCourse(mrow) {
  if (mrow.itemLicense == mrow.licenseUsed) {
    bootbox.alert({
      size: "small",
      message: "赠送次数已经用完!",
      buttons: {
        ok: {
          label: '知道了',
          className: 'btn-success'
        },
      },
    });
  } else {
    let url = '/giveCourseEntry?orderId=' + mrow._id;
    window.location.href = (url);
  }
}
function onImgClick(mrow) {
  window.location.href = '/course/' + mrow.itemId;
}

