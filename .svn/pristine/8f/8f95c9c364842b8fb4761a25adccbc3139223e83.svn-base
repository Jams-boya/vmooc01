import _ from 'lodash';

export default {
  getFieldVal(data, field) {
    let fs = field.split('.');
    let v = data;

    for (let i = 0; i < fs.length; i++) {
      v = v[fs[i]]; 
      if (_.isNull(v) || _.isUndefined(v)) {
        return '';
      }
    }

    return v;
  }
};

