import _ from 'lodash';
import React from 'react';
import ReactDom from 'react-dom';
import util from './util'; 

let RC_MyStatic = React.createClass({
  getInitialState: function() {
    console.log('init state', this.props.label);
    return {
      type: this.props.type || "text", 
      label: this.props.label,
      field: this.props.field,
      value: this.props.defaultValue || ''
    };
  },

  componentWillReceiveProps: function(nextProps) {
    const {initData} = nextProps;

    if (initData) {
      let v = util.getFieldVal(initData, this.state.field);
      this.setState({value:  v});
    }
  }, 
    
  render: function() { 
    let className = this.props.className;
    if (this.state.type == "hidden") {
      return (<input name={this.props.field} value={this.state.value} type="hidden"></input>);
    }

    if (this.props.style) {
      className += ' ' + this.props.style(this.state.value);
    }  

    let displayValue = this.state.value;

    if (this.props.displayChange) {
      displayValue = this.props.displayChange(displayValue);
    }

    return ( 
      <div className={className}> 
        <label className="control-label col-md-3 col-sm-3 col-xs-12">
          {this.state.label} 
        </label>
        <div className="col-md-9 col-sm-9 col-xs-12">
          <p className="form-control-static">{displayValue}</p>
        </div> 
      </div>
    );
  }
});

export default RC_MyStatic;
