/** 合作方管理 */
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import React from 'react';
import ReactDom from 'react-dom';
import RC_MyTable, { RC_MyTableHeaderColumn } from 'js/common/mytable/mytable';
import RC_MyForm from 'js/common/myform/myform';
import RC_MyRangeCalendar from 'js/common/myform/myrangecalendar';
import moment from 'moment';
import NewJoin from './newJoin';
import Assign from './assign';

(() => {
  const rfalse = function () {
    return false;
  }
  
  let seaBtn = {
    width: '70px',
    height: '34px',
    marginLeft: '1%',
    marginTop: '8px',
    color: 'white',
    backgroundColor: '#09c',
    borderRadius: '5px'
  }
  let newJoinBtn = {
    width: '130px',
    height: '40px',
    float: 'right',
    marginRight: '0px',
    border: '0px',
    backgroundColor: '#F0F0F0'
  }
  let newJoin = ReactDom.render(
    <NewJoin />,
    document.getElementById('showInfo')
  );

  let RC_Assign = ReactDom.render(<Assign></Assign>,document.getElementById('asssign'));

  /**
   * 分配权限操作
   * 
   */
  function assign(domain, partnerName) {
    $.get(`/cms/getrights`, {domain}, (result) => {
      console.log('-----', result);
      RC_Assign.showModal(domain, partnerName, result.rights || [], result.level || []);
    });
  }

  const onCustomizeOpr = function onCustomizeOpr(code, row, idx, target, rcTable) {
    /** 编辑 **/
    if (code === "edit") {
      newJoin.showModal(row);
    }
    /** 分配权限 **/
    if (code === "assign") {
      assign(row.domain, row.name);
    }
    /** 删除合作方 */
    if (code == "delete") {
      let {domain} = row;
      $.post('/delPartner', { domain }, (result) => {
        if (result == "success") {
          swal({
            title: "删除成功!",
            text: "恭喜你，已删除!",
            timer: 1000,
            showConfirmButton: false
          },
            function () {
              location.href = '/cms/joinPartner';
            });
        }
      });
    }
  }

  /** onSearch 搜索 */
  function onSearch(search_con) {
    // if (search_con.startAt) {
    //   search_con.startAt = new Date(search_con.startAt).getTime();
    //   search_con.endAt = new Date(search_con.endAt).getTime();
    // }
    dataTbl.loadModels(`/cms/partnerlist`, search_con);
  }

  /** 详细搜索 */
  ReactDom.render(
    <div>
      <RC_MyForm cols="3">
        <RC_MyRangeCalendar label="合作期限" field={['createStart', 'createEnd']}></RC_MyRangeCalendar>
        <button className="btn btn-primary" style={seaBtn}>搜索</button>
        <button className="btn btn-primary" id="newjoin" style={newJoinBtn}>+ 新增合作方</button>
      </RC_MyForm>
    </div>,
    document.getElementById('searchBar')
  );
  /** 数据结果 */
  let dataTbl;
  //表格头部
  const tablecolumn = [
    (<RC_MyTableHeaderColumn
      key={1}
      dataField='name'
      title={"合作方名称"}
      width="10%">
    </RC_MyTableHeaderColumn>),
    (<RC_MyTableHeaderColumn
      key={2}
      dataField='contactName'
      title={"联系人"}
      width="10%">
    </RC_MyTableHeaderColumn>),
    (<RC_MyTableHeaderColumn
      key={3}
      dataField='phone'
      sortable={false}
      title={"联系电话"}
      width="10%">
    </RC_MyTableHeaderColumn>),
    (<RC_MyTableHeaderColumn
      key={4}
      dataField='domain'
      title={"来源"}
      width="10%">
    </RC_MyTableHeaderColumn>),
    (<RC_MyTableHeaderColumn
      key={4}
      dataField='startAt'
      sortable={true}
      title={"合作初始"}
      width="10%">
    </RC_MyTableHeaderColumn>),
    (<RC_MyTableHeaderColumn
      key={4}
      dataField='endAt'
      sortable={true}
      title={"合作结束"}
      width="10%">
    </RC_MyTableHeaderColumn>),
    (<RC_MyTableHeaderColumn
      key={4}
      dataField='orderSn'
      customizeOpr={[
        { code: 'edit', title: '编辑' },
        { code: 'assign', title: '权限分配' },
        { code: 'delete', title: '删除' }
      ]}
      title={"操作"}
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
      onCustomizeOpr={onCustomizeOpr}
    >
      {tablecolumn}
    </RC_MyTable>,
    document.getElementById('dataTable')
  );
  onSearch('');
  $('#newjoin').click(() => {
    newJoin.showNewModal();
  })
})()