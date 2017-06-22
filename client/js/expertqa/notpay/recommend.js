import '../../../common/css/recommend.css';
import _ from 'lodash';
import React, {Component} from 'react';
import ReactDom from 'react-dom';
import Recommend from 'js/common/widget/recommendWidget';

export default ((() => {
let recommedArr = [];
  let reCount = 3;
  $.ajax({
    url: '/recommend',
    type: 'get',
    async: false,
    data: {
      reCount
    },
    success: (data) => {
      recommedArr = data;
    },
    error: () => {
      console.log('error', 'recommend');
    }
  });

  let recommendReact = ReactDom.render(
    <Recommend relist={recommedArr} />,
    document.querySelector('#cright')
  );

}))();
