import _ from 'lodash';
import React from 'react';
import ReactDom from 'react-dom'; 
import util from './util'; 

let RC_MyRadioList = React.createClass({
  getInitialState: function() {
    return {value: ''};
  },

  handleChange: function(event) {
    this.props.data.map(function (radioData) {
      if(radioData.value.toString() === event.target.value.toString()) radioData.checked = true;
      else radioData.checked = false;
    });

    if(this.props.onHandleChange) this.props.onHandleChange(event.target.value);

    this.setState({value: event.target.value});
  },

  render: function() {   
    let radioNode = this.props.data.map((radioData, idx) => {
      let c = radioData.checked === true ? 'btn btn-success' : 'btn btn-default'; 
      return (
        <label key={idx} className={c} value={radioData.value} onClick={this.handleChange}>
          <input type="radio" name={this.props.name} value={radioData.value} checked={radioData.checked} onChange={this.handleChange} /> {radioData.text}
        </label>
      );
    });

    return ( 
      <div className="btn-group" data-toggle="buttons">
        {radioNode} 
      </div>
    );
  }
});

let RC_MyRadio = React.createClass({
  getInitialState: function() {
    return {
      label: this.props.label,
      field: this.props.field, 
      data: this.props.data || [], 
      name: this.props.name,
      value: this.props.defaultValue || ''
    };
  },

  loadModels: function(data) { 
    this.setState({data: data});
  },
 
  componentWillReceiveProps: function(nextProps) { 
    const {initData} = nextProps;

    if (initData) {
      let v = util.getFieldVal(initData, this.state.field);
      // if (!v) { 
      //   v = this.props.defaultValue
      // };
      this.setState({value:  v});
    }
  },  

  onHandleChange: function (value) {
    if(this.state.field) value = {[this.state.field]: value}

    if(this.props.onHandleChange) this.props.onHandleChange(value);
  },

  render: function() {
    let state = this.state;
    state.data.map(function (radioData) {
      if(radioData.value.toString() === state.value.toString()) radioData.checked = true;
      else radioData.checked = false;
    });

    return (
      <div className={this.props.className}>
        <div>
          <label className="control-label col-md-3 col-sm-3 col-xs-12">
            {this.state.label} 
          </label>
          <div className="col-md-9 col-sm-9 col-xs-12">
            <RC_MyRadioList data={this.state.data} name={this.state.name} onHandleChange={this.onHandleChange}/>
          </div>
        </div>
      </div>  
    );
  }
});

export default RC_MyRadio;