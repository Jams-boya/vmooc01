import _ from 'lodash';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import React, {Component} from 'react';
import ReactDom from 'react-dom';
import MyNav from 'js/common/menu/MyNav.js';
import MyContainer from 'js/common/myContainer.js';
import MyTableList from 'js/common/myTableList.js';
import bootbox from 'bootbox';

/*
解决思路：
利用guser._Id查询 -----> 在question表通过guser._Id寻找askerId、requiredAnswerId得到question._id------> 在answer表通过question._id寻找questionId得到answerId------> 在peeker表通过answer._id寻找answerId得到userId --------> 通过userapp.getPersonInfo得到偷看者信息
*/
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
        queryUrl={'/peekMeEntry'}
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
}

let searchData = [{
	filter: filter,
	curPage   : 1,
  limit     : 5
}];

let thStyle = {
  'textAlign': 'left'
}

let page_url = "/getPeekMeCount";
let data_url = "/getPeekMe";

let tableList = ReactDom.render(
  <MyContainer searchData={searchData} limit={5}>
    <MyTableList showHeader={true} showIcon={true} doPage={true} page_url={page_url} loadModels={true}
      data_url={data_url} onTrClick={onTrClick}>
      <th titleField="createAt" dataField="answererAvatar" type="icon" subField="answererName" style={thStyle}>问题</th>
      <th titleField="sn" dataField="itemName" subField="price" type="text" style={thStyle}></th>
      <th dataField="peekCount" type="text" style={thStyle}>偷看数</th>
    </MyTableList>
  </MyContainer>,
  document.querySelector('.tableContainer')
);

//点击问题跳转事件
function onTrClick(mrow) {
  window.location.href = '/expertqa/' + mrow.questionId + '/' + mrow.answererId;
}