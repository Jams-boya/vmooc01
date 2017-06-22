/** 会员管理 */
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
import ShowUserInfo from './showUserInfo';
import moment from 'moment';
import {Modal} from 'antd';
const confirm = Modal.confirm;

(() => {

  const rfalse = function () {
    return false;
  }

  /** 获取统计 */
  function getCount(condition) {
    let count = 0;
    $.ajax({
      type: "GET",
      url: '/getalluserscount',
      contentType: "application/json",
      data: condition,
      dataType: 'json', 
      async:false,//取消异步请求
      success: function (result) {
        //这里是Code 
       count = result;
      },
      error: function(result, status) { 
      
      }
    });
    return count;
  }
  /** 重置密码 */

  function changeUserPwd(userId, email) {
    confirm({
      title: '重置密码',
      content: `是否重置 ${email} 的密码？`,
      onOk() {
        return new Promise((resolve, reject) => {
          $.post("/cms/edituserpwd", {password: '123', userId}, (data) => {
            MyNotify.info("重置成功");
            resolve();
          });
        }).catch(() => console.log(''));
      },
      onCancel() {},
    });
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
    dataTbl.loadModels(`/getalluserslist`, search_con);
	}

  /** 设为管理员 */
  function giveAdmin(userId, type) {
    /** type: 0 设置， type: 1 取消 */

  }

  let userInfoDiv = ReactDom.render(
    <ShowUserInfo 
    > 
    </ShowUserInfo>, 
    document.getElementById('showInfo')
  );

  //操作栏 操作
  const onCustomizeOpr = function onCustomizeOpr(code, row, idx, target, rcTable) {

    //查看用户信息
    if (code === 'viewInfo') {
      userInfoDiv.showModal(row);
    }

    if (code === 'changePwd') {
      changeUserPwd(row._id, row.email);
    }

    if (code === 'giveAdmin') {
      giveAdmin(row._id, 0);
    }

    if (code === 'removeAdmin') {
      giveAdmin(row._id, 1);
    }
    
  }

  /** 详细搜索 */
	ReactDom.render(
	  <MyDetailSearchBar 
	    placeholder='输入用户邮箱'
	    onSearch={onSearch}
	  >
	    <RC_MyForm cols="3">
        <RC_MyInput field="name" label="会员姓名" defaultValue="" type="text"></RC_MyInput>
        <RC_MyInput field="email" label="注册邮箱" defaultValue="" type="text"></RC_MyInput>
	      <RC_MyRangeCalendar label="注册时间" field={['signStart','signEnd']} ></RC_MyRangeCalendar>
        <RC_MySelect 
          labelfield="typeLabel"
          key = {1} 
          valuefield="type"
	        label= '会员类型' 
	        placeholder=""
	        multi= {false} 
	        options={[{value: "0", label: '注册会员'}, {value: "1", label: "认证讲师"}]}
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
      dataField='name' 
      sortable={true}
      // linkAction={onClickContract}
      title={"用户姓名"}
      width="10%">
    </RC_MyTableHeaderColumn>),
    (<RC_MyTableHeaderColumn 
      key={2}
      dataField='email' 
      sortable={true}
      title={"注册邮箱"}
      width="10%">
    </RC_MyTableHeaderColumn>),
    (<RC_MyTableHeaderColumn 
      key={3}
      dataField='isInstructor' 
      sortable={true}
      displayChange = {common.accountType}
      title={"会员类型"}
      width="10%">
    </RC_MyTableHeaderColumn>),
    (<RC_MyTableHeaderColumn 
      key={4}
      dataField='from' 
      title={"来源"}
      width="10%">
    </RC_MyTableHeaderColumn>),
    (<RC_MyTableHeaderColumn 
      key={5}
      dataField='registrationAt' 
      sortable={true}
      displayChange = {common.simpleDateFormat}
      title={"注册时间"}
      width="10%">
    </RC_MyTableHeaderColumn>),
    (<RC_MyTableHeaderColumn 
      key={9}
      isOpr={true} 
      customizeOpr={[
        {code: 'viewInfo', title: '查看'}, 
        {code: 'changePwd', title: '重置密码'},
        // {code: 'giveAdmin', title: '设为管理员', filter: (o) => {if (!o['is_vmooc_admin']) return true;}},
        // {code: 'removeAdmin', title: '取消管理员', filter: (o) => {if (o['is_vmooc_admin'] == 1) return true;}}
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
      buttons:[{name: `会员总数（${getCount({keyword: ''})}）`, className: 'nocursor'}, {name: `本月新增（${getCount(monthCondition)}）`, className: 'nocursor'}, {name: `本周新增（${getCount(weekCondition)}）`, className: 'nocursor'}], callback: rfalse
    }}
    > 
    {tablecolumn}  
    </RC_MyTable>, 
    document.getElementById('dataTable')
  );
  onSearch('');
})()