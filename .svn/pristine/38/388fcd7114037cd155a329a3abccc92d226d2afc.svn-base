import 'js/account/myaccount/index.css';
import React, {Component} from 'react';
import ReactDom from 'react-dom';
import RC_MyTable, {RC_MyTableHeaderColumn} from 'js/common/mytable/mytable';
import MyNav from 'js/common/menu/MyNav.js';
import MyCard from './mycard.js';
(() => {
  /** 侧边栏 */
  let menuBar;
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

  /** 银行卡 */

  ReactDom.render(<MyCard realName = {realName}></MyCard>, document.getElementById('mycard'));
})()