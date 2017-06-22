/** 网站配置 */
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { message, Button } from 'antd';
import ShowNav from './showNav';
import TopNav from './topNav';
import BottomNav from './bottomNav';

class Big extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topCallValue: null,
      bottomCallValue: null,
      showTopModal: null,
      showBottomModal: null,
    }
  }

  render() {
    return (
      <div>
        <TopNav
          showTopModal={this.state.showTopModal}
          topCallBack={(val) => {
            this.setState({ topCallValue: val, bottomCallValue: null, showTopModal: null, showBottomModal: null });
          } } />
        <BottomNav
          showBottomModal={this.state.showBottomModal}
          bottomCallBack={(val) => {
            this.setState({ topCallValue: null, bottomCallValue: val, showTopModal: null, showBottomModal: null });
          } }
          />
        <ShowNav
          showTopModal={(val) => {
            this.setState({ topCallValue: null, bottomCallValue: null, showTopModal: val, showBottomModal: null });
          } }
          showBottomModal={(val) => {
            this.setState({ topCallValue: null, bottomCallValue: null, showTopModal: null, showBottomModal: val });
          } }
          topCallValue={this.state.topCallValue}
          bottomCallValue={this.state.bottomCallValue}
          />
      </div>
    );
  }
}

let big = ReactDom.render(
  <Big />,
  document.querySelector('#big')
);
