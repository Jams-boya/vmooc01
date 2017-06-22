import _ from 'lodash';
import React, { Component } from 'react';
import ReactDom from 'react-dom';

class CourseIntro extends Component {
  constructor(props) {
    super(props);
    const {url, id} = this.props;
    this.state = {
      suitableCrowd: "",
      preliminary: "",
      target: "",
      _id: "",
      name: "",
      lifePhoto: "",
      professionalTitle: "",
      briefDescription: "",
      teacherId: "",
    };
  }

  componentDidMount() {
    const {url, id} = this.props;
    if (!url) {
      return;
    }
    $.ajax({
      url: url,
      type: 'GET',
      data: { '_id': id },
      async: false,
      success: (intro) => {
        console.log('intro', intro);
        let expertId = intro[0].teacherId;
        console.log('expertId', expertId);
        if (!intro) {
          console.log('err:', intro);
          return;
        }
        $.ajax({
          url: "/findExpert",
          type: 'get',
          data: { 'teacherId': expertId },
          async: false,
          success: (data) => {
            let lifePhoto = "/" + data.lifePhoto;
            let {professionalTitle, briefDescription, name} = data;
            this.setState({ lifePhoto, professionalTitle, briefDescription, name });
          },
          error: (err) => {
            console.log('err is:', err);
          }
        });
        this.setState({
          suitableCrowd: intro[0].suitableCrowd,
          preliminary: intro[0].preliminary,
          target: intro[0].target,
          _id: intro[1].createId,
        });
      },
      error: (err) => {
        console.log('err:', err);
      }
    });
  }

  render() {
    let expert_url = '/expert/' + this.state._id;
    return (
      <div>
        <div className="procon" id="procon1">
          <span className="procontitle" style={{ fontWeight: 700 }}>适用人群</span>
          <ul className="proul">
            <li style={{ wordBreak: "break-all" }}>{this.state.suitableCrowd}</li>
          </ul>
        </div>
        <div className="procon">
          <span className="procontitle" style={{ fontWeight: 700 }}>预备能力</span>
          <ul className="proul">
            <li style={{ wordBreak: "break-all" }}>{this.state.preliminary}</li>
          </ul>
        </div>

        <div className="procon">
          <span className="procontitle" style={{ fontWeight: 700 }}>授课目标</span>
          <ul className="proul">
            <li style={{ wordBreak: "break-all" }}>{this.state.target}</li>
          </ul>
        </div>
        <div className="procon" id="procon2">
          <span className="procontitle">课程讲师</span>
          <div className="protec">
            <div className="tecimg">
              <img src={this.state.lifePhoto} id="teclifePhoto" />
            </div>
            <div className="teccon">
              <div className="tec">
                <span>{this.state.name}</span>
                <span><a href={expert_url}>Ta的主页</a></span>
              </div>

              <div className="tec">
                {this.state.professionalTitle}
              </div>

              <div className="tec">
                {this.state.briefDescription}
              </div>
            </div>
            <div className="clear"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default CourseIntro;
