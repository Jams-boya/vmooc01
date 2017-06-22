import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import React, { Component } from 'react';
import ReactDom from 'react-dom';
import TopReact from '../react/topReact';
import bootbox from 'bootbox';
import WaitPaymentWidget from 'js/common/widget/waitPaymentWidget';

(() => {
  /**
   * 展示头部信息
   * @author: wac
   */

  function buyAll() {

  }

  function topShow() {
    $.ajax({
      url: '/topInfo?id=' + collection_id,
      type: 'get',
      async: false,
      success: (topInfo) => {
        let topReact = ReactDom.render(
          <TopReact topInfo={topInfo} buyBtn={buyAll} />,
          document.querySelector('.topDom')
        );
      },
      error: (err) => {
        console.log('rmdExperts:', err)
      }
    });
  }
  topShow();

  let  chapterInfo = {};
  $.ajax({
    url: '/courseCompilation?id=' + collection_id,
    type: 'get',
    async: false,
    success: (chapter) => {
      chapterInfo = chapter;
      chapterInfo.price = chapterInfo.collectionPrice;
    },
    error: (err) => {
      console.log('courseCompilation:', err);
    }
  });

  function onPay() {
    if (guser)
      $('#myModal').modal("show");
    else {
      bootbox.alert({
        message: "请先登录!",
        size: 'small'
      });
      window.location.href = '/signin';
    }
  }

  $(".topbuy").click(e => {
    if (!guser) {
      bootbox.alert({
        message: "请先登录!",
        size: 'small'
      });
      window.location.href = '/signin';
    } else {
      //支付组件
      let payWidget = ReactDom.render(
        <WaitPaymentWidget data={chapterInfo} orderType={"collection"} />,
        document.querySelector('.buy-modal')
      );
      $('#myModal').modal("show");
    }
  });
})()