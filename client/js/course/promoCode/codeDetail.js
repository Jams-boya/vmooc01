/*
 * @Author: gaoshuai 
 * @Date: 2017-04-26 13:22:21 
 * @Last Modified by: gaoshuai
 * @Last Modified time: 2017-04-28 06:52:56
 * @content 优惠码详细
 */
import 'antd/lib/modal/style';
import 'antd/dist/antd.min.css';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal, Table, Button, message } from 'antd';
import copy from 'copy-to-clipboard';
import NewCode from './newCode';

class CodeDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      codes: [],
    }
    let onCopy = (code) => {
      copy(code);
      message.success('复制成功!');
    }
    this.columns = [{
        title: '优惠代码号',
        dataIndex: 'code',
        width: '15%',
      },{
        title: '已使用人数',
        dataIndex: 'usedCount',
        width: '15%',
        render: (text, record, index) => {
          return (
            <p>{Number(record.totalCount-record.remainCount)}</p>
          )
        }
      },{
        title: '可使用总人数',
        dataIndex: 'totalCount',
        width: '20%'
      },{
        title: '操作',
        dataIndex: 'operation',
        width: '20%',
        render: (text, record, index) => {
          return (
            <a href="#" onClick={onCopy.bind(null, record.code)}>复制优惠码</a>
          )
        }
      }];
  }
  showModal = (courseId) => {
    	$.ajax({
			url: '/getCodesByCourseId',
      type: 'get',
      data: {
       courseId
      },
      success: (data) => {
        console.log('data', data);
        this.setState({ codes: data, visible: true  });
			},
			error: (err) => {
				console.log(err);
			}
		});
  }
  handleCancel = (e) => {
    this.setState({visible: false});
  }
  render() {
    let columns = this.columns;
    return (
      <div>
        <Modal
          title="优惠码"
          visible={this.state.visible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <Table bordered
            size="small"
            dataSource={this.state.codes}
            columns={columns}
            rowKey={record => record._id}
            pagination={false}
          />
        </Modal>
      </div>
    );
  }
}

export default CodeDetail;