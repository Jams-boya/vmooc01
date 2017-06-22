import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import _ from 'lodash';
import React, {Component} from 'react';
import ReactDom from 'react-dom';
import MyNav from 'js/common/menu/MyNav.js';
import MyContainer from 'js/common/myContainer.js';
import MyTableList from 'js/common/myTableList.js';
import SelectPublish from 'js/common/widget/SelectPublish.js';
import {message} from 'antd';
(() => {
	//生成菜单栏
	let menuBar;
	$.ajax({
	  url: '/menu/list',
	  type: 'get',
	  data: {
	    name: "讲师端"
	  },
	  success: function (data) {
	    let menuBar = ReactDom.render(
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
  
	//生成分页列表组件
	let filter = {
		teacherId : guser._id,
		state : {$ne: 5}
	}

	let searchData = [{
		filter: filter,
		curPage   : 1,
    	limit     : 5
	}];

	let page_url = "/getExpertCoursesCount";
	let data_url = "/getExpertCourses";

	//编辑操作
	function onEdit(mrow) {
		if (mrow.state == '视频转码中')
				return message.warn('视频正在转码中，请稍后操作！');

		if (mrow.isMicroCourse) {
			window.location.href = '/microCourse?courseId=' + mrow._id;
		} else {
			window.location.href = '/coursepublish?courseId=' + mrow._id;
		}
	}
	
	//删除操作
	function onDel(mrow) {
		$.ajax({
			url: '/delCourse',
	    	type: 'get',
	    	data: {
		      courseId: mrow._id
		    },
				success: function (data) {
					window.location.href = '/courseManage';
		    },
		    error: function(err) {
		    	alert("删除失败");
		    }
		})
	}
	// 链接到当前选择的课程
	function onImgClick(mrow) {
		if (mrow.state == "违规下架") {
			return false;
		} else { 
			window.location.href = '/course/' + mrow._id;
		}
	}

	let tableList = ReactDom.render(
		<MyContainer searchData={searchData} limit={5}>
	    <MyTableList showHeader={true} showIcon={true} editBtn={"编辑"} delBtn={"删除"} 
	    doPage={true} page_url={page_url} loadModels={true} data_url={data_url} onImgClick={onImgClick}
	    onEdit={onEdit} onDel={onDel} >
	    	<th dataField="cover" type="img" ></th>
				<th dataField="name" type="text" subField="price">课程信息</th>
				<th dataField="state" type="text" tips="soldOutReason" >状态</th>
				<th dataField="operation" type="btn" style={{textAlign: 'center'}} >操作</th>
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
		//判断选中筛选项的值 0=(process,建设中), 1=(sell,售卖中), 2=(offShelves,下架) 3=(违规待审核)
		if (e.target.id !="all")
			filter.state = e.target.id == "sell" ? 1 : e.target.id == "process" ? 0 :
										e.target.id == "waitRevise" ? 3 : 2;
		else 
			filter = {teacherId : guser._id};
		searchData[0].filter = filter;
		tableList.setState({
			searchData: searchData,
			curPage: 1,
			init: true,
		});
	});

	//判断是否要定位页签
	if (queryState) {
		$(".filter .btn").eq(queryState).click();
	}

	// 视频选择模态框
	 let selectPublish = ReactDom.render(
    <SelectPublish />,
    document.querySelector('.course-modal')
  );	
	// 选择发布课程的类型
	 $('#pCourse').click(e => {
		 $('.navigation').find('#myModal').modal("show");
	 });
})();