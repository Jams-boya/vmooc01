/*
 * @Author: gaoshuai 
 * @Date: 2017-04-26 13:23:11 
 * @Last Modified by: gaoshuai
 * @Last Modified time: 2017-04-28 06:54:30
 * @content 课程详细
 */
import 'antd/lib/table/style';
import 'antd/dist/antd.min.css';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import { Table, Tooltip, Button, message } from 'antd';
import NewCode from './newCode';
import CodeDetail from './codeDetail';

class CodeTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courses: [],
      pagination: {
        current: 1,
        pageSize: 5,
        pageSizeOptions: ['5', '10', '15', '20'],
        total: 20,
        showSizeChanger: true,
        showQuickJumper: true,
        onShowSizeChange: (current, pageSize) => {
          this.pageChange(current, pageSize);
        },
        onChange: (current) => {
          this.pageChange(current);
        },
      },
      loading: false,
    }
  }

  pageChange = (current, pageSize) => {
    let { pagination } = this.state;
    pagination.current = pageSize ? 1 : current;
    pageSize ? pagination.pageSize = pageSize : null;
    this.setState({ pagination }, () => { 
      this.fetch();
    });
  }

  fetch = () => {
    this.setState({ loading: true });
    let filter = {
      teacherId: guser._id,
      state: 1
    }
    $.ajax({
      url: '/getCodeCourses',
      type: 'get',
      async: false,
      data: {
        filter,
        curPage: this.state.pagination.current,
        limit: this.state.pagination.pageSize,
      },
      success: (data) => {
        let { pagination } = this.state;
        pagination.total = data.count;
        this.setState({
          loading: false,
          courses: data.courses,
          pagination
        });
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  componentDidMount() {
    this.fetch();
  }

  onCreate = (id) => {
    this.newcode.showModal(id);
  }
  onCase = (id) => {
    this.codedetail.showModal(id);
  }
    
  columns = [{
    title: '课程封面',
    dataIndex: 'cover',
    width: '15%',
    render: (text, record, index) => {
      return (
        <img src={text} style={{ width: 100, height: 65, cursor: "pointer" }} onClick={() => window.location = `/course/${record._id}`} />
      )
    }
  }, {
    title: '课程信息',
    dataIndex: 'name',
    width: '25%',
    render: (text, record, index) => {
      return (
        <div>
          <p>{text}</p>
          <p style={{ color: "red" }}>￥{record.price}</p>
        </div>
      )
    }
  }, {
    title: '状态',
    dataIndex: 'state',
    width: '15%',
  }, {
    title: '操作',
    dataIndex: 'operation',
    width: '20%',
    render: (text, record, index) => {
      return (
        <div>
          <Button style={{ marginRight: 10 }}>
            <a href="#" onClick={this.onCreate.bind(null, record._id)}>生成优惠码</a>
          </Button>
          <Button>
            <a href="#" onClick={this.onCase.bind(null, record._id)}>查看使用情况</a>
          </Button>
        </div>
      )
    }
  }];

  render() {
    let columns = this.columns;
    return (
      <div>
        <NewCode ref={(rc) => this.newcode = rc} />
        <CodeDetail ref={(rc) => this.codedetail = rc} />
        <Table
          size="small"
          columns={columns}
          rowKey={record => record._id}
          dataSource={this.state.courses}
          pagination={this.state.pagination}
          loading={this.state.loading}
        />
      </div>
    );
  }
}
ReactDOM.render(
	<NewCode />,
	document.querySelector('#codeTab')
);

export default CodeTab;