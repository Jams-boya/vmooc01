import React, {Component} from 'react';
import ReactDom from 'react-dom';

class TopReact extends Component {
  constructor(props) {
    super(props);
    this.buyAll = this.buyAll.bind(this);
  }

  buyAll() {
    if(this.props.buyBtn) {
      this.props.buyBtn();
    }
  }

  render() {
    let topInfo = this.props.topInfo;
    let backImage = topInfo.background;
    backImage = backImage.replace(/\\/g, '\\\\');
    let bgImg = 'url("'+ backImage +'")';
    let topDom =
      <div className="topimg" style={{'backgroundImage': bgImg}}>
        <div className="topinfo">
          <div className="infotop">
            <span className="sp1">￥</span>
            <span className="sp2">{topInfo.collectionPrice}</span>
            <span className="sp3">人/年</span>
          </div>
          <div className="infomid">
            <span className="sp4">原价</span>
            <span className="sp5">￥{topInfo.totalPrice}</span>
            <div className="infoline"></div>
          </div>
          <div className="topbuy" onClick={this.buyAll} >全部购买</div>
        </div>
      </div>
    return (
      <div className="top" style={{'background': topInfo.backgroundColor}}>
        {topDom}
      </div>
    );
  }
}
export default TopReact;