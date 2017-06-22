import _ from 'lodash';
import axios from 'axios';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal, Table } from 'antd';
import ReactEcharts from 'echarts-for-react';
import DetailModal from './detailModal';

class StudyRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      detailVisible: false,
      record: {},
      detail: {},
      studyCount: 0,
      examCount: 0,
      totalCount: 0,
    }
  }

  showModal = (order) => {
    $.ajax({
      type: "post",
      url: '/queryOtherStudyRecord',
      data: order,
      success: (res) => {
        res.data.map(d => {
          _.isEqual(d.lookedCount, d.totalCount) ? this.state.studyCount += 1 : null;
          _.isEqual(d.passCount, d.totalCount) ? this.state.examCount += 1 : null;
        })
        this.setState({ totalCount: res.data.length, record: res, visible: true });
      },
      error: (err) => console.log('err', err)
    });
  }
  onCancel = () => {
    this.setState({ visible: false });
  }
  showDetail = (mycourseData) => {
    this.detailModal.showModal(mycourseData);
  }

  getStudyOption = (e) => {
    return {
      title: {
        text: '学习完成进度',
        x: 'center'
      },
      series: [
        {
          type: 'pie',
          radius: '40%',
          center: ['50%', '40%'],
          data: [
            { value: this.state.studyCount, name: `已完成学习${(this.state.studyCount / this.state.totalCount * 100).toFixed(0)}%` },
            { value: this.state.totalCount - this.state.studyCount, name: `未完成学习${((1 - this.state.studyCount / this.state.totalCount) * 100).toFixed(0)}%` },
          ],
        }
      ]
    };
  }
  getExamOption = () => {
    return {
      title: {
        text: '考试成绩',
        x: 'center'
      },
      series: [
        {
          type: 'pie',
          radius: '40%',
          center: ['50%', '40%'],
          data: [
            { value: this.state.examCount, name: `全部课时都合格${(this.state.examCount / this.state.totalCount * 100).toFixed(0)}%` },
            { value: this.state.totalCount - this.state.examCount, name: `全部课时未完全合格${((1 - this.state.examCount / this.state.totalCount) * 100).toFixed(0)}%` },
          ],
        }
      ]
    }
  }
  render() {
    let columns = [{
      title: '姓名/昵称/邮箱',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
        return (
          <span style={{ fontSize: 12 }}>{record.name}/{record.nickName}/{record.email}</span>
        )
      }
    }, {
      title: '已完成课时',
      dataIndex: 'totalCount',
      key: 'totalCount',
      render: (text, record) => <span style={{ fontSize: 12 }}>{record.lookedCount}/{record.totalCount}</span>
    }, {
      title: '学习完成进度',
      dataIndex: 'lookedCount',
      key: 'lookedCount',
      render: (text, record) => <span style={{ fontSize: 12 }}>{(record.lookedCount / record.totalCount * 100).toFixed(0) >=100 ? 100 : (record.lookedCount / record.totalCount * 100).toFixed(0)}%</span>
    }, {
      title: '考试合格课时数',
      dataIndex: 'userId',
      key: 'userId',
      render: (text, record) => <span style={{ fontSize: 12 }}>{record.passCount}/{record.totalCount}</span>
    }, {
      title: '重考课时数',
      dataIndex: 'resatCount',
      key: 'resatCount',
    }, {
      title: '操作',
      dataIndex: 'address',
      key: 'address',
      render: (text, record) => <a onClick={this.showDetail.bind(this, record)} style={{ fontSize: 12 }}>查看详情</a>
    }];

    return (
      <div>
        <div>
          <DetailModal ref={rc => {
            console.log('cc', rc)
            this.detailModal = rc
          }} />
        </div>
        <div>
          <Modal
            width={"900"}
            style={{ top: 20 }}
            visible={this.state.visible}
            footer={null}
            onCancel={this.onCancel}
          >
            <div>
              <p>学习记录总表</p>
              <div style={{ width: '430px', height: '200px', float: 'left' }}>
                <ReactEcharts
                  option={this.getStudyOption()}
                  notMerge={true}
                  lazyUpdate={true}
                  theme={"学习完成进度"}
                />
              </div>
              <div style={{ width: '430px', height: '200px', float: 'right' }}>
                <ReactEcharts
                  option={this.getExamOption()}
                  notMerge={true}
                  lazyUpdate={true}
                  theme={"考试成绩"}
                />
              </div>
              <div style={{ clear: 'both' }}></div>
              <p>学习记录详情（共{this.state.record.ClazzCount}课时，{this.state.record.hasExamCount}课时有考题，所有课时总时长{(this.state.record.totalTime / 60).toFixed(0)}分钟）</p>
              <Table
                size={'small'}
                columns={columns}
                rowKey={record => record.userId}
                dataSource={this.state.record.data}
              />
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}

export default StudyRecord;
