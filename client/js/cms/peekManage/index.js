import _ from 'lodash';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import React, { Component } from 'react';
import ReactDom from 'react-dom';
import MyNav from 'js/common/menu/MyNav.js';
import MyContainer from 'js/common/myContainer.js';
import MyTableList from 'js/common/myTableList.js';
import WaitPaymentWidget from 'js/common/widget/waitPaymentWidget';

//生成分页列表组件
let filter = {
  type: "peek",
}

//获取订单统计数据
$.ajax({
  url: '/orderStatics?type=peek',
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

let tableList = ReactDom.render(
  <MyContainer searchData={searchData} limit={10}>
    <MyTableList showHeader={false} showIcon={true} doPage={true} page_url={page_url}
      loadModels={true} data_url={data_url} trHeight={50}>
      <th dataField="sn" type="text">订单号</th>
      <th dataField="itemName" type="text">偷看标题 </th>
      <th subField="price" type="text">金额</th>
      <th subField="payerName" type="text">偷看者</th>
      <th dataField="domain" type="text">来源</th>
      <th subField="createTime" type="text">下单时间</th>
      <th subField="state" type="text">订单状态</th>
      <th type="text">操作</th>
    </MyTableList>
  </MyContainer>,
  document.querySelector('.tableContainer')
);

//查询、筛选事件
$("#searchBtn, #filterBtn").click(function () {
  filter = {
    type: "peek",
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
