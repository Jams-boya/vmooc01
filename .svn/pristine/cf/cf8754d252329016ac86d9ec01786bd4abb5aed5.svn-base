import _ from 'lodash';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import React, {Component} from 'react';
import ReactDom from 'react-dom';
import MyNav from 'js/common/menu/MyNav.js';
import MyContainer from 'js/common/myContainer.js';
import MyTableList from 'js/common/myTableList.js';
import PersonList from 'js/course/giveCourse/personList.js'
import {Popover, message, Button, Icon} from 'antd';;
import RC_MyTable, {RC_MyTableHeaderColumn} from 'js/common/mytable/mytable.js';
import bootbox from 'bootbox';

//生成菜单栏
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
	      queryUrl={'/myOrders'}
	    />,
	    document.querySelector('.pubmenu')
	  );
	},
	error: function (xhr, status, err) {
	  console.error(status, err.toString());
	}
});

let persons = [
];

let personList = ReactDom.render(
	<PersonList onDel={onDel} data={persons}/>,
	document.querySelector('.personList')
);

function onDel(idx) {
	restLicense++;
	$(".addedPerson .icon").eq(idx).remove();
	persons.splice(idx, 1);
	personList.setState({data: persons});

}

//添加方法
const onCustomizeOpr = function onCustomizeOpr(code, row, idx, target, rcTable) {
	if (code === "add") {
			if (restLicense - 1 < 0) {
				message.warn("超过当前可赠送次数！");
				return;
			} else {
				//判断重复添加
				let flag = _.find(persons, (o) => {

					return o._id == row._id;
				});
				if (flag) {
					message.warn("已添加此人！");
					return;
				}

				if (row._id == guser._id) {
					message.warn("不能添加自己！");
					return;
				}
				
				//添加操作并判断是否超过可赠送次数
				restLicense--;
				$(".addedPerson").append('<div class="icon" style="margin-right:6px;height:16px;width:70px;float:left;"><span class="glyphicon glyphicon-user" style="float:left">'
																	 + row.name 
																 +'</span>'
																 +'<span class="glyphicon glyphicon-remove delete" id="'+ row._id +'" style="float:left;" ></span>'
																 +'</div>');

				//删除事件
				$("#"+row._id).click((e) => {
					let idx = _.findIndex(persons, (o) => {
						return e.target.id == o._id;
					});

					restLicense++;
					$(".addedPerson .icon").eq(idx).remove();
					persons.splice(idx, 1);
				});

				let data = personList.state.data;
				data.push({name: row.name, email: row.email, _id: row._id, amount: 1});

				persons = data;
			}
  }
}

//确认事件
$("#addConfirm").click(() => {
	personList.setState({data: persons});
});

let addressList = ReactDom.render(
	<RC_MyTable url='/getpersonlist?keyword=' bodyHeight='auto' keyField='_id' limit={6} paging={true} onCustomizeOpr={onCustomizeOpr}> 
        <RC_MyTableHeaderColumn key={1} dataField='name' sortable={true} title={"姓名"} width="25%" height="0px">
        </RC_MyTableHeaderColumn>
        <RC_MyTableHeaderColumn key={2} dataField='email' sortable={true} title={"邮箱"} width="60%" height="0px">
      	</RC_MyTableHeaderColumn>
      	<RC_MyTableHeaderColumn key={3} isOpr={true} customizeOpr={[{code: 'add', title: '添加'},]}
      		title={"操作"}
      		width="15%">
      	</RC_MyTableHeaderColumn>
    </RC_MyTable>,
	document.querySelector('.addressListBody')
);

addressList.loadModels('/getpersonlist?keyword=');

//通讯录搜索事件
$("#searchBtn2").click((e) => {
	let keyword = $("#searchContent2").val();
	addressList.loadModels('/getpersonlist?keyword='+keyword);
});

//搜索事件
$("#searchBtn1").click((e) => {
	let keyword = $("#searchContent1").val();
	addressList.loadModels('/getpersonlist?keyword='+keyword);
});

//赠送事件
$("#giveBtn").click(() => {
	let orders = [];
	persons.map((person) => {
		let personOrder = _.cloneDeep(order);
		personOrder.itemLicense = 1;
		personOrder.licenseUsed = 1;
		personOrder.createAt    = new Date().getTime();
		personOrder.itemAmount  = personOrder.itemPrice;
		personOrder.payerId     = person._id;
		personOrder.payerName   = person.name;
		personOrder.payMethod   = -1;
		personOrder.receiverId  = order.payerId;
		personOrder.receiverName  = order.payerName;
		delete personOrder._id;
		orders.push(personOrder);
	});
	$.ajax({
		url: '/createGiveCourseOrder',
		type:'post',
		data: {
			orders: orders,
			currentOrder: order,
			persons: persons,
		},
		success: function(data) {
			bootbox.confirm({
        message: "课程赠送成功<br/>剩余赠送次数: " + restLicense + " 次",
        buttons: {
          confirm: {
            label: '继续赠送',
            className: 'btn-success'
          },
          cancel: {
            label: '返回课程订单',
            className: 'btn-default'
          }
        },
        callback: function (result) {
          if (result) {
            window.location.reload(true);
          } else {
          	window.location.href = '/myOrders';
          }
        }
      });
		},
		error: function (err) {
		  console.error(err.toString());
		}
	});
});