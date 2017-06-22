import './specialManage.css';
import _ from 'lodash';
import React, { Component } from 'react';
import ReactDom from 'react-dom';
import MyNav from 'js/common/menu/MyNav.js';
import MyContainer from 'js/common/myContainer.js';
import MyTableList from 'js/common/myTableList.js'

(() => {
  let filter = { $or: [{ state: 0 }, { state: 1 }] };
  let searchData = [{
    state: filter,
    curPage: 1,
    limit: 5
  }];
  let limit = 5;
  let thStyle = {
    'textAlign': 'left'
  }
  let lastStyle = {
    'textAlign': 'center'
  }

  let page_url = "/cms/specialCount";
  let data_url = "/cms/specials";

  function copyLink(mrow) {
    $('#copy').show();
    $('#copy').val(mrow.link);
    let copySel = $('#copy');
    copySel.select();
    document.execCommand("Copy");
    $('#copy').hide();
  }
  function upSpecial(mrow) {
    location.href = '/cms/sprest?specialId=' + mrow._id;
  }
  function delSpecial(mrow) {
    $.ajax({
      url: '/cms/delSpecial',
      type: 'post',
      data: {
        id: mrow._id,
      },
      success: (data) => {
        if (data.ok) {
          specialList.setState({ searchData });
        }
      }
    });
  }
  let specialList = ReactDom.render(
    <MyContainer searchData={searchData} limit={limit}>
      <MyTableList showHeader={true} showIcon={true} myBtn={"copyLink"} onEidtor={"修改"} editBtn={'修改'} delBtn={'删除'} onDel={delSpecial} onEdit={upSpecial} myClick={copyLink} doPage={true} page_url={page_url} loadModels={true} data_url={data_url}>
        <th dataField="name" type="text" style={thStyle}>专题名称</th>
        <th dataField="link" type="text" style={thStyle}>专题链接</th>
        <th dataField="state" type="text" style={thStyle}>专题链接</th>
        <th dataField="domain" type="text" style={thStyle}>来源</th>
        <th dataField="operation" type="btn" style={lastStyle}>操作</th>
      </MyTableList>
    </MyContainer>,
    document.querySelector('.specialList')
  );

  $('.addLink').click(() => {
    location.href = '/cms/sprest';
  });
})()