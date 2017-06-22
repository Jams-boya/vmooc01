import _ from 'lodash';
import React, {Component} from 'react';
import ReactDom from 'react-dom';

/**
 * 专家课程react组件
 * @author: wac
 */
class VlistWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vlistData: this.props.data,
    };
  }

  componentDidMount() {

  }

  render() {
    let vlistArr = [];
    this.state.vlistData = this.props.data;
    this.state.vlistData.map((list, index) => {
      let c_url = "/course/" + list._id;
      //购买人数为0时处理
      if (!list.purchaseCount) {
        list.purchaseCount = 0;
      }
      if ((index % 3) == 0) {
        vlistArr.push(
          <div key={index} className='vlist' style={{ marginLeft: "0px" }} >
            <a target="_blank" href={c_url} className="vlistimg">
              <img src={list.cover} />
            </a>

            <div className="vlistcon"><a target="_blank" href={c_url}>{list.name}</a></div>

            <div className="vlistfoot">
              <span>￥{list.price}</span>
              <span>{list.purchaseCount}人学过</span>
            </div>
          </div>
        );
      }
      else {
        vlistArr.push(
          <div key={index} className='vlist'>
            <a target="_blank" href={c_url} className="vlistimg">
              <img target="_blank" href={c_url} src={list.cover} />
            </a>

            <div className="vlistcon"><a target="_blank" href={c_url}>{list.name}</a></div>

            <div className="vlistfoot">
              <span>￥{list.price}</span>
              <span>{list.purchaseCount}人学过</span>
            </div>
          </div>
        );
      }

    });



    return (
      <div>
        {vlistArr}
        <div className='clear'></div>
      </div>
    );
  }
}

VlistWidget.propTypes = {

};

VlistWidget.defaultProps = {

};

export default VlistWidget;