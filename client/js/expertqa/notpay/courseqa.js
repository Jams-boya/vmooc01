import './css/notpay.css';
import _ from 'lodash';
import React, {Component} from 'react';
import ReactDom from 'react-dom';
import ReplyWidget from 'js/common/widget/replyWidget';

export default ((() => {
  let replyWidget;
  let courseId = courseid;
  let answers = [];

  function findInfo() {
    $.ajax({
      url: '/coursesqa',
      type: 'get',
      async: false,
      data: {
        id: courseId,
      },
      success: (data) => {
        answers = data.slice(0, 5);
        if (answers.length > 0) {
          replyWidget = ReactDom.render(
            <ReplyWidget
              answerData={answers}
              // guser={guser}
            />,
          document.querySelector('.ablist')
          );
        } else {
          $(".about").hide();
        }
      },
      error: (err) => {
        console.log('err', err);
      }
    });
  }
  findInfo();
})());