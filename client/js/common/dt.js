
import 'datatables.net/js/jquery.dataTables.js'
import 'datatables.net-bs/js/dataTables.bootstrap.js'

import 'datatables.net-dt/css/jquery.dataTables.css'

import 'datatables.net-buttons-bs/js/buttons.bootstrap.js'
import 'datatables.net-buttons-bs/css/buttons.bootstrap.css'

import 'datatables.net-select/js/dataTables.select.js'
import 'datatables.net-select-bs/css/select.bootstrap.css'

 
if($.fn.dataTable){
  // Disable search and ordering by default
  $.extend( $.fn.dataTable.defaults, {
      searching: false, 
      language: { 
          "decimal":        "",
          "emptyTable":     "没有数据",
          "info":           "显示 _START_ 到 _END_ , 总 _TOTAL_ 行",
          "infoEmpty":      "显示 0 到 0 ,总 0 行",
          "infoFiltered":   "",
          "infoPostFix":    "",
          "thousands":      ",",
          "lengthMenu":     "每页 _MENU_ 行",
          "loadingRecords": "正在载入...",
          "processing":     "数据加载中...",
          "search":         "搜索:",
          "zeroRecords":    "没有数据",
          "paginate": {
              "first":      "首页",
              "last":       "末页",
              "next":       "后一页",
              "previous":   "前一页"
          },
          "select": {
              "rows": "选中 %d 行"
          }
      }
  });

  $.fn.dataTable.ext.errMode = 'none';
} 