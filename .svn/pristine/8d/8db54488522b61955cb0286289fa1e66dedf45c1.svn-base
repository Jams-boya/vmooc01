import './specialReset.css';
import React, { Component } from 'react';
import ReactDom from 'react-dom';
import ImgUpload from './imgUpload';
import CourseList from './courseList';
import MyNav from 'js/common/menu/MyNav.js';
import MyContainer from 'js/common/myContainer.js';
import MyTableList from 'js/common/myTableList.js';
import Recommends from './recommends';
import { message, Button } from 'antd';

(() => {
  let courseInfo = {};
  let cover = '';
  $('.imgDiv').click(function () {
    cover = $(this).children('img').attr('src');
    $('.imgDiv').children('.imgbg,.selectImg').css('display', 'none');
    $(this).children('.imgbg,.selectImg').css('display', 'block');
  });
  $('.imgDiv').eq(0).click();
  let url = location.href;
  let specialId = '';
  if (url.indexOf('specialId=') != -1) {
    specialId = url.substr(url.indexOf('specialId=') + 10, url.length);
  }
  let spname = $('.spname');
  $('.namelength').html(spname.val().length + '/15');
  spname.on('input', () => {
    $('.namelength').html(spname.val().length + '/15');
  })

  let imgUpload = ReactDom.render(
    <ImgUpload />,
    document.querySelector('.spBgImg')
  );

  let searchData = [{
    state: {},
    curPage: 1,
    limit: 5
  }];
  let limit = 5;
  let thStyle = {
    'textAlign': 'left'
  }

  let page_url = "/cms/sepcailCourseCount";
  let data_url = "/cms/sepcailCourse";

  function addCourse(mrow) {
    if(!mrow.price) {
      mrow.price = 0;
    }
    let ex = false;
    let partIdx = parseInt($('.partNum').html());
    courses.state.chapter[partIdx].courses.map((val, idx) => {
      if (mrow._id == val.id) {
        ex = true;
      }
    });
    if (!ex) {
      let chapter = courses.state.chapter;
      let otherEx = false;
      chapter.map((val, idx) => {
        if (idx != partIdx) {
          let course = val.courses;
          course.map((vals, indx) => {
            if (mrow._id == vals.id) {
              otherEx = true;
            }
          });
        }
      });
      if (!otherEx) {
        courses.state.totalPrice += Number(mrow.price) * 1000;
        $('.totalPrice').html(courses.state.totalPrice / 1000 + '元');
        let cours = {};
        cours.id = mrow._id;
        cours.name = mrow.name;
        cours.cover = mrow.cover;
        cours.favoriteCount = mrow.favoriteCount;
        cours.description = mrow.description;
        cours.usePeriod = mrow.usePeriod;
        cours.price = mrow.price;
        courses.state.chapter[partIdx].courses.push(cours);
        courses.setState({ chapter: courses.state.chapter });
      } else {
        if (confirm('您已在该专题中添加了此课程，是否再次添加？')) {
          courses.state.totalPrice += mrow.price * 1000;
          $('.totalPrice').html(courses.state.totalPrice / 1000 + '元');
          let cours = {};
          cours.id = mrow._id;
          cours.name = mrow.name;
          cours.cover = mrow.cover;
          cours.favoriteCount = mrow.favoriteCount;
          cours.description = mrow.description;
          cours.usePeriod = mrow.usePeriod;
          cours.price = mrow.price;
          courses.state.chapter[partIdx].courses.push(cours);
          courses.setState({ chapter: courses.state.chapter });
        }
      }
      message.success('添加成功!');
    }

  }
  let courselist = ReactDom.render(
    <MyContainer searchData={searchData} limit={limit}>
      <MyTableList showHeader={true} showIcon={true} myBtn={"addCourse"} myClick={addCourse} doPage={true} page_url={page_url} loadModels={true} data_url={data_url}>
        <th dataField="cover" type="img" style={thStyle}>课程名称</th>
        <th dataField="name" type="text" style={thStyle}></th>
        <th dataField="usePeriod" type="text" style={thStyle}>课程有效期</th>
        <th dataField="price" type="text" style={thStyle}>价格</th>
        <th dataField="operation" type="btn" style={thStyle}>操作</th>
      </MyTableList>
    </MyContainer>,
    document.querySelector('.courselist')
  );
  // $('.recAll').html('全部(' + courselist.state.dataCount + ')');

  $.ajax({
    url: '/cmList',
    type: 'get',
    async: false,
    success: (list) => {
      if (list[0].values.length > 0) {
        list[0].values.map((val, idx) => {
          $('.courList').append(`<option value=${val.name}>${val.name}</option>`);
        });
      }
    }
  });

  $('.courList').on('change', function () {
    searchData[0].state = {};
    let selC = $(this).val();
    if (selC != '所有分类') {
      searchData[0].state.classify = selC;
    } else {
      delete searchData[0].state.classify;
    }
    courselist.setState({ searchData, curPage: 1, init: true });
    $('.recAll').html('全部(' + courselist.state.dataCount + ')');
  });

  $('.selBtn').click(() => {
    searchData[0].state = {};
    let nameKey = $('.keyVal').val();
    if (nameKey != '') {
      searchData[0].state.name = nameKey;
    } else {
      delete searchData[0].state.name;
    }
    courselist.setState({ searchData, curPage: 1, init: true });
    // $('.recAll').html('全部(' + courselist.state.dataCount + ')');
  });

  let courses = ReactDom.render(
    <CourseList />,
    document.querySelector('.partList')
  );

  let recom = ReactDom.render(
    <Recommends />,
    document.querySelector('.recSpecial')
  );

  let searchInfo = [{
    state: {},
    curPage: 1,
    limit: 5
  }];
  let lim = 5;
  let thCss = {
    'textAlign': 'left'
  }

  let pageUrl = "/cms/sepcailExpertCount";
  let dataUrl = "/cms/sepcailExpert";

  function addRecom(mrow) {
    if (recom.state.expert.length < 3) {
      let ex = false;
      recom.state.expert.map((val, idx) => {
        if (mrow._id == val.id) {
          ex = true;
        }
      });
      if (!ex) {
        let expert = {};
        expert.id = mrow.userId;
        expert.name = mrow.name;
        expert.lifePhoto = mrow.lifePhoto;
        expert.professionalTitle = mrow.professionalTitle;
        expert.briefDescription = mrow.briefDescription;
        recom.state.expert.push(expert);
        recom.setState({ expert: recom.state.expert });
      }
    }
  }
  let recomlist = ReactDom.render(
    <MyContainer searchData={searchInfo} limit={lim}>
      <MyTableList showHeader={true} showIcon={true} myBtn={"addRecom"} myClick={addRecom} doPage={true} page_url={pageUrl} loadModels={true} data_url={dataUrl}>
        <th dataField="lifePhoto" type="img" style={thCss}>讲师照片</th>
        <th dataField="name" type="text" style={thCss}>姓名</th>
        <th dataField="professionalTitle" type="text" style={thCss}>职称</th>
        <th dataField="operation" type="btn" style={thCss}>操作</th>
      </MyTableList>
    </MyContainer>,
    document.querySelector('.recomlist')
  );

  $('.recBtn').click(function () {
    let keyname = $('.recKey').val();
    if (keyname != '') {
      searchInfo[0].state.name = keyname;
    } else {
      delete searchInfo[0].state.name;
    }
    recomlist.setState({ searchInfo, curPage: 1, init: true });
  });

  $('.addReclose').click(() => {
    $('.addCourseBG').hide();
    $('.addRecomBox').hide();
  });

  $('.courseHead .addClose').click(() => {
    $('.addCourseBG').hide();
    $('.addCourseBox').hide();
  });

  function getSpecial() {
    courseInfo.templet = $('input[name="modelSelect"]:checked').val();
    courseInfo.background = imgUpload.state.url;
    courseInfo.backgroundColor = $('.bgColor').val() == '' ? '#FFFFFF' : $('.bgColor').val();
    courseInfo.totalPrice = courses.state.totalPrice / 1000;
    courseInfo.name = $('.spname').val();
    courseInfo.collectionPrice = isNaN(parseFloat($('.price').val())) ? 0 : parseFloat($('.price').val());
    courseInfo.state = 0;
    let urlhref = window.location.href;
    urlhref = urlhref.substr(urlhref.indexOf('//') + 2, urlhref.length);
    urlhref = urlhref.substr(0, urlhref.indexOf('/'));
    urlhref = urlhref + '/special/';
    courseInfo.link = urlhref;
    courseInfo.expert = recom.state.expert;
    courseInfo.chapter = courses.state.chapter;
    // courseInfo.isRecommend = true;
    courseInfo.cover = cover;
  }

  function addSpecial() {
    $.ajax({
      url: '/cms/specialAdd',
      type: 'get',
      data: {
        special: courseInfo,
      },
      success: (data) => {
        if (data) {
          alert('保存成功!');
          window.location.href = '/cms/specialManage';
        }
      },
      error: (err) => {
        console.log('error: ', err);
      },
    });
  }

  function updateSpecial() {
    $.ajax({
      url: '/cms/specialupdate',
      type: 'get',
      data: {
        special: courseInfo,
      },
      success: (data) => {
        if (data.ok) {
          alert('保存成功!');
          window.location.href = '/cms/specialManage';
        }
      },
      error: (err) => {
        console.log('error: ', err);
      },
    });
  }

  if (specialId != '') {
    $.ajax({
      url: '/cms/specials',
      type: 'get',
      data: {
        state: {
          _id: specialId,
        },
        curPage: 1,
        limit: 1,
      },
      success: (data) => {
        data = data[0];
        $('input[name="modelSelect"]').each(function () {
          if ($(this).val() == data.templet) {
            $(this).click();
          }
        });

        $('.spname').val(data.name);

        $('.imgDiv').each(function () {
          if ($(this).children('img').attr('src') == data.cover) {
            $(this).click();
          }
        });

        $('.upImg').attr('src', data.background);
        let uploadOption = imgUpload.state;
        uploadOption.url = data.background;
        imgUpload.setState({ uploadOption });
        imgUpload.reload();

        $('.bgColor').val(data.backgroundColor);

        let priceAll = 0;
        if (data.chapter.length > 0) {
          data.chapter.map((val, idx) => {
            val.courses.map((value, index) => {
              priceAll += Number(isNaN(parseFloat(value.price)) ? 0 : parseFloat(value.price)) * 1000;
            });
          });
        }
        courses.setState({ totalPrice: priceAll, chapter: data.chapter });

        $('.totalPrice').html(courses.state.totalPrice / 1000 + '元');

        recom.setState({ expert: data.expert });

        $('.price').val(data.collectionPrice);
      },
    });

    $('.release').click(() => {
      getSpecial();
      courseInfo._id = specialId;
      updateSpecial();
    });

    $('.draft').click(() => {
      getSpecial();
      courseInfo._id = specialId;
      courseInfo.state = 1;
      updateSpecial();
    });
  } else {
    $('.addClass').click();
    $('.release').click(() => {
      getSpecial();
      addSpecial();
    });

    $('.draft').click(() => {
      getSpecial();
      courseInfo.state = 1;
      addSpecial();
    });
  }

  //预览
  $('.look').click(() => {
    function dellook() {
      $.ajax({
        url: '/cms/dellook',
        type: 'get',
        async: false,
        success: (data) => {
        },
      });
    }
    dellook();
    getSpecial();
    courseInfo.state = 2;
    let linkurl = '';
    let spId = '';
    $.ajax({
      url: '/cms/speciallook',
      type: 'get',
      async: false,
      data: {
        special: courseInfo,
      },
      success: (data) => {
        linkurl = '/special/' + data._id;
      },
    });
    window.open(linkurl);

  });
})()