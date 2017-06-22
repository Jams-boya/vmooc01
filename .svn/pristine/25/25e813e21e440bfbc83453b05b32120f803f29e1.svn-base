import _ from 'lodash';
import React, {Component} from 'react';
import ReactDom from 'react-dom';

/**
 * 分页容器组件
 * @author: bs
 * @params searchData 数组，按子组件顺序来传入对应的筛选条件
 * @params page_url String 分页器获取总分页数的路由
 * @params loadModels Boolen 子组件是否要加载相应数据
 * @params doPage Boolen 子组件是否要分页获取数据（只能有一个子组件分页）
 * @params data_url String 子组件获取填充数据的路由
 */
class MyContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      curPage    : 1,
      pageCount  : 0,
      limit      : this.props.limit || 12,
      searchData : this.props.searchData,
      init       : true,
      resultData : null,
      children   : null,
      dataCount: 0,
    };
  }

  //处理传入的子组件
  attachSortFunc() {
    let children = React.Children.map(this.props.children, (child, idx) => {
      if (child.props.loadModels) {
        this.loadModels(child, idx);
        return React.cloneElement(
          child,
          {
            key  : idx,
            data : this.state.resultData
          }
        );
      } else {
        return React.cloneElement(
          child,
          {
            key  : idx,
          }
        );
      }
    });

    this.state.children = children;
  }

  //处理子组件数据
  loadModels(child, idx) {
    if (child.props.doPage) {
      this.state.searchData[idx].curPage = this.state.curPage;

      if (this.state.pageCount == 0 || this.state.init) {
        this.getPageCount(child.props.page_url);
      }
    }
    //console.log("childprops", child.props.searchData.curPage, this.state.curPage);
    //路由处理
    // let url = this.state.data_url;
    // let separator = url.indexOf('?') < 0 ? '?' : '&';
    // let sortOrder = sort.order === 'asc' ? encodeURIComponent('+') : '-';
    // let sortField = sort.field ? `&sort=${sortOrder}${sort.field}` : '';
    // url = `${url}${separator}limit=${pagination.limit}&offset=${pagination.offset}`;
    //console.log("render", this.state.searchData);
    $.ajax({
      url  : encodeURI(child.props.data_url),
      type : 'get',
      async: false,
      data : this.state.searchData[idx],
      success: (data) => {
        this.state.resultData = data;
      },
        
    });
  }

  //获取总行数
  getPageCount(url, searchData = {}) {
    let page = 1;
    if (!url) { 
      console.log("路由不存在");
      return;
    }
    let separator = url.indexOf('?') < 0 ? '?' : '&';
    let url_count = `${url}${separator}limit=${this.state.limit}&curPage=${this.state.curPage}`;

    $.ajax({
      url  : encodeURI(url),
      type : 'get',
      async: false,
      data : this.state.searchData[0],
      success: (data) => {
        if (data.error) {
          return;
        }
        this.state.dataCount = Number(data);
        this.state.pageCount = Math.ceil(Number(data) / this.state.limit);
      },
        
    });
  }

  //点击翻页
  doPage(e) {
    e.preventDefault();
    this.state.init = false;
    var curPage = Number(e.target.id);
    this.state.curPage = curPage;
    this.setState({curPage : curPage});
  }

  //上下翻页
  turnPage(e) {
    e.preventDefault();
    var curPage = this.state.curPage;
    if (e.target.id == "next" && curPage + 1 <= this.state.pageCount) {
      this.setState({curPage : curPage + 1});
    }
    if (e.target.id == "prev" && curPage - 1 >= 1) {
      this.setState({curPage : curPage - 1});
    }
  }

  //生成分页组件 
  genPagination(pageCount) {
    let pagination = [];
    let curPage = this.state.curPage;
    // console.log(curPage);
    //根据总页数决定分页样式
    if (pageCount <= 6) {
      for (let idx = 1; idx <= pageCount; idx++) {
        pagination.push(<button type="button" key={idx} id={idx} onClick={this.doPage.bind(this)} className="btn btn-default">{idx}</button>);
      }
    } else {

      //根据当前页改变分页样式
      if (curPage <= 2) {
        curPage = 2;
      }

      //页尾分页样式
      if (curPage + 4 > pageCount) {
        pagination.push(<button type="button" key={pageCount - 6} id={pageCount - 6} onClick={this.doPage.bind(this)} className="btn btn-default">...</button>);
        for (let idx = pageCount - 4; idx <= pageCount; idx++) {
          if (this.state.curPage == idx) {
            pagination.push(<button type="button" key={idx} id={idx} style={{'boxShadow': '#666 2px 2px 10px', backgroundColor:'white'}} onClick={this.doPage.bind(this)} className="btn btn-default">{idx}</button>);
          } else {
            pagination.push(<button type="button" key={idx} id={idx} onClick={this.doPage.bind(this)} className="btn btn-default">{idx}</button>);
          }
        }
      } else {
        //页首、页中分页样式
        for (let idx = curPage - 1; idx <= pageCount; idx++) {
          if (idx <=  curPage + 1 || idx + 1 == pageCount || idx == pageCount) {
            if (this.state.curPage == idx) {
              pagination.push(<button type="button" key={idx} id={idx} style={{boxShadow: '#666 0px 0px 10px', backgroundColor:'white'}} onClick={this.doPage.bind(this)} className="btn btn-default">{idx}</button>);
            } else {
              pagination.push(<button type="button" key={idx} id={idx} onClick={this.doPage.bind(this)} className="btn btn-default">{idx}</button>);
            }
          } else if (idx == curPage + 2) {
            pagination.push(<button type="button" key="more" id={curPage + 2} onClick={this.doPage.bind(this)} className="btn btn-default">...</button>);
          }
        }
      }
    }
    //<button type="button" id="prev" className="btn btn-default" onClick={this.turnPage.bind(this)}>上一页</button>
    //<button type="button" id="next" className="btn btn-default" onClick={this.turnPage.bind(this)}>下一页</button>
    return (
      <div className="btn-group btn-group-sm">
        <button type="button" id="1" className="btn btn-default" onClick={this.doPage.bind(this)}>首页</button>
          {pagination}
        <button type="button" id={pageCount} className="btn btn-default" onClick={this.doPage.bind(this)}>尾页</button>
      </div>
    );
  }

  render() {

    //加载子组件及数据
    this.attachSortFunc();
    let pageStyle = {
      'marginLeft': '39%',
      'marginTop': '30px',
      'marginBottom': '25px'
    }
    pageStyle.display = this.state.pageCount == 0 ? 'none' : 'block';
    return (
      <div className="componentContainer">
        <div className="content">
          {this.state.children}
        </div>
        <div className="pagination" style={pageStyle}>
          {this.genPagination(this.state.pageCount)}
        </div>
      </div>
    );
  }
}



export default MyContainer;