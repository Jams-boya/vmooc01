import _ from 'lodash';
import React, {Component} from 'react';
import ReactDom from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import MyNav from 'js/common/menu/MyNav.js';
import MyContainer from 'js/common/myContainer.js';
import MyTableList from 'js/common/myTableList.js';

//生成菜单栏123
let menuBar;
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
        queryUrl={'/myCourses'}
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
	userId : guser._id,
	courseFrom: 0,
}
let searchData = [{
	filter: filter,
	curPage   : 1,
   limit     : 5
}];
//开始学习按钮事件
	function onStudy(mrow) {
		window.location.href = '/player/' + mrow.courseId;
	}

let page_url = "/getMyCoursesCount";
let data_url = "/getMyCourses";

//搜寻新增课程生成提示小红点
$.ajax({
	url: '/newGiveCourse',
	type: 'get',
	async: false,
	data: {
		filter: {userId : guser._id, new: true, courseFrom: 1},
	},
	success: function(data) {
		if (data.length > 0) {
			$('#given').append('&nbsp;<span style="background-color:red;" class="badge">'+ data.length +'</span>');
		}
	}
});
function onImgClick(mrow) {
	  window.location.href = '/player/' + mrow.courseId;
}

let tableList = ReactDom.render(
	<MyContainer searchData={searchData} limit={5}>
	  <MyTableList showHeader={false} showIcon={true} doPage={true} page_url={page_url}
			loadModels={true} data_url={data_url} onImgClick={onImgClick} >
	    <th dataField="cover" type="img" style={{height:'0px', width:'10%'}}></th>
			<th dataField="name" type="text" progressField="studyspeed" style={{height:'0px', width:'90%'}}></th>
	  </MyTableList>
	</MyContainer>,
	document.querySelector('.tableContainer')
);

//筛选按钮点击事件
$(".filter .btn").click(e => {
	//点击样式变化
	let flag = '<div id="proc_bar" style="background: linear-gradient(to right, red , yellow , #27AE24); height: 3px;"></div>';
	$("#proc_bar").remove();
	$(e.target).parent().append(flag);
	//判断选中筛选项的值 0=(我购买的), 1=(别人赠送)
	if (e.target.id !="all") {
		filter.courseFrom = e.target.id == "bought" ? 0 : 1;
	} else {
		filter = {
			userId : guser._id
		}
	}
	searchData[0].filter = filter;
	tableList.setState({
		searchData: searchData,
		init: true,
		curPage: 1,
	});
});

if (isFrom) {
	$(".filter .btn").eq(isFrom).click();
}

