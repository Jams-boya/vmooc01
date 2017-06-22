import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import _ from 'lodash';
import { message, Button, Icon } from 'antd';
import React, { Component } from 'react';
import ReactDom from 'react-dom';
import MyNav from 'js/common/menu/MyNav.js';
import MyContainer from 'js/common/myContainer.js';
import MyTableList from 'js/common/myTableList.js';

let menuBar;
let personal;
$('#messageCenter').css("color","#21BA10");
let queryUrl = '/messageCenter?type=' + type;

$.ajax({
  url: '/menu/list',
  type: 'get',
  data: {
    name: "消息中心"
  },
  success: function (data) {
    menuBar = ReactDom.render(
      <MyNav
        nav={data} queryUrl={queryUrl}
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
  userId: guser._id,
  type: type,
}

let searchData = [{
  filter: filter,
  curPage   : 1,
  limit     : 10
}];

let page_url = "/getMyMessagesCount";
let data_url = "/getMyMessages";

let tableList = ReactDom.render(
  <MyContainer searchData={searchData} limit={10}>
    <MyTableList showHeader={false} showIcon={true} doPage={true} page_url={page_url} 
    loadModels={true} data_url={data_url} trHeight={50} onTrClick={onTrClick}>
      <th dataField="content" genIcon={genIcon} type="text" style={{height:'0px', width:'75%'}}>消息内容</th>
      <th dataField="createAt" type="text" style={{height:'0px', width:'25%'}}>时间</th>
    </MyTableList>
  </MyContainer>,
  document.querySelector('.tableContainer')
);

//生成图标
function genIcon(mrow) {
  let styleNew = {color: 'rgb(255, 140, 60)', marginRight: '15px', marginLeft: '15px'};
  let styleRead = {color: 'rgb(175, 191, 183)', marginRight: '15px', marginLeft: '15px'};
  if (mrow.state == 0) 
    return (<span className="glyphicon glyphicon-envelope" style={styleNew}></span>);
  else if (mrow.state == 1)
    return (<span className="glyphicon glyphicon-ok-sign" style={styleRead}></span>);
}

function onTrClick(mrow) {
  //标记信息为已读
  $.ajax({
    url: '/updateMessage',
    type: 'get',
    data: {
      mId: mrow._id
    },
    success: function(data) {
      console.log("success");
      location.reload(true);
    }
  })
  window.open(mrow.url);
}
