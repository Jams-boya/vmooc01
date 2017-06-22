import './enshrine.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import _ from 'lodash';
import React, { Component } from 'react';
import ReactDom from 'react-dom';
import MyNav from 'js/common/menu/MyNav.js';
import MyContainer from 'js/common/myContainer.js';
import Enshrine from './enshrineReact.js';

(() => {
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
          queryUrl={'/enshrineEntry'}
          />,
        document.querySelector('.pubmenu')
      );
    },
    error: function (xhr, status, err) {
      console.error(status, err.toString());
    }
  });
  let page = 1;
  let page_url = '/enshrineCount';
  let data_url = '/myEnshrine';
  let searchData = [{
    userID: guser._id,
    curPage: page,
    limit: 6,
  }];
  let nullShow = () => {
    let shCount = Number(enshrine.state.dataCount);
    if(shCount == 0) {
      $('.null').show();
    } else {
      $('.null').hide();
    }
  }
  let delEnshrine = (courseID, userID) => {
    $.ajax({
      url: '/delEnshrine?userID=' + userID + '&courseID=' + courseID,
      type: 'get',
      async: false,
      success: (result) => {
        if (result.ok == 1) {
          enshrine.setState({ curPage: 1, searchData: searchData, init: true });
          nullShow();
        }
      }
    });
  }
  let enshrine = ReactDom.render(
    <MyContainer searchData={searchData} limit={6}>
      <Enshrine delEn={delEnshrine} doPage={true} page_url={page_url} loadModels={true} data_url={data_url} />
    </MyContainer>,
    document.querySelector('.enshrine')
  );
  nullShow();
})()