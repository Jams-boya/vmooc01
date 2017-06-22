import 'babel-polyfill';
import 'css/style.css'; 

(function() {
  var CURRENT_URL = window.location.href.split('?')[0],
    $BODY = $('body'),
    $MENU_TOGGLE = $('#menu_toggle'),
    $SIDEBAR_MENU = $('#sidebar-menu'),
    $SIDEBAR_FOOTER = $('.sidebar-footer'),
    $LEFT_COL = $('.left_col'),
    $RIGHT_COL = $('.right_col'),
    $NAV_MENU = $('.nav_menu'),
    $FOOTER = $('footer'),
    $SIDEBAR_FLOD = $('.sidebar-fold'),
    $VIEWFRAMEWORK_BODY = $('.viewFramework-body'),
    $NAVBAR_COLLAPSE = $('.viewFramework-product-navbar-collapse'),
    $PRODUCT = $('.viewFramework-product'); 

  initPanelToolbox();  

  $SIDEBAR_FLOD.on('click', function (ev) { 
    if($VIEWFRAMEWORK_BODY.hasClass('viewFramework-sidebar-full')){
      $VIEWFRAMEWORK_BODY.removeClass('viewFramework-sidebar-full');
      $VIEWFRAMEWORK_BODY.addClass('viewFramework-sidebar-mini');
    } else {
      $VIEWFRAMEWORK_BODY.addClass('viewFramework-sidebar-full');
      $VIEWFRAMEWORK_BODY.removeClass('viewFramework-sidebar-mini');
    } 
  });

  $NAVBAR_COLLAPSE.on('click', function (ev) {
    if($PRODUCT.hasClass('viewFramework-product-col-1')){
      $PRODUCT.removeClass('viewFramework-product-col-1');
    } else {
      $PRODUCT.addClass('viewFramework-product-col-1');
    } 
  });

  // Panel toolbox
  function initPanelToolbox() {
    $('.collapse-link').on('click', function() {
      var $BOX_PANEL = $(this).closest('.x_panel'),
        $ICON = $(this).find('i'),
        $BOX_CONTENT = $BOX_PANEL.find('.x_content');

      // fix for some div with hardcoded fix class
      if ($BOX_PANEL.attr('style')) {
        $BOX_CONTENT.slideToggle(200, function(){
          $BOX_PANEL.removeAttr('style');
        });
      } else {
        $BOX_CONTENT.slideToggle(200); 
        $BOX_PANEL.css('height', 'auto');  
      }

      $ICON.toggleClass('fa-chevron-up fa-chevron-down');
    });

    $('.close-link').click(function () {
      var $BOX_PANEL = $(this).closest('.x_panel');

      $BOX_PANEL.remove();
    });
  }

})();