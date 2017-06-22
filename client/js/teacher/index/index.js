import 'bootstrap/dist/js/bootstrap.min.js';

import '../css/gloab.css';
import '../css/index.css';

import moment from 'moment';
import MyNotify from 'js/common/MyNotify';
import RC_MyForm from 'js/common/myform/myform';
import RC_MyInput from 'js/common/myform/myinput';
import RC_MyTextArea from 'js/common/myform/mytextarea';
import React from 'react';
import ReactDom from 'react-dom';

import RC_MyCheckbox from '../checkboxgroup';

(() => {
  let signForm;
  // 提交提示div
  function steps() {
    $('#list').hide();
    $('#notpass').hide();
    $('#audit').hide();
    $('#pass').hide();
    $('#submit').show();
    $('.step').show();
    $('#steps1').removeClass('on');
    $('#steps3').removeClass('on');
    $('#steps2').addClass('on');
  }
  // 未通过div
  function notpass() {
    $('#list').hide();
    $('#submit').hide();
    $('#audit').hide();
    $('#pass').hide();
    $('.step').show();
    $('#notpass').show();

    $('#steps1').removeClass('on');
    $('#steps3').removeClass('on');
    $('#steps2').addClass('on');
  }
  // 审核中div
  function audit() {
    $('#list').hide();
    $('#submit').hide();
    $('#notpass').hide();
    $('#pass').hide();
    $('#audit').show();
    $('.step').show();
    $('#steps1').removeClass('on');
    $('#steps2').addClass('on');
    $('#steps3').removeClass('on');
  }

  function pass() {
    $('#list').hide();
    $('#submit').hide();
    $('#notpass').hide();
    $('#audit').hide();
    $('#pass').show();
    $('.step').show();
    $('#steps1').removeClass('on');
    $('#steps2').removeClass('on');
    $('#steps3').addClass('on');
  }

  if (teacher) {
    if (teacher.state === 2) {
      notpass();
    } else if (teacher.state === 0) {
      audit();
    } else if (teacher.state === 1) {
      pass();
      $('#jumpUrl').show();
      var i = 5;
      var intervalid;
      function fun() {
        if (i == 0) {
          window.location.href = "/courseManage";
          clearInterval(intervalid);
        }
        document.getElementById("time").innerHTML = i;
        i--;
      }
      intervalid = setInterval(function () { fun() }, 1000);
    } else if (teacher.state === 3) {
      $('#disableTacher').show();
      $('.step').hide();
    }

  } else {
    $('.step').show();
    $('#list').show();
    $('#steps1').addClass('on');
    $('#steps3').removeClass('on');
    $('#steps2').removeClass('on');
  }
  $('#againsubmit').on('click', (e) => {
    $('#steps2').removeClass('on');
    $('#steps3').removeClass('on');
    $('#steps4').removeClass('on');
    $('#steps1').addClass('on');
    $('.step').show();
    $('#list').show();
    $('#submit').hide();
    $('#notpass').hide();
    $('#pass').hide();
    signForm.val(teacher);
  });
  $.ajax({
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    url: '/gettype',
    data: { type: "课程类型" },
    type: 'GET',
    success: (data) => {
      signForm = ReactDom.render(
        <RC_MyForm cols="1">
          <RC_MyInput field="name" label="* 姓名" type="text"></RC_MyInput>
          <RC_MyInput field="phone" label="* 联系电话" type="text" defaultValue={guser.phone}></RC_MyInput>
          <RC_MyCheckbox field='type' label="* 擅长" type={data[0]}> </RC_MyCheckbox>
          <RC_MyTextArea field="myself" label="* 自我介绍" type="text" rows="4"> </RC_MyTextArea>
        </RC_MyForm>,
        document.getElementById('signFrom')
      );
    },
    error: function (xhr, status, err) {
      console.error(status, err.toString());
    }
  });


  // 提交
  $('#save').on('click', () => {
    let items = signForm.state.data;
    let {name, phone, myself} = items;

    if (!name) {
      return MyNotify.warn('姓名不能为空');
    } else if (!phone) {
      return MyNotify.warn('联系电话不能为空');
    } else if (!items.type) {
      return MyNotify.warn('课程类型必须选择一类');
    } else if (!myself) {
      return MyNotify.warn('自我介绍不能为空');
    }

    let type = [];
    items.type.map((val, idx) => {
      console.log(val);
      val.checked && type.push(val.name);
    });

    if (!type.length) {
      return MyNotify.warn('课程类型必须选择一种');
    }
    let content = {
      name: name,
      phone: phone,
      skilled: type,
      myself: myself,
    };
    $.ajax({
      url: '/teachersign/add',
      data: { content },
      type: 'POST',
      success: (data) => {
        if (data._id !== "") {
          MyNotify.info("提交成功，请等待平台审核");
          signForm.clear();
          steps();
        }
      },
      error: function (xhr, status, err) {
        MyNotify.info("网络不正常", err.toString());
      }
    });
  });

})();




