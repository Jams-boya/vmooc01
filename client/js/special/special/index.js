import React, {Component} from 'react';
import ReactDom from 'react-dom';
import './css/special.css';
import './js/top.js';
import './js/experts.js';
import './js/courses.js';

(() => {
  let minHeight = window.innerHeight - 257;
  $('.special').css('min-height',minHeight + 'px');
  window.onresize = () => {
    minHeight = window.innerHeight - 257;
    $('.special').css('min-height',minHeight + 'px');
    console.log('minHeight', minHeight);
  };
})()
