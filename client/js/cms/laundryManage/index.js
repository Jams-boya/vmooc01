/** 账户流水管理 */

import 'bootstrap/dist/js/bootstrap.min.js';
import React from 'react';
import ReactDom from 'react-dom';
import RC_MyTable, {RC_MyTableHeaderColumn} from 'js/common/mytable/mytable';
import MyDetailSearchBar from 'js/common/MyDetailSearchBar';
import RC_MyForm from 'js/common/myform/myform';
import RC_MyInput from 'js/common/myform/myinput';
import RC_MySelect from 'js/common/myform/myselect';
import RC_MyRangeCalendar from 'js/common/myform/myrangecalendar';
import MyNotify from 'js/common/MyNotify.js';
import common from './common';
import bootbox from 'bootbox/bootbox.min.js';
import moment from 'moment';
bootbox.setLocale('zh_CN');

(() => {

  const rfalse = function () {
    return false;
  }

  /** 获取统计 */
  function getCount(condition) {
    let count = 0;
    $.ajax({
      type: "GET",
      url: '/cms/laundrystatistic',
      contentType: "application/json",
      data: condition,
      dataType: 'json', 
      async:false,//取消异步请求
      success: function(result) {
        //这里是Code 
       if (result && result[0] && result[0].count)
        count = Number(result[0].count).toFixed(3);
      },
      error: function(result, status) { 
      }
    });
    return count;
  }

  /** onSearch 搜索 */
	function onSearch(search_con) {
    if (search_con.type) {
      search_con['isInstructor'] = search_con.type === '0'? false : true;
    } else {
      delete search_con.isInstructor;
    }
    if (search_con.signStart) {
      search_con.signStart = new Date(search_con.signStart).getTime();
      search_con.signEnd = new Date(search_con.signEnd).getTime();
    }
    dataTbl.loadModels(`/cms/getlaundrylist`, search_con);
	}

  // let userInfoDiv = ReactDom.render(
  //   <ShowUserInfo 
  //   > 
  //   </ShowUserInfo>, 
  //   document.getElementById('showInfo')
  // );


  /** 详细搜索 */
	ReactDom.render(
	  <MyDetailSearchBar 
	    placeholder='订单号'
	    onSearch={onSearch}
	  >
	    <RC_MyForm cols="3">
	      <RC_MyRangeCalendar label="下单时间" field={['createStart','createEnd']} ></RC_MyRangeCalendar>
        <RC_MySelect 
          labelfield="typeLabel"
          key = {1} 
          valuefield="type"
	        label= '交易类型' 
	        placeholder=""
	        multi= {false} 
	        options={[{value: 'course', label: '课程'}, {value: 'collection', label: "专题"}, {value: 'qa', label: '问答'}, {value: 'peek', label: '偷看'}]}
        ></RC_MySelect>
	    </RC_MyForm>
	    
	  </MyDetailSearchBar>,
	  document.getElementById('searchBar')
	);

  /** 数据结果 */
	let dataTbl;

	//表格头部
	const tablecolumn = [
    (<RC_MyTableHeaderColumn 
      key={1}
      dataField='_id' 
      sortable={true}
      displayChange = {common.buildLaundryCode}
      title={"流水号"}
      width="10%">
    </RC_MyTableHeaderColumn>),
    (<RC_MyTableHeaderColumn 
      key={2}
      dataField='createAt' 
      sortable={true}
      displayChange = {common.simpleDateForm}
      title={"交易时间"}
      width="10%">
    </RC_MyTableHeaderColumn>),
    (<RC_MyTableHeaderColumn 
      key={3}
      dataField='orderType' 
      sortable={true}
      displayChange = {common.buildLaundryType}
      title={"交易类型"}
      width="10%">
    </RC_MyTableHeaderColumn>),
    (<RC_MyTableHeaderColumn 
      key={4}
      dataField='changes.cashPooling' 
      sortable={true}
      displayChange = {common.amtFormat}
      title={"金额"}
      width="10%">
    </RC_MyTableHeaderColumn>),
    (<RC_MyTableHeaderColumn 
      key={4}
      dataField='orderSn' 
      sortable={true}
      title={"对应订单号"}
      width="10%">
    </RC_MyTableHeaderColumn>)
  ];

  dataTbl = ReactDom.render(
    <RC_MyTable 
      url='' 
      bodyHeight='auto' 
      keyField='_id' 
      limit={10}
      paging={true} 
      toolbar = {{
        buttons:[{name: `平台余额（${getCount({type: 'balance'})}）`}, {name: `进账（${getCount({type: 'income'})}）`}, {name: `支出（${getCount({type: 'chargeoff'})}）`}], callback: rfalse
      }}
    > 
    {tablecolumn}  
    </RC_MyTable>, 
    document.getElementById('dataTable')
  );
  onSearch('');
})()