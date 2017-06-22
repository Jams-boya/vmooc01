import _ from 'lodash';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import React, {Component} from 'react';
import ReactDom from 'react-dom';
import MyNav from 'js/common/menu/MyNav.js';
import MyContainer from 'js/common/myContainer.js';
import MyTableList from 'js/common/myTableList.js';
import bootbox from 'bootbox';

//生成菜单栏123
let menuBar;
$('#HomePage').css("color","#21BA10");
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
        queryUrl={'/myQAEntry'}
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
	askerId : guser._id,
  $or: [{state: 1}, {state: 2}, {state: 3}]
}
let searchData = [{
	filter: filter,
	curPage   : 1,
  limit     : 5
}];

let thStyle = {
  'textAlign': 'left'
}

let page_url = "/getMyQACount";
let data_url = "/getMyQA";

let tableList = ReactDom.render(
  <MyContainer searchData={searchData} limit={5}>
    <MyTableList showHeader={false} showIcon={true} doPage={true} page_url={page_url} 
    loadModels={true} data_url={data_url} onTrClick={onTrClick}>
      <th titleField="createAt" dataField="requiredAnswerAvatar" type="icon" subField="requiredAnswerName" style={thStyle}>问题</th>
      <th titleField="ordersCode" dataField="title" subField="price" type="text" style={thStyle}></th>
      <th dataField="status" type="text" style={thStyle}>状态</th>
    </MyTableList>
  </MyContainer>,
  document.querySelector('.tableContainer')
);

function diffStateClick(mrow, btn) {
  //支付事件
  if (btn.event == 'del') {
    delQA(mrow);
  }
}

//删除当前问答
function delQA(mrow) {
  bootbox.confirm({ 
      size: "small",
      message: "问题删除后不可恢复，确认要删除当前课程?", 
      callback: function(result){ 
        if (result) {
          $.ajax({
            url: '/delAnswer',
            type: 'post',
            data: {
              qid: mrow._id,
            },
            success: function(data) {
              bootbox.alert("删除成功");
              window.location.href = '/myQAEntry';
            },
            error: function(err) {
              console.log('err', err);
            },
          });
        }
      }
  });
}

//筛选按钮点击事件
$(".filter .btn").click(e => {
  //点击样式变化
  
  let flag = '<div id="proc_bar" style="background: linear-gradient(to right, red , yellow , #27AE24); height: 3px;"></div>';
  $("#proc_bar").remove();
  $(e.target).parent().append(flag);
  //判断选中筛选项的值 0=(我购买的), 1=(别人赠送)
  if (e.target.id == "all") {
    filter = {
      askerId : guser._id,
      $or: [{state: 1}, {state: 2}, {state: 3}]
    }
  } else if (e.target.id == "wait") {
    filter = {
      askerId : guser._id,
      state: 1
    }
  } else if (e.target.id == "answered") {
    filter = {
      askerId : guser._id,
      state: 2
    }
  } 
  searchData[0].filter = filter;
  tableList.setState({
    searchData: searchData,
    init: true,
    curPage: 1,
  });
});

//点击问题跳转事件
function onTrClick(mrow) {
  if (mrow.state == 3)
    return;
  window.location.href = '/expertqa/' + mrow._id + '/' + mrow.requiredAnswerId;
}