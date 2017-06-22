import _ from 'lodash';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import React, { Component } from 'react';
import ReactDom from 'react-dom';
import MyNav from 'js/common/menu/MyNav.js';
import MyContainer from 'js/common/myContainer.js';
import MyTableList from 'js/common/myTableList.js';
import WaitPaymentWidget from 'js/common/widget/waitPaymentWidget';
import MyCalendar from 'js/common/myform/mycalendar.js';
import { message } from 'antd';

//生成分页列表组件
let filter = {
  type: "course",
}
//获取订单统计数据
$.ajax({
  url: '/orderStatics?type=course',
  type: 'get',
  success: function (statics) {
    $("#total")[0].innerHTML = statics.total;
    $("#monthTotal")[0].innerHTML = statics.monthTotal;
    $("#weekTotal")[0].innerHTML = statics.weekTotal;
    $("#amount")[0].innerHTML = "￥" + Number(statics.amount).toFixed(2);
    $("#monthAmount")[0].innerHTML = "￥" + Number(statics.monthAmount).toFixed(2);
    $("#weekAmount")[0].innerHTML = "￥" + Number(statics.weekAmount).toFixed(2);
  },
  error: function (xhr, status, err) {
    console.error(status, err.toString());
  }
});

let searchData = [{
  filter: filter,
  curPage: 1,
  limit: 10
}];
let page_url = "/getExpertOrdersCount";
let data_url = "/getExpertOrders";

function onTextClick(mrow) { 
  message.success(mrow.promoCode);
}
let tableList = ReactDom.render(
  <MyContainer searchData={searchData} limit={10}>
    <MyTableList showHeader={false} showIcon={true} doPage={true} page_url={page_url}
      loadModels={true} data_url={data_url} trHeight={50} onTextClick={onTextClick}>
      <th dataField="sn" type="text">订单号</th>
      <th dataField="itemName" type="text">课程名称 </th>
      <th subField="price" type="text">原价</th>
      <th subField="actualPay" type="text">实付</th>
      <th dataField="discount" type="text">折扣</th>
      <th dataField="itemLicense" type="text">学习人数</th>
      <th dataField="payerName" type="text">买家昵称</th>
      <th dataField="domain" type="text">来源</th>
      <th dataField="createTime" type="text">下单时间</th>
      <th dataField="state" type="text">订单状态</th>
    </MyTableList>
  </MyContainer>,
  document.querySelector('.tableContainer')
);

//查询、筛选事件
$("#searchBtn, #filterBtn").click(function () {
  filter = {
    type: "course",
  }

  let classify = $("#classify").val();
  let direction = $("#direction").val();
  let state = $("#state").val();
  let domain = $("#domain").val();
  let startTime = $("#startTime").val() != "" ? new Date($("#startTime").val()).getTime() : 0;
  let endTime = $("#endTime").val() != "" ? new Date($("#endTime").val()).getTime() : new Date().getTime();
  let searchContent = $("#searchContent").val();

  if (state !== "全部")
    filter.state = state;
  
  if (domain !== '全部')
    filter.domain = domain;

  if (searchContent !== "") {
    filter.$or = [
      { itemName: searchContent },
      { sn: searchContent },
      { payerName: searchContent }
    ];
  }
  if (classify !== '全部')
    filter["info.classify"] = classify;

  if (direction !== '全部')
    filter["info.direction"] = direction;


  filter.createAt = {
    $gte: startTime,
    $lte: endTime
  }

  searchData[0].filter = filter;

  tableList.setState({
    searchData: searchData,
    curPage: 1,
    init: true,
  });
});