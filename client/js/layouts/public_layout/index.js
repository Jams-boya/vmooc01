import 'bootstrap/dist/js/bootstrap.min.js';
import 'css/style.css';
import './layout.css';
import 'css/sign.css';
import 'js/common/socketClient';
(function () {
  let minHeight = window.innerHeight - 200;
  $('.middle').css('min-height', minHeight + 'px');
  window.onresize = () => {
    minHeight = window.innerHeight - 200;
    $('.middle').css('min-height', minHeight + 'px');
    console.log('minHeight', minHeight);
  };

  if ($('#current')) {
    let curNow = $('#current').html();
    if (curNow == 'home') {
      $('.navul li').eq(0).children('a').css('color', '#1E9219');
    }
    if (curNow == 'course') {
      $('.navul li').eq(1).children('a').css('color', '#1E9219');
    }
  }
  
  if (guser) {
    if (guser.isInstructor) {
      $('.couar').html('讲师中心');
      $('.couar').attr('href', '/courseManage');
    } else {
      $('.couar').html('我要开课');
      $('.couar').attr('href', '/teachersign/steps/');
    }
  } else {
    $('.couar').html('我要开课');
    $('.couar').attr('href', '/teachersign/steps/');
  }
  // $.post('localhost:8888/mhp/api/vmooc/vmooc_login_api.php',{name: 'admin', pwd: 'admin'}, function(res) {
 	// 	console.log('---', res);
	// });

  // $.ajax({
  //       headers : {
  //               'Accept'       : 'application/json',
  //               'Content-Type' : 'application/x-www-form-urlencoded'
  //       },
  //       url  : 'http://localhost:8888/mhp/api/vmooc/vmooc_login_api.php',
  //       type : 'POST',
  //       data : {name: 'admin', pwd: 'admin'},
        
  //       success : function(data) {
  //           console.log('----', data);
  //       },
  //       error : function(err) {
  //       console.log('=====', err);
  // }
  //   }); 
})();

