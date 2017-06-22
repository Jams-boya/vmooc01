import _ from 'lodash';
import React from 'react';
import ReactDom from 'react-dom'; 

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
    return {data: this.props.data || []};
  },

  loadModels: function(data) { 
    this.setState({data: data});
  },

  val: function(setValue) {
    if(setValue !== undefined) {
      this.state.data.map(function (radioData) {
        if(radioData.value.toString() === setValue.toString()) radioData.checked = true;
        else radioData.checked = false;
      });

      this.setState({data: this.state.data});
    }

    return this.state.value;
  },

  onHandleChange: function (value) {
    this.state.value = value;
    if(this.props.onHandleChange) this.props.onHandleChange(value);
  },

  render: function() {
    return (
      <div>
        <RC_MyRadioList data={this.state.data} name={this.props.name} onHandleChange={this.onHandleChange}/> 
      </div>
    );
  }
});

export default RC_MyRadio;