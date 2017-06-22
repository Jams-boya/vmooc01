import React, {Component} from 'react';
import ReactDom from 'react-dom';
import config from '../../../../server/config.js';

class Recommend extends Component {
  constructor(props) {
    super(props);
    let {relist} = this.props;
  }

  render() {
    let relist = this.props.relist;
    return (
      <div className="recommend">
        <span className="rectitle">推荐讲师</span>
        <ul className="recul">
          {
            relist.map((val, idx) => {
              let expert_url = '/expert/' + val.userId;

              let lihref = function() {
                window.location.href = expert_url;
              }
              return (
                <li onClick={lihref} key={idx}>
                  <div className="recimg">
                    <img src={`${config.avatorUrl}/uploadpic/${val.avatar}`} />
                  </div>
                  <div className="reccon">
                    <span>{val.name}</span>
                    <span>{val.professionalTitle}</span>
                    <span><a href={expert_url}>Ta的主页</a></span>
                  </div>

                  <div style={{ clear: 'both' }}></div>
                </li>
              );
            })
          }

        </ul>
      </div>
    );
  }
}
export default Recommend;