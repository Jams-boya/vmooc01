/** 提现管理 */

import 'bootstrap/dist/js/bootstrap.min.js';
import './index.css';
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
import _ from 'lodash';
bootbox.setLocale('zh_CN');

import CertificateModal from './CertificateModal';

(() => {
  const rfalse = function () {
    return false;
  }

  /** 打款模态框 */
  let certificate = ReactDom.render(
    <CertificateModal></CertificateModal>,
    document.getElementById('certificate')
  );

  /** 获取统计 */
  function getCount(condition, type) {
    let count = 0;
    $.ajax({
      type: "GET",
      url: '/cms/cashstatistic',
      contentType: "application/json",
      data: condition,
      dataType: 'json', 
      async:false,//取消异步请求
      success: function(result) {
        //这里是Code
        if (type === 'total') {
          result.map(r => {
            count += Number(r.total);
          });
        } else {
          count = (result && result[0])? result[0].total: count;
        }
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
    dataTbl.loadModels(`/cms/getcashlist`, search_con);
	}

  // let userInfoDiv = ReactDom.render(
  //   <ShowUserInfo 
  //   > 
  //   </ShowUserInfo>, 
  //   document.getElementById('showInfo')
  // );

  //操作栏 操作
  const onCustomizeOpr = function onCustomizeOpr(code, row, idx, target, rcTable) {

    // 打款
    if (code === 'remittance') {
      const successOp = function(result) {
        rcTable.confirmEdit(result, idx);
        rcTable.changeToolbar({
          buttons:[{name: `提现总额（${getCount({state: ''}, 'total')}）`, className: 'nocursor'}, {name: `已打款（${getCount({state: 1})}）`, className: 'nocursor'}, {name: `未打款（${getCount({state: 0})}）`, className: 'nocursor'}], callback: rfalse
        });
      }
      certificate.showModal(row._id, 1, '', successOp);
    }

    // 打款凭证
    if (code === 'voucher') {
      certificate.showModal(row._id, 2, row.voucher);
    }
    
  }

  /** 详细搜索 */
	ReactDom.render(
	  <MyDetailSearchBar 
	    placeholder='输入用户名称'
	    onSearch={onSearch}
	  >
	    <RC_MyForm cols="3">
        <RC_MyInput field="name" label="会员姓名" defaultValue="" type="text"></RC_MyInput>
	      <RC_MyRangeCalendar label="提现时间" field={['signStart','signEnd']} ></RC_MyRangeCalendar>
        <RC_MySelect 
          labelfield="stateLabel"
          key = {1} 
          valuefield="state"
	        label= '提现状态' 
	        placeholder=""
	        multi= {false} 
	        options={[{value: 0, label: '已申请'}, {value: 1, label: "已打款"}]}
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
      dataField='createAt' 
      sortable={true}
      // linkAction={onClickContract}
      displayChange = {common.simpleDateForm}
      title={"提现时间"}
      width="10%">
    </RC_MyTableHeaderColumn>),
    (<RC_MyTableHeaderColumn 
      key={2}
      dataField='userName' 
      sortable={true}
      title={"开户人姓名"}
      width="10%">
    </RC_MyTableHeaderColumn>),
    (<RC_MyTableHeaderColumn 
      key={3}
      dataField='alipay' 
      title={"支付宝"}
      width="10%">
    </RC_MyTableHeaderColumn>),
    (<RC_MyTableHeaderColumn 
      key={4}
      dataField='amt' 
      sortable={true}
      title={"提现金额"}
      width="10%">
    </RC_MyTableHeaderColumn>),
    (<RC_MyTableHeaderColumn 
      key={4}
      dataField='state' 
      sortable={true}
      title={"状态"}
      displayChange = {common.showState}
      width="10%">
    </RC_MyTableHeaderColumn>),
    (<RC_MyTableHeaderColumn 
      key={9}
      isOpr={true} 
      customizeOpr={[
        {code: 'remittance', className: "btn btn-primary", title: '打款', filter: (o) => {if (o.state === 0) return true;}}, 
        {code: 'voucher', title: '打款凭证', filter: (o) => {if (o.state === 1) return true;}},
      ]}
      title={"操作"}
      width="10%">
    </RC_MyTableHeaderColumn>)
  ];

  const monthCondition = {signStart: moment().startOf('month').format('X') * 1000, signEnd: moment().endOf('month').format('X') * 1000};
  const weekCondition = {signStart: moment().startOf('month').format('X') * 1000, signEnd: moment().endOf('month').format('X') * 1000};
	
  dataTbl = ReactDom.render(
    <RC_MyTable 
      url='' 
      bodyHeight='auto' 
      keyField='_id' 
      limit={10}
      paging={true} 
      onCustomizeOpr={onCustomizeOpr}
      toolbar = {{
      buttons:[{name: `提现总额（${getCount({state: ''}, 'total')}）`, className: 'nocursor'}, {name: `已打款（${getCount({state: 1})}）`, className: 'nocursor'}, {name: `未打款（${getCount({state: 0})}）`, className: 'nocursor'}], callback: rfalse
    }}
    > 
    {tablecolumn}  
    </RC_MyTable>, 
    document.getElementById('dataTable')
  );
  onSearch('');
})()