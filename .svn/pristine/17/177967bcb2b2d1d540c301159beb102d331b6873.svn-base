import 'bootstrap/dist/js/bootstrap.min.js';

import React from 'react';
import ReactDom from 'react-dom';
import Uploader from 'js/common/webuploader/Uploader';

let SHOWUPLOADER = function (title) {
    // make it singleton
    if (this.constructor.instance)
        return this.constructor.instance;
    else
        this.constructor.instance = this;

    this.init(title);
};

SHOWUPLOADER.prototype = {
    constructor: SHOWUPLOADER,
    $str: null,
    callback: null,
    $dom: null,
    $react: null,
    init: function (title) {
        var str = `<div class="modal fade" id="modal-id" style="z-index: 1050;top:10;">
        <div class="modal-dialog" style="width:70%">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
              <h4 class="modal-title">${title}<i class="code"></i></h4>
            </div>
            <div class="modal-body clearfix">
                <div id="videoUploader">
                </div>
            </div>

          </div>
        </div>
      </div>`;
        this.$str = $(str);
        this.$dom = this.$str.find('#videoUploader')[0];
        $("body").append(this.$str);

    },

    show: function (toc, uploadFiles, cidx, index, setToc) {
        $(this.$dom).empty();

        this.$str.modal({
            backdrop: 'static'
        });
        this.$str.modal("show");
        $('#modal-id').on('shown.bs.modal', () => {
            this.$react = ReactDom.render(
                <Uploader data={toc} uploadFiles={uploadFiles} cidx={cidx} index={index} setToc={setToc} />,
                this.$dom
            );
            this.$react.setState({cidx: cidx, index: index})
        });

        $('#modal-id').on('hide.bs.modal', () => {
            var $this = this;
            $this.$react.uploader.destroy();
        });
    },

};

export default SHOWUPLOADER;