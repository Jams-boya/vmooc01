import './index.css';
/** 推介位管理 */
import 'bootstrap/dist/js/bootstrap.min.js';
import React from 'react';
import ReactDom from 'react-dom';
import RC_MyTable, {RC_MyTableHeaderColumn} from 'js/common/mytable/mytable';
import MyDetailSearchBar from 'js/common/MyDetailSearchBar';
import RC_MyForm from 'js/common/myform/myform';
import RC_MyInput from 'js/common/myform/myinput';
import RC_MySelect from 'js/common/myform/myselect';
import RC_MyRangeCalendar from 'js/common/myform/myrangecalendar';
import MyNotify from 'js/common/MyNotify.js';
import common from 'js/common/common.js';
import recommon from './common.js';
import MyUploadPic from './My_FocusPic';
import MyModal from './My_Modal';
(() => {
  let approvalRule;
  const _domOp = document.getElementById("test");
	/** onSearch 搜索 */
	function onSearch(search_con) {
    dataTbl.loadModels(`/getrecommend?page=${search_con}`);
	}

  /** 显示操作层 */
  function showoption(tittle) {
    $("#cms_recommend_opcontent").show();
    $("#cms_recommend_opcontent").find(".op_title").html(tittle);
    $("#cmscontent").hide();
  }

  /** 返回上一步 */
  $(".prebtn").on("click",function () {
    $("#cms_recommend_opcontent").hide();
    $("#cmscontent").show();
  });

  //操作栏 操作
  const onCustomizeOpr = function onCustomizeOpr(code, row, idx, target, rcTable) {
    if (code === "manage") {
      const module = row.module; //对应模块
      if (module === "pic") {
        showoption(row.name);
        $.get("/cms/focuspic", {platform: "lcpsp"}, (result) => {
          ReactDom.render(
            <MyUploadPic value = {result.pics || []}>
            </MyUploadPic>,
            _domOp
          );
        });
      }

      if (module === "course") {
        ReactDom.unmountComponentAtNode(_domOp);
        let _mymodal = ReactDom.render(
          <MyModal 
            show = {true}
            title = {row.name}
            limitCount = {6}
            dialogClassName = {"recommendmodal"}
            loadAllUrl = {"/cms/getallcourses"}
            loadRecommendUrl = {"/cms/getallcourses?isRecommend=true"}
            getCountUrl = {"/cms/getcoursescount"}
            recommendUrl = {"/cms/applyrecommendcourse"}
            tableColumn = {[{field: "name", title: "课程名称"}, {field: "usePeriod", title: "课程有效期"}, {field: "price", title: "课程单价"}]}
          >
            <MyDetailSearchBar
              coordinate = {"search"}
              hideDetail = {true}
              placeholder=''
            >
            </MyDetailSearchBar>
          </MyModal>,
           _domOp);
        _mymodal.getAll("");
      }
      if (module === "coursecollection") {
        ReactDom.unmountComponentAtNode(_domOp);
        let _mymodal = ReactDom.render(
          <MyModal 
            show = {true}
            title = {row.name}
            limitCount = {10}
            dialogClassName = {"recommendmodal"}
            loadAllUrl = {"/cms/getallcoursecollection"}
            loadRecommendUrl = {"/cms/getallcoursecollection?isRecommend=true"}
            getCountUrl = {"/cms/getcoursecollectioncount"}
            recommendUrl = {"/cms/applyrecommendcoursecollection"}
            tableColumn = {[{field: "coverss", title: "专题封面"}, {field: "name", title: "专题名称"}]}
          >
            <MyDetailSearchBar
              coordinate = {"search"}
              hideDetail = {true}
              placeholder=''
            >
            </MyDetailSearchBar>
          </MyModal>,
           _domOp);
        _mymodal.getAll("");
      }

      if (module === "expert") {
        ReactDom.unmountComponentAtNode(_domOp);
        let _mymodal = ReactDom.render(
          <MyModal 
            show = {true}
            title = {row.name}
            limitCount = {4}
            dialogClassName = {"recommendmodal"}
            loadAllUrl = {"/cms/getallexperts"}
            loadRecommendUrl = {"/cms/getallexperts?isRecommend=true"}
            getCountUrl = {"/cms/getexpertscount"}
            recommendUrl = {"/cms/applyrecommendexpert"}
            tableColumn = {[{field: "lifePhoto", title: "讲师照片"}, {field: "name", title: "姓名"}, {field: "professionalTitle", title: "职称"}]}
          >
            <MyDetailSearchBar
              coordinate = {"search"}
              hideDetail = {true}
              placeholder=''
            >
            </MyDetailSearchBar>
          </MyModal>,
           _domOp);
        _mymodal.getAll("");
      }

    }
  }

  function searchByPage(formData, upData) {
    if (upData && upData.page) {
      onSearch(upData.page);
    }
  }
	/** 详细搜索 */
	ReactDom.render(
	    <RC_MyForm cols="4" onHandleChange={searchByPage}>
        <RC_MySelect 
	        labelfield="pagelabel"
          labelClassName="text-left"
          key = {1} 
          valuefield="page"
	        label="所属页面" 
	        placeholder=""
	        multi= {false} 
	        options={[{value: 'home', label: "首页"}]}
        ></RC_MySelect>
	    </RC_MyForm>,
	  document.getElementById('searchBar')
	);

	/** 数据结果 */
	let dataTbl;

	//表格头部
	const tablecolumn = [
    (<RC_MyTableHeaderColumn 
      key={1}
      dataField='name' 
      sortable={true}
      title={"广告位"}
      width="10%">
    </RC_MyTableHeaderColumn>),
    (<RC_MyTableHeaderColumn 
      key={3}
      dataField='page' 
      sortable={true}
      title={"所属页面"}
      displayChange={recommon.pageLabel}
      width="10%">
    </RC_MyTableHeaderColumn>),
    (<RC_MyTableHeaderColumn 
      key={4}
      dataField='upUserName' 
      sortable={true}
      title={"修改人"}
      width="10%">
    </RC_MyTableHeaderColumn>),
    (<RC_MyTableHeaderColumn 
      key={5}
      dataField='updateAt' 
      sortable={true}
      displayChange={common.simpleDateFormat}
      title={"修改时间"}
      width="10%">
    </RC_MyTableHeaderColumn>),
    (<RC_MyTableHeaderColumn 
      key={9}
      isOpr={true} 
      customizeOpr={[
        {code: 'manage', title: '管理'}, 
      ]}
      title={"操作"}
      width="10%">
    </RC_MyTableHeaderColumn>)
  ];

	dataTbl = ReactDom.render(
    <RC_MyTable 
      url='' 
      bodyHeight='auto' 
      keyField='_id' 
      limit={10}
      paging={true} 
      onCustomizeOpr={onCustomizeOpr}
    > 
    {tablecolumn}  
    </RC_MyTable>, 
    document.getElementById('dataTable')
  ); 
  onSearch("");
})()