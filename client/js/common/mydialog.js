
let myUrlDialog = function() { 
  // make it singleton
  if (this.constructor.instance ) {
    return this.constructor.instance;
  } 
  else {
    this.constructor.instance = this;
  }
  
  this.init();
};

myUrlDialog.prototype = {
  constructor: myUrlDialog,
  $dlg: null,
  $divTitle: null,
  $container: null,
  $url: null,
  
  init: function() {
      var str = `<div class="modal fade">
       <div class="modal-dialog modal-lg">
           <div class="modal-content"> 
               <div class="modal-header">
                <button class="close" data-dismiss="modal" type="button">&times;</button>
                <h4 class="modal-title"></h4>
               </div>
               <div class="modal-body clearfix">  
                 <iframe frameborder="0" class="mydialogframe" style="width: 100%; height: 450px;"></iframe>
               </div> 
           </div>
       </div>
   </div>`;

         
    this.$dlg            = $(str); 
    this.$divTitle       = this.$dlg.find('.modal-title'); 
    this.$container       = this.$dlg.find('.mydialogframe'); 
    $('body').append(this.$dlg);

    this.$dlg.on("shown.bs.modal", this.updateUrl.bind(this));
  },

  updateUrl() {
    this.$container.attr('src', this.$url);
  },

  show: function(title, url) {
    this.$divTitle.html(title); 
    this.$url = url; 
    this.$dlg.modal('show');
  }
};

export default myUrlDialog;
