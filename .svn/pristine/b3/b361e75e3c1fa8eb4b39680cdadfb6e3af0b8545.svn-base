import React, {Component} from 'react';
import ReactDom from 'react-dom';

class ExpertsReact extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let experts = this.props.experts;
    let expertArr = [];
    experts.expert.map((expert, index) => {
      let expertLink = '/expert/' + expert.id;
      if(!expert.lifePhoto || expert.lifePhoto == '') {
        expert.lifePhoto = '/images/user.png';
      }
      if (index < 3) {
        expertArr.push(
          <div key={index} className="expert">
            <div className="eximg">
              <img src={expert.lifePhoto} />
            </div>
            <div className="exCon">
              <span className="exname">{expert.name}</span>
              <span className="exduty">{expert.professionalTitle}</span>
              <br />
              <span className="exintro">
                {expert.briefDescription}
              </span>
            </div>

            <div className="exbg"></div>
            <a href={expertLink} target="_blank">
              <div className="exlink">查看详情</div>
            </a>
          </div>
        );
      }
    });
    return (
      <div className="experts">
        {expertArr}
        <div className="clear"></div>
      </div>
    );
  }
}

export default ExpertsReact;