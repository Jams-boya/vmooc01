import _ from 'lodash';
import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { Tooltip } from 'antd';

class CourseCatalog extends Component {
  constructor(props) {
    super(props);
    const {data} = this.props;
    this.state = {
      data: [],
      flag: false,
    };
  }
  componentDidMount() {
    const {url, id} = this.props;
    // console.log('url', url);
    if (!url) {
      return;
    }
    $.ajax({
      url: url,
      type: 'get',
      data: { '_id': id },
      async: false,
      success: (data) => {
        if (!data) {
          console.log('no data');
          return;
        }
        if (guser) {
          let courseId = $('#courseid').val();
          $.ajax({
            url: '/findIsBuy',
            type: 'post',
            data: { courseId, userId: guser._id },
            async: false,
            success: (result) => {
              if (result && result.userId == guser._id || data[0].teacherId == guser._id) {
                this.state.flag = true;
              }
            },
            error: (err) => {
              console.log('err', err);
            }
          });
        }
        this.setState({
          data: data,
        });
      },
      error: (err) => {
        console.log('err', err);
      }
    });
  }

  render() {
    var roc_clazz = [];
    if (this.state.data.length != 0) {
      this.state.data[0].toc.map((item, idx) => {
        let toc = [];
        let clazz = [];
        if (this.state.data[0].isMicroCourse == false) {
          toc.push(
            <div className="porjtitle" key={idx}>
              <span><div className="markdiv"></div>章节{idx + 1}</span>
              <Tooltip title={item.chapter}>
                <span>{item.chapter.substring(0, 25)}</span>
              </Tooltip>
            </div>);
        } else {
          toc.push(
            <div className="porjtitle" key={idx}>
              <span><div className="markdiv"></div>共一课时</span>
              <span></span>
            </div>);
        }
        if (this.state.flag) {
          item.clazz.map((citem, cidx) => {
            var video_url = '/player/' + this.state.data[0]._id + '?cidx=' + idx + '&index=' + cidx;
            var isFree = citem.isFree ? "免费试看" : "";
            var time = parseInt(citem.time / 60) + ':' + (citem.time % 60 < 10 ? 0 : '') + Math.ceil(citem.time % 60);
            clazz.push(
              <div className="projcontent" key={cidx}>
                <a href={video_url} className="clazzli">
                  <span>课时{cidx + 1}</span>
                  <Tooltip title={this.state.data[0].name}>
                    <span>{this.state.data[0].name.substring(0, 25)}</span>
                  </Tooltip>
                  <span>{citem.isFree}</span>
                  <span>
                    <span>{time}</span>
                    <img className="playimg" src="/images/course/play.png" />
                    <span className="playtime">{isFree}</span>
                  </span>
                </a>
              </div>
            );
          });
        } else {
          item.clazz.map((citem, cidx) => {
            var video_url = '/player/' + this.state.data[0]._id + '?cidx=' + idx + '&index=' + cidx;
            var isFree = citem.isFree ? "免费试看" : "";
            var time = parseInt(citem.time / 60) + ':' + (citem.time % 60 < 10 ? 0 : '') + Math.ceil(citem.time % 60);
            if (citem.isFree) {
              clazz.push(
                <div className="projcontent" key={cidx}>
                  <a href={video_url} className="clazzli">
                    <span>课时{cidx + 1}</span>
                    <Tooltip title={citem.title}>
                      <span>{citem.title.substring(0, 25)}</span>
                    </Tooltip>
                    <span>{citem.isFree}</span>
                    <span>
                      <span>{time}</span>
                      <img className="playimg" src="/images/course/play.png" />
                      <span className="playtime">{isFree}</span>
                    </span>
                  </a>
                </div>
              );
            } else {
              clazz.push(
                <div className="projcontent" key={cidx} style={{ cursor: "not-allowed" }}>
                  <div className="clazzli">
                    <span>课时{cidx + 1}</span>
                    <Tooltip title={citem.title}>
                      <span>{citem.title.substring(0, 25)}</span>
                    </Tooltip>
                    <span>{citem.isFree}</span>
                    <span>
                      <span>{time}</span>
                      <img className="playimg" src="/images/course/play.png" />
                      <span className="playtime">{isFree}</span>
                    </span>
                  </div>
                </div>
              );
            }
          });
        }

        roc_clazz.push(<div key={idx}>{toc}{clazz}</div>)
      });
    }

    return (
      <div className="projcon">
        {roc_clazz}
      </div>
    );
  }
}

export default CourseCatalog;
