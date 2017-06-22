import './index.css';
import '../../../common/css/pageul.css';
import '../../../common/css/recommend.css';
import '../../../common/css/pop.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import _ from 'lodash';
import React, { Component } from 'react';
import ReactDom from 'react-dom';
import MenuList from './menuList';
import VlistWidget from 'js/common/widget/vlistWidget';
import Recommend from 'js/common/widget/recommendWidget';
import PopWidget from 'js/common/widget/popWidget';
import MyContainer from 'js/common/myContainer.js';
/**
 * course 所有课程页面index.js
 * @author: wac
 */
(() => {
  var menu = {};
  $.ajax({
    url: '/courseMenuList',
    type: 'get',
    async: false,
    success: (data) => {
      menu = data;
    },
    error: () => {
      console.log('error', 'courseMenuList');
    }
  });

  let projectMenu = ReactDom.render(
    <MenuList data={menu} />,
    document.querySelector('.menuList')
  );

  let vlist = [];
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
    limit: 12,
  }];

  //<MenuList data_url='/courseMenuList' loadModels={true}/>
  let vlistReact = ReactDom.render(
    <MyContainer searchData={searchData}>
      <VlistWidget doPage={true} page_url={page_url} loadModels={true} data_url={data_url} />
    </MyContainer>,
    document.querySelector('.vlistdiv')
  );

  $('.indexmenu').map((index, val) => {
    $('.indexmenu').eq(index).children('.list').children('span').click(function () {
      $('.indexmenu').eq(index).children('.list').children('span').css('background', 'white');
      $('.indexmenu').eq(index).children('.list').children('span').children('a').css('color', 'black');
      $(this).css('background', '#36C77A');
      $(this).children('a').css('color', 'white');
    });
  });

  $('.selectmenu span').click(function () {
    $('.selectmenu span').css({
      'background': 'transparent',
      'border-bottom': '1px solid #E4E4E4'
    });
    $(this).css({
      'background': '#FFFFFF',
      'border-bottom': '2px solid #35C677'
    });
  });

  $('.indexmenu').map((index, val) => {
    $('.indexmenu').eq(index).children('.list').children('span').click(function () {
      let con = $(this).children('a').html();
      index == 0 ? type = con : direction = con;
      page = 1;
      searchData[0].curPage = 1;
      searchData[0].courseType = type;
      searchData[0].direction = direction;
      vlistReact.setState({ curPage: 1, searchData: searchData, init: true });
    });
  });

  $('.selectmenu span').click(function () {
    let sortFlag = parseInt($(this).index());
    sort = sortFlag == 0 ? 'purchaseCount' : sortFlag == 1 ? 'createAt' : 'price';
    searchData[0].sortBy = sort;
    searchData[0].curPage = 1;
    vlistReact.setState({ curPage: 1, searchData: searchData, init: true });
  });

  $('.indexmenu').eq(0).children('.list').children('span').eq(0).click();
  $('.indexmenu').eq(1).children('.list').children('span').eq(0).click();
  $('.selectmenu span').eq(0).click();

  let recommedArr = [];
  //推荐个数
  let reCount = 3;
  $.ajax({
    url: '/recommend',
    type: 'get',
    async: false,
    data: {
      reCount
    },
    success: (data) => {
      recommedArr = data;
    },
    error: () => {
      console.log('error', 'recommend');
    }
  });
  let recommendReact = ReactDom.render(
    <Recommend relist={recommedArr} />,
    document.querySelector('.reDiv')
  );


  let popArr = [];
  $.ajax({
    url: '/popCourse',
    type: 'get',
    async: false,
    success: (data) => {
      popArr = data;
    },
    error: () => {
      console.log('error', 'popCourse');
    }
  });

  let pop = ReactDom.render(
    <PopWidget poplist={popArr} />,
    document.querySelector('.popDiv')
  );

  if (pageFrom == "expertPublish") {
    $(".selectmenu span").eq(1).click();
  }

  $('.indexmenu').eq(2).hide();

  let urlHref = location.href;
  if (urlHref.indexOf('classify=') != -1) {
    let cify = urlHref.substr(urlHref.indexOf('classify=') + 9, urlHref.length);
    let span = $('.indexmenu').eq(0).children('.list').children('span');
    span.map((idx, $span) => {
      let spanEn = encodeURI($('.indexmenu').eq(0).children('.list').children('span').eq(idx).children('a').html());
      if (cify == spanEn) {
        $('.indexmenu').eq(0).children('.list').children('span').eq(idx).click();
      }
    });
  }

  let sercon = '';
  let search = () => {
    sercon = $.trim($('.sear input').val());
    if (sercon != '') {
      searchData[0].curPage = 1;
      searchData[0].courseType = '全部';
      searchData[0].direction = '全部';
      searchData[0].sortBy = 'purchaseCount';
      searchData[0].sercon = sercon;
      vlistReact.setState({ curPage: 1, searchData: searchData, init: true });
      $('.menuList').hide();
      $('.searchDom').show();
      $('.sercount').html(vlistReact.state.dataCount);
      $('.serstr').html(sercon);
      if(vlistReact.state.dataCount == 0) {
        $('.sernull').show();
      } else {
        $('.sernull').hide();
      }
    }
  }
  if (location.href.indexOf('sercon=') != -1) {
    let url = location.href;
    sercon = url.substr(url.indexOf('sercon=') + 7, url.length - url.indexOf('sercon=') - 7);
    sercon = decodeURI(sercon)
    $('.sear input').val(sercon);
    search();
  }
  $('.sear input').bind('keyup', (e) => {
    if (e.keyCode == 13) {
      search();
    }
  });
  $('#searImg').click(search);

})()