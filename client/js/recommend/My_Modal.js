/** 选择器 */
import {Modal, Button, Tabs, Tab} from 'react-bootstrap';
import React, {Component} from 'react';
import RC_MyTable, {RC_MyTableHeaderColumn} from 'js/common/mytable/mytable';
import MyNotify from 'js/common/MyNotify.js';
class My_Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {show: true};
    this.state.title = this.props.title;
    this.state.dialogClassName = this.props.dialogClassName || "custom-modal";
    this.state.key = 1;
    this.state.allCount = 0;
    this.state.name = "";
    this.state.recommmendCount = 0;
    this.state.step = 'all';
  }

  showModal() {
    this.setState({show: true});
  }

  hideModal() {
    this.setState({show: false});
  }

  handleSelect(key) {
    this.setState({key});

    if (key === 1) {
      this.getAll();
    }

    if (key === 2) {
      this.getRecommend();
    }
  }

  /** mytable 操作栏 */
  onCustomizeOpr(code, row, idx, target, rcTable) {

    if (this.state.recommmendCount >= this.props.limitCount)
      return MyNotify.warn("推荐数已达上限");
    // 更改推荐
    $.post(this.props.recommendUrl, {cId: row._id, isRecommend: code}, (result) => {
      if (result && result._id) {
        rcTable.confirmEdit(result, idx);
        const info = code === "recommend" ? "推荐成功" : "取消成功";
        this.getCount();
        console.log('----', this.state.key);
        if (code === "cancelrecommend" && this.state.key === 2)
          rcTable.confirmDel(result, idx);
        return MyNotify.success(info);
      }
      return MyNotify.warn("错误，请刷新重试！");
    });
  }

  /** 查询推荐**/
  onSearch(val) {
    this.state["name"] = val.keyword || "";
    this.getAll(val);
  }

  /** 获取数量 */
  getCount() {
    $.get(`${this.props.getCountUrl}?isRecommend=true`, (count) => {
      this.setState({recommmendCount: count});
    });
  }

  /** 读取全部 */
  getAll() {
    let url = `${this.props.loadAllUrl}?name=${this.state["name"]}`;
    this.getCount();
    this.refs.all.loadModels(url, {}, () => {
      this.setState({allCount: this.refs.all.state.pagination.totalCount});
    });
  }

  /** 读取推荐 */
  getRecommend() {
    let url = this.props.loadRecommendUrl;
    this.getCount();
    this.refs.recommend.loadModels(url, {}, () => {
      this.setState({recommmendCount: this.refs.recommend.state.pagination.totalCount});
    });
  }

  render() {
    /** 搜索框 */
    let search_children = React.Children.map(this.props.children, (child, idx) => {
      return React.cloneElement(
        child,
        {
          key: idx,
          ref: `search`,
          onSearch : this.onSearch.bind(this)
        }
      );
    });

    /** 遍历表头 */
    let tableColumn = this.props.tableColumn.map((col, idx) => {
      return (<RC_MyTableHeaderColumn 
                key={idx}
                dataField= {col.field} 
                title={col.title}
                width="20%">
              </RC_MyTableHeaderColumn>);
    });

    /** 添加操作栏 */
    tableColumn.push((
      <RC_MyTableHeaderColumn 
        key={9}
        isOpr={true} 
        customizeOpr={[
          {code: 'recommend', title: '推荐', filter: (r) => {if(!r.isRecommend) return true;}}, 
          {code: 'cancelrecommend', title: '取消推荐', filter: (r) => {if(r.isRecommend) return true;}},
        ]}
        title={"操作"}
        width="10%">
      </RC_MyTableHeaderColumn>
    ));

    
    return (
      <div>
        <Modal
          {...this.props}
          show = {this.state.show}
          onHide = {this.hideModal.bind(this)}
          dialogClassName = {this.state.dialogClassName}
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-lg">{this.state.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            
            <div className = "row">
              <div className = "col-md-12">
                {search_children}
              </div>
            </div>

            <div className = "row">
              <div className = "col-md-12">
                <Tabs activeKey={this.state.key} onSelect={this.handleSelect.bind(this)} id="controlled-tab-example">
                  <Tab eventKey={1} title={`全部(${this.state.allCount})`}>
                     <RC_MyTable 
                      url='' 
                      bodyHeight='auto' 
                      keyField='_id' 
                      limit={10}
                      paging={true} 
                      ref = "all"
                      onCustomizeOpr = {this.onCustomizeOpr.bind(this)}
                    > 
                    {tableColumn}
                    </RC_MyTable>
                  </Tab>
                  <Tab eventKey={2} title={`推荐(${this.state.recommmendCount})`}>
                    <RC_MyTable 
                      url='' 
                      bodyHeight='auto' 
                      keyField='_id' 
                      limit={10}
                      paging={true}
                      ref = "recommend"
                      onCustomizeOpr = {this.onCustomizeOpr.bind(this)} 
                    > 
                    {tableColumn}
                    </RC_MyTable>
                  </Tab>
                </Tabs>
              </div>
            </div>
            
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.hideModal.bind(this)}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default My_Modal;