import _ from 'lodash';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import React, {Component} from 'react';
import ReactDom from 'react-dom';
import MyNav from 'js/common/menu/MyNav.js';
import MyContainer from 'js/common/myContainer.js';
import MyTableList from 'js/common/myTableList.js';
import WaitPaymentWidget from 'js/common/widget/waitPaymentWidget';
import bootbox from 'bootbox';

//生成菜单栏
let menuBar;
$('#messages').css("color","black");
$('#HomePage').css("color","#21BA10");
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
        queryUrl={'/orderManage'}
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
  $and: [
          { $or: [{receiverId : guser._id}, {"collectionReceivers.receiverId": guser._id}] },
          {  $or: [{type: 'course'}, {type: 'collection'}] }
      ]
}

let searchData = [{
	filter: filter,
	curPage   : 1,
  limit     : 5
}];
let page_url = "/getExpertOrdersCount";
let data_url = "/getExpertOrders";
// console.log(filter);
let tableList = ReactDom.render(
  <MyContainer searchData={searchData} limit={5}>
    <MyTableList showHeader={false} showIcon={true} doPage={true} page_url={page_url} 
    loadModels={true} data_url={data_url} btnField={true} diffStateClick={diffStateClick}>
      <th dataField="payerAvatar" style={{width:'15%'}} type="icon" titleField="createAt" subField="payerName"></th>
      <th dataField="cover" type="img" style={{ width: '18%' }} titleField="sn" subField="promoCode">课程信息</th>
      <th dataField="itemName" type="text" style={{width:'25%'}} subField="price"></th>
      <th dataField="itemLicense" style={{width:'15%'}} type="text">人数</th>
      <th dataField="state" style={{width:'15%'}} type="text">状态</th>
      <th dataField="operation" type="btn" >操作</th>
    </MyTableList>
  </MyContainer>,
  document.querySelector('.tableContainer')
);

//根据订单状态绑定不同按钮事件
function diffStateClick(mrow, btn) {
  //取消订单事件
  if (btn.event == "del") {
  	bootbox.confirm({ 
  		size: "small",
  		message: "订单删除后不可恢复，确认要删除当前订单?", 
      buttons: {
          confirm: {
            label: '确定',
            className: 'btn-success'
          },
          cancel: {
            label: '取消',
            className: 'btn-default'
          }
      },
  		callback: function(result){ 
  		  if (result) {
  		  	$.ajax({
  			    url: '/delOrderById',
  			    type: 'get',
  			    data: {
  			      orderId: mrow._id
  			    },
  			    success: function(data) {
              bootbox.alert("删除成功");
  			      window.location.href = '/orderManage';

  			    },
  			    error: function(err) {
  			        console.log("err", err);
  			    }
  			  });
  		  }
  		}
  	});
    
  }
}

//筛选按钮点击事件
$(".filter .btn").click(e => {
  //点击样式变化
  let flag = '<div id="proc_bar" style="background: linear-gradient(to right, red , yellow , #27AE24); height: 3px;"></div>';
  $("#proc_bar").remove();
  $(e.target).parent().append(flag);
  //判断选中筛选项的值 "all"=全部, 0=代付款, 1=已付款, 2=交易关闭
  if (e.target.id !="all") {
    filter.state = e.target.id == "unpaid" ? 0 :
                   e.target.id == "paid" ? 1: 2;
  } else {
    filter = {
      receiverId : guser._id
    }
  }
  searchData[0].filter = filter;
  tableList.setState({
    searchData: searchData,
    init: true,
    curPage: 1,
  });
});
