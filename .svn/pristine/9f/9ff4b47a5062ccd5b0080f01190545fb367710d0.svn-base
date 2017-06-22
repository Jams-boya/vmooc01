import _ from 'lodash';
import React, { Component } from 'react';
import ReactDom from 'react-dom';

class CoursesWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    const {url, classify} = this.props;
    if (!url) {
      return;
    }

    $.ajax({
      url: url,
      type: 'post',
      data: { "classify": classify },
      async: false,
      success: (data) => {
        if (data.length < 2) {
          $.ajax({
            url: "/findAllCourse",
            type: 'get',
            async: false,
            success: (data) => {
              this.setState({ data: data });
            },
            error: (err) => {
              console.log('err:', err);
            }
          });
        } else {
          this.setState({ data: data });
        }
      },
      error: (err) => {
        console.log('err:', err);
      }
    });


  }

  render() {
    return (
      <div className="about">
        <span className="abtitle">相关课程</span>
        {
          this.state.data.map((item, idx) => {
            let course_url = "/course/" + item._id;
            let iprice = Number(item.price).toFixed(2);
            let name = item.name.substring(0, 13);
            return (
              <div className="abcon" key={idx}>
                <div className="abimg">
                  <a href={course_url}><img src={item.cover} /></a>
                </div>
                <div className="abtxt">
                  <span>{name}</span>
                  <span>￥{iprice}</span>
                  <div className="clear"></div>
                </div>
              </div>
            );
          })
        }
      </div>
    );
  }
}

CoursesWidget.propTypes = {
  url: React.PropTypes.string,
  classify: React.PropTypes.string,
}

export default CoursesWidget;
