
//import 'jquery/dist/jquery.min.js';
import 'bootstrap/dist/js/bootstrap.min.js' ;

import 'select2/dist/css/select2.min.css';
import 'select2/dist/js/select2.min.js';
import 'js/common/sel2_zh_CN.js';

// import './dt.js';
import moment from 'moment/moment.js'; 
import 'moment/locale/zh-cn.js'; 

$('[data-toggle="tooltip"]').tooltip({
  container: 'body'
});


$('select').on("select2:select", function (evt) {
  $(this).focus(); 
}).on("select2:close", function (evt) { 
  $(this).focus();
});


function formatDate (time, format = 'YYYY-MM-DD') {
  return moment(time).format(format);
}

function tblDateDisplay (time, nrow) {
  return moment(time).format('YYYY-MM-DD');
}

function tblDateDisplayDateTime (time, nrow) {
  return moment(time).format('YYYY-MM-DD HH:mm');
}

export default {formatDate, tblDateDisplay, tblDateDisplayDateTime}