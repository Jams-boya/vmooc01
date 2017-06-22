import React, {Component} from 'react';
import ReactDom from 'react-dom';
import ExpertsReact from '../react/expertsReact';

(() => {
  /**
   * 获取专题推荐专家信息并展现
   * @author: wac
   */
  function rmdExperts() {
    $.ajax({
      url: '/rmdExperts?id=' + collection_id,
      type: 'get',
      success: (experts) => {
        let expertReact = ReactDom.render(
          <ExpertsReact experts={experts} />,
          document.querySelector('.expertsDom')
        );
      },
      error: (err) => {
        console.log('rmdExperts:', err)
      }
    });
  }

  rmdExperts();
})()