import React, {Component} from 'react';
import ReactDom from 'react-dom';

class popWidget extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let poplist = this.props.poplist;
    return (
      <div className="pop">
        <span className="poptitle">人气课程</span>
        <ul className="popul">
          {
            poplist.map((val, idx) => {
              let flag;
              let course_url = '/course/' + val._id;
              idx < 9 ? flag = '0' + (idx + 1) : flag = (idx + 1);
              return (
                <li key={idx}>
                  <div className="rank">{flag}</div>
                  <span className="rankcon"><a href={course_url}>{val.name}</a></span>
                  <div style={{ clear: "both" }}></div>
                </li>
              );
            })
          }

        </ul>
      </div>
    );
  }
}
export default popWidget;