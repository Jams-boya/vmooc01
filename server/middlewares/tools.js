// import bcrypt       from 'bcrypt';

import moment       from 'moment'; 
import _            from 'lodash';
import config       from '../config';

var bcrypt;
if (config.run_at_win) {
    bcrypt = require('bcryptjs');
} else {
    bcrypt = require('bcrypt');
}

/**
* 将数组转换为树结构
*/
function buildTreeArray_old(array, parent = {treeId: '', _id: ''}, tree = []) {

  let children = _.filter(array, (child) => {  
    if (!child.treeId) child.treeId = ''; 
    return (parent.treeId === '' && parent._id === '' && child.treeId === '') || child.treeId === parent.treeId + '/' + parent._id.toString(); 
  });

  if (!_.isEmpty(children)) { 
    if (!parent._id) {
      tree = children;   
    } else {
      parent.children = children;
    }

    _.each(children, (child) => {  
      buildTreeArray(array, child);
    });                    
  }

  return tree;
} 

function buildTreeArray(data, treeId = '/') {

    let nodes = data.filter((node) => node.treeId === treeId);

    nodes.map((node) => {
      let childTreeId = _.trimEnd(node.treeId, '/') + '/' + node._id;
      node.children = buildTreeArray(data, childTreeId);
    });

    return treeId === '/' ? nodes[0] : nodes;
}

export default {
// 格式化时间
	formatDate  (date, friendly) {
	  date = moment(date);

	  if (friendly) {
	    return date.fromNow();
	  } else {
	    return date.format('YYYY-MM-DD HH:mm');
	  }

	},

	validateId  (str) {
	  return (/^[a-zA-Z0-9\-_]+$/i).test(str);
	},

	bhash  (str, callback) {
	  bcrypt.hash(str, 10, callback);
	},

	bcompare (str, hash, callback) {
	  bcrypt.compare(str, hash, callback);
	},
	genSuggestQry(field, val) {
        let qry1 = {};
        let qry2 = {};
        let upperVal;
        let re;

        if (val === '') {
            qry1[field] = '';
            return [qry1];
        }

        qry1[field] = new RegExp(RegExp.escape(val), 'i');

        upperVal = val.toUpperCase();
        re = upperVal.charAt(0);
        for (let i = 1; i < upperVal.length; i++) {
            re += '.*' + RegExp.escape(upperVal.charAt(i));
        }
        qry2[field] = new RegExp(re);

        return [qry1, qry2];
    },

    isSameDay(d1, d2) {
        return moment(d1).diff(moment(d2), 'days') === 0;
    },

    getImgPath110x110(mainPath) {
        let arr      = path.basename(mainPath).split('.');
        let newname  = `${arr[0]}_110x110.${arr[1]}`;
        return path.join(path.dirname(mainPath), newname);
    },

    getImgPath(mainPath, width, height) {
        let arr      = path.basename(mainPath).split('.');
        let newname  = `${arr[0]}_${width}x${height}.${arr[1]}`;
        return path.join(path.dirname(mainPath), newname);
    },
    
    getLogoPath(mainPath, width, height) {
        let arr      = path.basename(mainPath).split('.');
        let newname  = `${arr[0]}.${arr[1]}_${width}x${height}.${arr[2]}`;
        console.log('path',path.join(path.dirname(mainPath), newname));
        return path.join(path.dirname(mainPath), newname);
    },

    folderNameEscape(name) {
        // 目录不支持包含.
        return name.replace(/\./g, '');
    },

    /**
    * 将数组转换为树结构
    */
    buildTreeArray( array, parent, tree ) {
      return buildTreeArray(array, parent, tree);
    } 
}
