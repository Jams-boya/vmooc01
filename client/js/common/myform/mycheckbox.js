import _ from 'lodash';
import React from 'react';
import ReactDom from 'react-dom';
import util from './util'; 

let RC_MyCheckbox = React.createClass({
  getInitialState: function() {
    return {
      label: this.props.label,
      field: this.props.field,
      value: this.props.defaultValue || false,
    };
  },

  componentWillReceiveProps: function(nextProps) {
    const {initData} = nextProps;

    if (initData) {
      let v = util.getFieldVal(initData, this.state.field);
      this.setState({value: v});
    }
  }, 

  handleChange(event) { 
    let value = event.target.checked;
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

    return ( 
      <div className={className}>
        <div className={validClass}>
          <label className="control-label col-md-3 col-sm-3 col-xs-12">
            {this.state.label} 
          </label>
          <div className="col-md-9 col-sm-9 col-xs-12">
            <input type="checkbox" checked={this.state.value} onChange={this.handleChange} className="form-control col-md-12 col-xs-12"/>
          </div>
        </div>
      </div>
    );
  }
});

export default RC_MyCheckbox;
