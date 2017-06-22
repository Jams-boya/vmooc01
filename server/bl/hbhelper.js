import validator  from 'validator';
export default {

  hbhActive(code1, code2) {
    return code1 === code2 ? 'active' : '';
  },

  hbhCompare(code1, code2) {
    return code1 > code2 ? 23 : 0;
  },

  ifEqual(v1, v2, options) {
    if(v1 === v2) {
      return options.fn(this);
    }
    return options.inverse(this);
  },

  sidebar(groupCode, rights) {
    if(!groupCode) {
      return 'viewFramework-sidebar-mini';
    }

    for(var i = 0; i < rights.length; i++) {
      if(rights[i].groupCode === groupCode) {
        if(rights[i].modules.length <= 1) {
          return 'viewFramework-sidebar-full';
        }
      }
    }

    return 'viewFramework-sidebar-mini';
  },

  subrights(groupCode, rights){
    if(!groupCode) {
      return '';
    }

    for(var i = 0; i < rights.length; i++) {
      if(rights[i].groupCode === groupCode) {
        if(rights[i].modules.length <= 1) {
          return '';
        }
      }
    }

    return 'viewFramework-product-col-1';
  },

  collapse(groupCode, rights){
    if(!groupCode) return 'none';
    
    for(var i = 0; i < rights.length; i++) {
      if(rights[i].groupCode === groupCode) {
        if(rights[i].modules.length <= 1) {
          return 'none';
        }
      }
    }

    return 'block';
  },

  jstringfiy(json) {
    return JSON.stringify(json)
  },

  ifFirstEven(idx, options) {
    if(idx % 2 == 0 && idx <= 1) {
      return options.fn(this);
    }
    return options.inverse(this);
  },

  ifLength(idx, options) {
    if(idx > 1) {
      return options.fn(this);
    }
    return options.inverse(this);
  },

  toFixed(number, length) {
    return Number(number).toFixed(length);
  },

  clickUrl(clickUrl) {
    if (clickUrl)
      return clickUrl;
    return 'javascript:void(0)';
  },

  divisionAndFixed(val, math, fixed) {
    if (!val)
      return '';
    
    let num = Number(val);
    if (num)
      num = (num / math).toFixed(fixed);
    return num;
    
  }
};
