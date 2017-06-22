import 'css/animate.css';
import 'css/notify.css';
import notify from 'bootstrap-notify';

export default {
  info(message) {
    $.notify({ 
        message 
      }, {
        type: 'minimalist',
        delay: 100,
        template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
        '<span data-notify="message">{2}</span>' +
        '</div>',
        placement: {
          align: "center"
        },
        z_index: 1100
      });
  },

  warn(message) {
    $.notify({ 
        message 
      }, {
        type: 'minimalist-warn',
        delay: 100,
        template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
        '<span data-notify="message">{2}</span>' +
        '</div>',
        placement: {
          align: "center"
        },
        z_index: 1100
      });
  },

  success(message) {
    $.notify({ 
        message 
      }, {
        type: 'success',
        delay: 100,
        template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
        '<span data-notify="message">{2}</span>' +
        '</div>',
        placement: {
          align: "center"
        },
        z_index: 1100
      });
  },
};
