import './index.css';

import _ from 'lodash';
import moment from 'moment';
import showuploader from 'js/common/webuploader/uploaderModel';
import MyNotify from 'js/common/MyNotify';
import RC_MyForm from 'js/common/myform/myform';
import RC_MyInput from 'js/common/myform/myinput';
import RC_MyStatic from 'js/common/myform/mystatic';
import RC_MyTextArea from 'js/common/myform/mytextarea';
import RC_MyUploader from 'js/common/RC_MyUploader';
import React from 'react';
import ReactDom from 'react-dom';
import RC_MyTable, { RC_MyTableHeaderColumn } from 'js/common/mytable/mytable';

import Head from './head';
import RC_Search from './search';

(() => {
  let teacherFrom;
  let search;
  let teacher;

  const column = [
    (<RC_MyTableHeaderColumn
      dataField='createAt'
      title={"申请时间"}
      displayChange={setTime}
      width="10%">
    </RC_MyTableHeaderColumn>),
    (<RC_MyTableHeaderColumn
      dataField='email'
      title={"邮箱"}
      width="20%">
    </RC_MyTableHeaderColumn>),
    (<RC_MyTableHeaderColumn
      dataField='name'
      title={"姓名"}
      width="10%">
    </RC_MyTableHeaderColumn>),
    (<RC_MyTableHeaderColumn
      dataField='phone'
      title={"联系方式"}
      width="15%">
    </RC_MyTableHeaderColumn>),
    (<RC_MyTableHeaderColumn
      dataField='skilled'
      displayChange={myselfval}
      title={"擅长领域"}
      width="15%">
    </RC_MyTableHeaderColumn>),
    (<RC_MyTableHeaderColumn
      dataField='domain'
      title={"来源"}
      width="10%">
    </RC_MyTableHeaderColumn>),
    (<RC_MyTableHeaderColumn
      dataField='state'
      title={"状态"}
      displayChange={chengevalue}
      width="10%">
    </RC_MyTableHeaderColumn>),
    (<RC_MyTableHeaderColumn
      isOpr={true}
      customizeOpr={[
        { code: 'edit', title: '讲师审核', filter: (m) => [0].indexOf(m.state) !== -1 },
      ]}
      title={"操作"}
      width="10%">
    </RC_MyTableHeaderColumn>)
  ];
  const operation = function (code, row, idx, target, rcTable) {

    if (code === 'edit') {
      $('#list').hide();
      $('#details').show();
      $('#detailsIdx').val(idx);

      row.avatar = row.user.Avatar;
      row.nickName = row.user.nickName;
      teacherFrom.val(row);
    }
  }

  teacher = ReactDom.render(
    <RC_MyTable
      url=''
      bodyHeight='auto'
      keyField='_id'
      limit={10}
      paging={true}
      onCustomizeOpr={operation}
      >
      {column}
    </RC_MyTable>,
    document.getElementById('tearcherlist')
  );

  function onSearch(val) {
    let rule = [0, 2];
    teacher.loadModels(`/teachersign/searchList?val=${val}&rule=${rule}`);
    return false;
  }
  onSearch("");

  search = ReactDom.render(
    <RC_Search onSearch={onSearch}></RC_Search>,
    document.getElementById('search')
  );
  // 详情列表
  teacherFrom = ReactDom.render(
    <RC_MyForm clos="3">
      <RC_MyInput field="_id" label="_id" type="hidden" ></RC_MyInput>
      <Head field="email" label="邮箱:" label1="昵称:" field1="nickName"></Head>
      <RC_MyStatic field="name" label="姓名:" type="text"></RC_MyStatic>
      <RC_MyStatic field="phone" label="联系电话:" type="text"></RC_MyStatic>
      <RC_MyInput field="professional" label="职称:" type="text" ></RC_MyInput>
      <RC_MyStatic field="skilled" label="擅长:" type="text" displayChange={skilled}></RC_MyStatic>
      <RC_MyStatic field="myself" label="自我介绍:" ></RC_MyStatic>

    </RC_MyForm>,
    document.getElementById('tearcherDetails')
  );
  // <RC_MyUploader type="image" describe="生活照:" field="lifePhoto" model="lifePhoto" display="block"></RC_MyUploader>
  // 通过
  $('#through').on('click', (e) => {
    let {data} = teacherFrom.state;
    if (!data.professional) {
      //return MyNotify.warn('请填写职称');
      data.professional = "";
    }
    funthrough(data.professional, 1);
  });
  // 不同过
  $('#notThrough').on('click', (e) => {
    funthrough('', 2);
  });
  function funthrough(pf, num) {
    let {data} = teacherFrom.state;
    $.ajax({
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      url: '/teachersign/through',
      type: 'get',
      data: {
        num: num,
        id: data._id,
        professional: pf
      },
      success: function (data) {
        if (data._id) {
          MyNotify.info('操作成功');
          // teacher.confirmEdit(data, Number($('#detailsIdx').val()));
          onSearch("");
          $('#list').show();
          $('#details').hide();
        } else {
          return MyNotify.warn('操作失败');
        }
      },
      error: function (xhr, status, err) {
        console.error(status, err.toString());
      }
    });
  }
  function setTime(row, data) {
    return moment(row).format('YYYY-MM-DD');
  }

  function myselfval(row, data) {
    let str;
    if (row.length > 3) {
      str = _.slice(row, 0, 3);
      str = _.join(str, ',');
    } else {
      str = _.join(row, ',');
    }
    return str;
  }

  function skilled(row) {
    return _.join(row, ',');
  }

  function chengevalue(row, data) {
    switch (row) {
      case 0:
        return "未审核";
      case 1:
        return "审核通过";
      case 2:
        return "审核不通过";
    }
  }

})();
