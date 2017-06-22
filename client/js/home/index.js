import './style.css';
import React, { Component } from 'react';
import ReactDom from 'react-dom';
import 'js/common/base.js';
import MyTable from 'js/common/myTableList.js'
import Uploader from 'js/common/webuploader/Uploader.js'
import WebUploader from 'webuploader';



$(document).ready(function () {
  //slideshow自动轮播
  // $("#advertisement").carousel({
  //   interval: 3000
  // });
  let search = () => {
    let sercon = $.trim($('.sear input').val());
    if (sercon != '') {
      location.href = '/course?sercon=' + encodeURI(sercon);
    }
  }
  $('.sear input').bind('keyup', (e) => {
    if (e.keyCode == 13) {
      search();
    }
  });
  $('#searImg').click(search);
});


