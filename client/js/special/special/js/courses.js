import React, {Component} from 'react';
import ReactDom from 'react-dom';
import CoursesReact from '../react/coursesReact';

(() => {
  /**
   * 获取专题课程合辑信息并展示
   * @author: wac
   */
  function courseShow() {
    $.ajax({
      url: '/courseCompilation?id=' + collection_id,
      type: 'get',
      success: (chapter) => {
        let courseReact = ReactDom.render(
          <CoursesReact chapter={chapter} />,
          document.querySelector('.courseDom')
        );
      },
      error: (err) => {
        console.log('courseCompilation:', err);
      }
    });
  }
  courseShow();
})()