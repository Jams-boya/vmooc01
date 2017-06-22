import _ from 'lodash';
import React from 'react';
import ReactDom from 'react-dom'; 
import util from './util'; 
import './myform.css'

let RC_MyForm = React.createClass({
  getInitialState: function() {
    return {
      data: this.props.defaultValue || {}, 
      cols: this.props.cols || 2,
      forminline: this.props.forminline || false
    };
  }, 

  componentWillReceiveProps: function(nextProps) {
    const {defaultValue} = nextProps;

    console.log('defaultValue=', defaultValue);
    if (defaultValue) {
      this.val(defaultValue);
    }
  },

  val: function (setValue) {
    if (setValue) { 
      this.setState({data:setValue});
    }

    return this.state.data;
  },

  clear: function () {
    this.setState({data:{}}); 
  },

  onHandleChange: function(childData) { 
    Object.keys(childData).map((key) => {
      if (key.includes('.')) {
        this.state.data[key] = childData[key];
      } else { 
        let fs = key.split('.');
        let obj = this.state.data;

        for (let i = 0; i < fs.length - 1; i++) {
          if (!obj[fs[i]]) {
            obj[fs[i]] = {}
          }

          obj = obj[fs[i]];
        }

        obj[fs[fs.length - 1]] = childData[key];
      }
    });
    
    _.mapValues(this.refs, (ref) => {
      if (ref.onlisten) ref.onlisten(childData);
    });

    if (this.props.onHandleChange) {
      this.props.onHandleChange(this.state.data, childData);
    }
  },
  
  render: function() {
    console.log('form default value = ', this.state.data);
    

    let className = '';
    if (this.state.forminline) {
      className = 'form-group';
    } else if (this.state.cols == 4){
      className = 'form-group col-md-3 col-sm-3 col-xs-12';
    } else if (this.state.cols == 3) {
      className = 'form-group col-md-4 col-sm-4 col-xs-12';
    } else if (this.state.cols == 2) {
      className = 'form-group col-md-6 col-sm-6 col-xs-12';
    }  else if (this.state.cols == 1) {
      className = 'form-group col-md-12 col-sm-12 col-xs-12';
    } else {
      console.error('unsupported myform’s cols: d%', this.state.cols);
    } 

      /*
    let children = [];

    if (!Array.isArray(this.props.children)) {
      children.push(this.props.children);
    } else {
      children = this.props.children;
    }

    for (let i = 0, len = children.length; i < len; i++) {
      children[i] = React.cloneElement(
        children[i], 
        {
          key: i, 
          ref: 'child' + i,
          className: className,
          onHandleChange: this.onHandleChange,
          initData: this.state.data,
          forminline: this.state.forminline
        });
    }   
    */
 
    let formClass = 'form-horizontal clearfix';

    if(this.state.forminline) {
      formClass = 'form-inline';
    }
 
    let children = React.Children.map(this.props.children, (child, idx) => {
      return React.cloneElement(
        child,
        {
          key: idx, 
          ref: 'child' + idx,
          className: className,
          onHandleChange: this.onHandleChange,
          initData: this.state.data,
          forminline: this.state.forminline
        }
      );
    });
 
    return ( 
      <div className={formClass}>
        {children} 
      </div>
    );
  }
});

export default RC_MyForm;
