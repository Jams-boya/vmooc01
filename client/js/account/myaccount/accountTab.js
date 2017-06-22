import 'antd/lib/table/style';
import 'antd/dist/antd.min.css';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import { Table, Tooltip, Button, message, Popover } from 'antd/dist/antd.min.js';
import common from './common';

class AccountTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: [],
      pagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['5', '10', '15', '20'],
        total: 0,
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
    this.setState({ pagination });
    this.fetch();
  }

  fetch = () => {
    this.setState({ loading: true });
    $.ajax({
      url: '/personlaundrylist',
      type: 'get',
      async: false,
      success: (data) => {
        console.log('data', data);
        let { pagination } = this.state;
        pagination.total = data.length;
        this.setState({
          loading: false,
          account: data,
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

  columns = [{
    title: '流水号',
    dataIndex: '_id',
    sorter: (a, b) => b._id - a._id,
    width: '10%',
    render: (text) => {
      return (
        <p>{common.buildLaundryCode(text)}</p>
      )
    }
  }, {
    title: '流水日期',
    dataIndex: 'createAt',
    sorter: true,
    width: '10%',
    sorter: (a, b) => b.createAt - a.createAt,
    render: (text) => {
      return (
        <p>{common.simpleDateForm(text)}</p>
      )
    }
    },{
    title: '流水类型',
    dataIndex: 'orderType',
    sorter: (a, b) => b.orderType - a.orderType,
    width: '10%',
    render: (text, record, index) => {
      return (
        <p>{common.buildLaundryType(text, record)}</p>
      )
    }    
  },{
    title: '交易方式',
    dataIndex: 'changes.0.type',
    width: '5%',
    render: (text) => { 
      return (
        <p>{common.transactionType(text)}</p>
      )
    }
  },{
    title: '金额',
    dataIndex: 'changes.0.amt',
    sorter: (a, b) => `b.changes.0.amt` - `a.changes.0.amt`,
    width: '5%',
    render: (text, record, index) => {
      if (!record.promoCode) {
        return text;
      } else { 
        return (
          <Popover placement="top" content={record.promoCode} trigger="click">
            <a style={{cursor:"pointer"}}>优惠码</a>
        </Popover>
        )
      }
    }
  },{
    title: '订单号',
    dataIndex: 'changes.0.orderSn',
    sorter: (a, b) => `b.changes.0.orderSn` - `a.changes.0.orderSn`,
    width: '10%',
  }];

  render() {
    let columns = this.columns;
    return (
      <div>
        <Table
          size="default"
          width="100%"
          columns={columns}
          rowKey={record => record._id}
          dataSource={this.state.account}
          pagination={this.state.pagination}
          loading={this.state.loading}
        />
      </div>
    );
  }
}

export default AccountTab;