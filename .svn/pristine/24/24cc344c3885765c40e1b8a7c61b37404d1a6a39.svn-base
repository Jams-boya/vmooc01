import './expert.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import _ from 'lodash';
import React, { Component } from 'react';
import ReactDom from 'react-dom';
import ReplyWidget from 'js/common/widget/replyWidget';
import expert from './expert.js';
import VlistWidget from 'js/common/widget/vlistWidget';
import MyContainer from 'js/common/myContainer.js';

(() => {
  expert();
  let replyWidget;
  let vlistInfo;
  let answerId = $('.userId').html();
  let answers = [];
  //显示条数
  let listCount = 10;
  //页数
  let cur_page = 1;

  function findInfo() {
    $.ajax({
      url: '/myAnswer',
      type: 'post',
      async: false,
      data: {
        answerId: answerId,
        listCount: listCount,
        cur_page: cur_page
      },
      success: (data) => {
        if (data) {
          answers = data;
          replyWidget = ReactDom.render(
            <ReplyWidget answerData={answers} />,
            document.querySelector('.reply')
          );
        }
      },
      error: (err) => {
        console.log(err);
      }

    });
  }

  findInfo();

  let answerCount = parseInt($('#answerCount').html());

  if(answerCount <= 10) {
    $('.queload').hide();
  }

  $('.loadMore').click(() => {
    cur_page++;
    findInfo();
    if ($('.quelist').length == answerCount) {
      $('.queload').hide();
    }
  });


  let type = '全部';
  let direction = '全部';
  let sort = 'purchaseCount';
  let page = 1;
  let page_url = '/coursesListCount';
  let data_url = '/coursesList';

  let searchData = [{
    courseType: type,
    direction: direction,
    sortBy: sort,
    curPage: page,
    limit: 9,
    teacherId: answerId,
  }];

  vlistInfo = ReactDom.render(
    // <VlistWidget data = {vlistData} />,
    <MyContainer searchData={searchData}>
      <VlistWidget doPage={true} page_url={page_url} loadModels={true} data_url={data_url} />
    </MyContainer>,
    document.querySelector('.vlistdiv')
  );

  $('.buyBtn').click(() => {
    $('.promenu span').eq(2).click();
  });
})()