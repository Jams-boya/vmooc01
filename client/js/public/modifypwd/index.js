import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import './modifypwd.css';
import _ from 'lodash';
import React, {Component} from 'react';
import ReactDom from 'react-dom';
import MyNav from 'js/common/menu/MyNav.js';
import ModifyPwd from './modifypwd.js';

let menuBar;
let modifypwd;
$.ajax({
  url: '/menu/list',
  type: 'get',
  data: {
    name: "个人资料"
  },
  success: function (data) {
    menuBar = ReactDom.render(
      <MyNav
        nav={data}
      />,
      document.querySelector('.pubmenu')
    );
  },
  error: function (xhr, status, err) {
    console.error(status, err.toString());
  }
});

  modifypwd = ReactDom.render(
    <ModifyPwd  />,
    document.querySelector('.modifypwd')
  );