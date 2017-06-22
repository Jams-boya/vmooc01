import './css/answerManage.css';
import _ from 'lodash';
import React, {Component} from 'react';
import ReactDom from 'react-dom';
import MyNav from 'js/common/menu/MyNav.js';
import MyContainer from 'js/common/myContainer.js';
import MyTableList from 'js/common/myTableList.js'

(() => {
	$('.menuspan').children('a').css('color', '#000000');
	$('#HomePage').css('color', '#21BA10');
  //生成菜单栏
	let menuBar;
  $.ajax({
    url: '/menu/list',
    type: 'get',
    data: {
      name: "讲师端"
    },
    success: function (data) {
			console.log('data', data);
      let menuBar = ReactDom.render(
        <MyNav
          nav={data} queryUrl={'/answerManage'}
					/>,
        document.querySelector('.pubmenu')
      );
    },
    error: function (xhr, status, err) {
      console.error(status, err.toString());
    }
	});


	let filter = {};
	let expertId = $('.expertId').html();
	filter.requiredAnswerId = expertId;
	let searchData = [{
		state: filter,
		curPage: 1,
		limit: 5
		}];
	let limit = 5;
	let thStyle = {
		'textAlign': 'left'
	}

	let page_url = "/expertAnswerCount";
	let data_url = "/expertAnswer";

	function operation(mrow) {
		if (mrow.state == 1) {
			window.open('/expertqa/' + mrow._id + '/' + mrow.requiredAnswerId);
		}
		// if (mrow.state == 2 || mrow.state == 3) {
		// 	if (confirm('确定删除?')) {
		// 		$.ajax({
		// 			url: '/delAnswer',
		// 			type: 'post',
		// 			data: {
		// 				qid: mrow._id
		// 			},
		// 			success: (data) => {
		// 				if (data.ok)
		// 					alert('删除成功!');
		// 				tableList.setState({ searchData });
		// 			},
		// 			error: (err) => {
		// 				console.log('delAnswer: ', err);
		// 			}

		// 		});
		// 	}
		// }
	}
	let tableList = ReactDom.render(
		<MyContainer searchData={searchData} limit={limit}>
			<MyTableList showHeader={true} showIcon={true} myBtn={"myStr"} myClick={operation} doPage={true} page_url={page_url} loadModels={true} data_url={data_url}>
				<th titleField="createAt" dataField="askerAvatar" type="icon" subField="nickName" style={thStyle}></th>
				<th titleField="ordersCode" dataField="title" subField="money" type="text" style={thStyle}>问题标题</th>
				<th dataField="status" subField="peekCount" type="text" style={thStyle}>状态</th>
				<th titleField="differ" dataField="operation" type="btn" style={thStyle}>操作</th>
			</MyTableList>
		</MyContainer>,
		document.querySelector('.awmcon')
	);



	$('.awmMenu span').eq(0).click(function () {
		if (filter.state) {
			delete filter.state;
		}
		$('.awmMenu span').css('color', 'black');
		$('.awmMenu span div').removeClass('clickSpanLine');
		$(this).css('color', '#34F72F');
		$(this).children('div').addClass('clickSpanLine');
		tableList.setState({ searchData });
	});
	$('.awmMenu span').eq(1).click(function () {
		filter.state = 1;
		$('.awmMenu span').css('color', 'black');
		$('.awmMenu span div').removeClass('clickSpanLine');
		$(this).css('color', '#34F72F');
		$(this).children('div').addClass('clickSpanLine');
		tableList.setState({ searchData });
	});
	$('.awmMenu span').eq(0).click();

	setInterval(() => {
		if (localStorage.getItem('flag')) {
			tableList.setState({ searchData });
			localStorage.removeItem('flag');
		}
	}, 100);

	if (queryState) {
		$(".awmMenu span").eq(queryState).click();
	}

})()