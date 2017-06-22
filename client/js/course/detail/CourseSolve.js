import './css/expert.css';
import _ from 'lodash';
import React, {Component} from 'react';
import ReactDom from 'react-dom';
import ReplyWidget from 'js/common/widget/replyWidget';

export default ((() => {
  let replyWidget;
  let courseId = $('#courseid').val();
  let answers = [];
  function findInfo() {
    $.ajax({
      url: '/courseqa',
      type: 'get',
      async: false,
      data: {
        id: courseId,
      },
      success: (data) => {
        if (data.length == 0) {
          $('.quetitle').hide();
          $('.quelist').hide();
        } else {
          answers = data;
          replyWidget = ReactDom.render(
            <ReplyWidget answerData={data} guser={guser}/>,
            document.querySelector('.quelist')
          );
         }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  findInfo();
})());