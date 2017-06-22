import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import './personal.css';
import _ from 'lodash';
import { message, Button } from 'antd';
import React, { Component } from 'react';
import ReactDom from 'react-dom';
import MyNav from 'js/common/menu/MyNav.js';
import Personal from './Personal.js';

let menuBar;
let personal;

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
personal = ReactDom.render(
  <Personal />,
  document.querySelector('.personal')
);