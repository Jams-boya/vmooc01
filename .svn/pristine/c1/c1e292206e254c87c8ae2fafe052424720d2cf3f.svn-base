import React, {Component} from 'react';

class Recommends extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expert: [],
    };
    this.addRecom = this.addRecom.bind(this);
    this.upRecom = this.upRecom.bind(this);
    this.downRecom = this.downRecom.bind(this);
    this.delRecom = this.delRecom.bind(this);
  }

  addRecom() {
    $('.addCourseBG').show();
    $('.addRecomBox').show();
  }

  upRecom(idx, e) {
    if (idx != 0) {
      let item = this.state.expert[idx];
      this.state.expert[idx] = this.state.expert[idx - 1];
      this.state.expert[idx - 1] = item;
      let expert = this.state.expert;
      this.setState({ expert: expert });
    }
  }

  downRecom(idx, e) {
    if (idx != this.state.expert.length - 1) {
      let item = this.state.expert[idx];
      this.state.expert[idx] = this.state.expert[idx + 1];
      this.state.expert[idx + 1] = item;
      let expert = this.state.expert;
      this.setState({ expert: expert });
    }
  }

  delRecom(idx, e) {
    this.state.expert.splice(idx, 1);
    let expert = this.state.expert;
    this.setState({ expert: expert });
  }

  render() {
    let expert = this.state.expert;
    let expertNull = [];
    for (let i = 0; i < 3 - expert.length; i++) {
      expertNull.push(
        <div className="recom ren" onClick={this.addRecom}>
          <span className="addrec">
            <div className="line1"></div>
            <div className="line2"></div>
          </span>
          <div className="renadd">添加讲师</div>
        </div>
      );
    }
    return (
      <tbody>
        <tr>
          <td></td>
          <td>
            <div>
              {
                this.state.expert.map((val, idx) => {
                  return (
                    <div className="recom rep">
                      <img src={val.lifePhoto} />
                      <div className="repEidtorBG"></div>
                      <div className="repEidtor">
                        <span onClick={this.upRecom.bind(this, idx) }>&lt; </span><span onClick={this.downRecom.bind(this, idx) }>&gt; </span>
                        <span onClick={this.delRecom.bind(this, idx) }>&otimes; </span>
                      </div>
                    </div>
                  );
                })
              }
              {expertNull}
              <div className="clear"></div>
            </div>
          </td>
        </tr>
      </tbody>
    );
  }
}
export default Recommends;