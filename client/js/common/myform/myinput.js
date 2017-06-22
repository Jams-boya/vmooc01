import _ from 'lodash';
import React from 'react';
import ReactDom from 'react-dom';

import util from './util';

let RC_MyInput = React.createClass({
  getInitialState: function() {
    console.log('init state', this.props.label);
    return {
      type: this.props.type || "text", 
      label: this.props.label,
      field: this.props.field,
      value: this.props.defaultValue || '',
      placeHolder: this.props.placeholder || '',
    };
  },

  componentWillReceiveProps: function(nextProps) {
    const {initData} = nextProps;

    if (initData) {
      let v = util.getFieldVal(initData, this.state.field);
      this.setState({value:  v});
    }
  }, 
 

  handleChange(event) { 
    let value = event.target.value;
    this.setState({value: value});

    if(this.props.onHandleChange) {
      
      this.props.onHandleChange({[this.state.field]: value});
    }
  },

  onlisten: function(e) {
    if(this.props.compute) this.props.compute(e, (data)=>{

    });
  },
  
  render: function() { 
    console.log('render', this.props.label);
    let validClass = '';//this.valid() ? 'has-success' : 'has-error'; 
    let className = this.props.className;
    let bodyClass = 'col-md-9 col-sm-9 col-xs-12';

    if (this.state.type == "hidden") {
      return (<input name={this.props.field} value={this.state.value} type="hidden"></input>);
    }

    if (this.props.style) {
      className += ' ' + this.props.style(this.state.value);
    }
    
    if (this.state.value) {
      this.props.onHandleChange({[this.state.field]: this.state.value});
    }


    let label = this.state.label ? (<label className="control-label col-md-3 col-sm-3 col-xs-12">{this.state.label} </label>): "";
    bodyClass = this.state.label ? bodyClass : "col-md-12 col-sm-12 col-xs-12";
    return ( 
      <div className={className}>
        <div className={validClass}>
          {label}
          <div className = {bodyClass}>
            <input name={this.props.field} placeholder={this.state.placeHolder} value={this.state.value} onChange={this.handleChange} type={this.state.type} className="form-control col-md-12 col-xs-12"/>
          </div>
        </div>
      </div>
    );
  }
});

export default RC_MyInput;
