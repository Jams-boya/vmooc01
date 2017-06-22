import _ from 'lodash';
import bootbox from 'bootbox/bootbox.min.js';
import bootstrap from 'bootstrap/dist/js/bootstrap';
import moment             from 'moment';
import MyNotify           from 'js/common/MyNotify';
import RC_MyForm          from 'js/common/myform/myform';
import RC_MyInput         from 'js/common/myform/myinput';
import RC_MyStatic        from 'js/common/myform/mystatic';
import RC_MyTextArea      from 'js/common/myform/mytextarea';
import RC_MyUploader      from 'js/common/RC_MyUploader';
import React              from 'react';
import ReactDom           from 'react-dom';
import RC_MyTable, {RC_MyTableHeaderColumn} from 'js/common/mytable/mytable';

import Head from '../teacherlist/head';
import RC_Search    from '../teacherlist/search';

bootbox.setLocale('zh_CN');

(() => {
  let list, search, details;

  function setTime(row, data) {
    return moment(row).format('YYYY-MM-DD HH:mm');
  }

  function skilled(row) {
    return _.join(row, ',');
  }

  const column = [
    (<RC_MyTableHeaderColumn
      dataField='createAt'
      title={"认证时间"}
      displayChange={setTime}
      width="10%">
    </RC_MyTableHeaderColumn>),
    (<RC_MyTableHeaderColumn
      dataField='name'
      title={"讲师姓名"}
      width="20%">
    </RC_MyTableHeaderColumn>),
    (<RC_MyTableHeaderColumn
      dataField='professional'
      title={"讲师职称"}
      width="10%">
    </RC_MyTableHeaderColumn>),
    (<RC_MyTableHeaderColumn
      dataField='phone'
      title={"联系方式"}
      width="20%">
    </RC_MyTableHeaderColumn>),
    (<RC_MyTableHeaderColumn
      dataField='email'
      title={"讲师邮箱"}
      width="15%">
    </RC_MyTableHeaderColumn>),
    (<RC_MyTableHeaderColumn
      dataField='domain'
      title={"来源"}
      width="15%">
    </RC_MyTableHeaderColumn>),
    (<RC_MyTableHeaderColumn
      isOpr={true}
      customizeOpr={[
        { code: 'view', title: '查看', },
        { code: 'disable', title: '禁用', filter: (m) => [1].indexOf(m.state) !== -1 },
        { code: 'open', title: '开启', filter: (m) => [3].indexOf(m.state) !== -1 },
      ]}
      title={"操作"}
      width="10%">
    </RC_MyTableHeaderColumn>)
  ];

  const operation = function (code, row, idx, target, rcTable) {
    if (code === 'view') {
      $('#list').hide();
      $('#details').show();

      if (row.professional === "") {
        row.professional = "该讲师还未填写职称";
      } 

      details.val(row);
    } else if (code === 'disable') {
      bootbox.dialog({
        message: `禁用讲师帐号后，Ta将不能使用讲师端的所有功能，您确定要禁用${row.name}的讲师帐号？`,
        title: '提示',
        buttons: {
          default: {
            label: "否",
            className: "btn-default",
            callback: function () {
            }
          },
          success: {
            label: "是",
            className: "btn-success",
            callback: function () {
              $('#detailsIdx').val(idx);
              isFree(3, row._id);
            }
          }
        }
      });

    } else if (code === 'open') {
      bootbox.dialog({
        message: '开启讲师帐户后，Ta将能重新使用讲师端的所有功能，您确定要开启?',
        title: '提示',
        buttons: {
          default: {
            label: "否",
            className: "btn-default",
            callback: function () {
            }
          },
          success: {
            label: "是",
            className: "btn-success",
            callback: function () {
              $('#detailsIdx').val(idx);
              isFree(1, row._id);
            }
          }
        }
      });
    }
  }
  function isFree(num, id) {
    $.ajax({
      url: '/teacherApply/employ',
      type: 'post',
      data: { num, id },
      success: function (data) {
        list.confirmEdit(data, Number($('#detailsIdx').val()));
        if (num === 3) {
          MyNotify.info('禁用成功');
        } else {
          MyNotify.info('开启成功');
        }
      },

      error: function (xhr, status, err) {
        console.error(status, err.toString());
      }
    });
  }

  list = ReactDom.render(
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
    let rule = [1, 3];
    list.loadModels(`/teachersign/searchList?val=${val}&rule=${rule}`);
    return false;
  }
  onSearch("");
  search = ReactDom.render(
    <RC_Search onSearch={onSearch}></RC_Search>,
    document.getElementById('search')
  );
  details = ReactDom.render(
    <RC_MyForm clos="3">
      <RC_MyInput field="_id" label="_id" type="hidden" ></RC_MyInput>
      <Head field="email" label="邮箱:" label1="昵称:" field1="nickName" 
      field2="createAt" label2="注册时间:" field3="updateAt" label3="认证时间:"></Head>
      <RC_MyStatic field="name" label="姓名:" type="text"></RC_MyStatic>
      <RC_MyStatic field="phone" label="联系电话:" type="text"></RC_MyStatic>
      <RC_MyStatic field="professional" label="职称:" type="text" ></RC_MyStatic>
      <RC_MyStatic field="skilled" label="擅长:" type="text"   displayChange={skilled}></RC_MyStatic>
      <RC_MyStatic field="myself" label="自我介绍:" ></RC_MyStatic>
    </RC_MyForm>,
    document.getElementById('tearcherDetails')
  );
  $('#cancel').on('click', function () {
    $('#list').show();
    $('#details').hide();
  })


})();