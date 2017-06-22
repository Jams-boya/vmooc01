import _ from 'lodash';
import axios from 'axios';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal, Table } from 'antd';

class DetailModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      studyRecord: {},
      studyTab: [],
    }
  }

  showModal = (mycourseData) => {
    console.log('mycourseData', mycourseData);
    $.ajax({
      type: "post",
      url: '/queryStudyRecord',
      data: mycourseData,
      success: (res) => {
        this.setState({ studyRecord: mycourseData, studyTab: res, visible: true });
      },
      error: (err) => console.log('err', err)
    });
  }

  onCancel = () => {
    this.setState({ visible: false });
  }

  render() {
    const columns = [{
      title: '章节',
      dataIndex: 'chapterIdx',
      key: 'chapterIdx',
      render: text => <span style={{ fontSize: 12 }}>第{text}章</span>
    }, {
      title: '课时标题',
      dataIndex: 'clazzName',
      key: 'clazzName',
      render: text => <span style={{ fontSize: 12 }}>{text}</span>
    }, {
      title: '课时时间',
      dataIndex: 'time',
      key: 'time',
      render: text => <span style={{ fontSize: 12 }}>{Number(text / 60).toFixed(0)}分钟</span>
    }, {
      title: '是否完成学习',
      dataIndex: 'isFinish',
      key: 'isFinish',
      render: text => <span style={{ fontSize: 12 }}>{text ? '是' : '否'}</span>
    }, {
      title: '初考成绩',
      dataIndex: 'beginScore',
      key: 'beginScore',
      render: text => <span style={{ fontSize: 12 }}>{!!text ? `${text}分` : `未测试`}</span>
    }, {
      title: '重考成绩',
      dataIndex: 'lastScore',
      key: 'lastScore',
      render: text => <span style={{ fontSize: 12 }}>{!!text ? `${text}分` : `未重考`}</span>
    }];
    const subSpanStyle = {
      fontSize: 15,
    }
    return (
      <div>
        <Modal
          width={"800"}
          style={{ top: 20 }}
          visible={this.state.visible}
          footer={null}
          onCancel={this.onCancel}
        >
          <div>
            <h3 style={{ marginTop: 0, color: '#000', textAlign: 'center' }}>《{this.state.studyRecord.courseName}》学习记录</h3>
            <p style={subSpanStyle}>学习时间: 共学习{this.state.studyRecord.progress && (_.sum(this.state.studyRecord.progress.map(pt => Number(pt.playTime))) / 60).toFixed(0)}分钟</p>
            <p style={subSpanStyle}>课程总完成进度 {(this.state.studyRecord.lookedCount / this.state.studyRecord.totalCount * 100 >=100 ? 100 : this.state.studyRecord.lookedCount / this.state.studyRecord.totalCount * 100).toFixed(0)}%</p>
            <h4>学习记录详情</h4>
            <Table
              size={'small'}
              columns={columns}
              dataSource={this.state.studyTab}
            />
          </div>
        </Modal>
      </div>
    );
  }
}

export default DetailModal;
