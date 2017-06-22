import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import './qasetup.css';
import _ from 'lodash';
import React, {Component} from 'react';
import ReactDom from 'react-dom';
import MyNav from 'js/common/menu/MyNav.js';
import QaSetup from './QaSetup.js';

let menuBar;
let qaSetup;
$.ajax({
  url: '/menu/list',
  type: 'get',
  data: {
    name: "个人资料"
  },
  success: function (data) {
    if (!guser.isInstructor) {
      data.nav.splice(2, 1)
    }
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
  qaSetup = ReactDom.render(
    <QaSetup />,
    document.querySelector('.qasetup')
  );