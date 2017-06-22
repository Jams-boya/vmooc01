import _ from 'lodash';
import React from 'react';
import ReactDom from 'react-dom'; 

let RC_MyCheckboxList = React.createClass({
  getInitialState: function() {
    return {values: []};
  },

  handleChange: function(event) {
    let selectedVals = [];
    this.props.data.map(function (checkboxData) {
      if(checkboxData.value.toString() === event.target.value.toString()) checkboxData.checked = !checkboxData.checked;
      
      if(checkboxData.checked && checkboxData.value) selectedVals.push(checkboxData.value); 
    });

    if(this.props.onHandleChange) this.props.onHandleChange(selectedVals);

    this.setState({values: this.props.data});//update control state
  },

  render: function() {   
    let radioNode = this.props.data.map((checkboxData, idx) => {
      let c = checkboxData.checked === true ? 'btn btn-success' : 'btn btn-default'; 
      return (
        <label key={idx} className={c} value={checkboxData.value} onClick={this.handleChange}>
          <input type="checkbox" name={this.props.name} value={checkboxData.value} checked={checkboxData.checked} onChange={this.handleChange} /> {checkboxData.text}
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

let RC_MyCheckbox = React.createClass({
  getInitialState: function() {
    return {data: [], selectedValues:[]};
  },

  loadModels: function(data) { 
    this.setState({data: data});
  },

  val: function() {
    return this.state.selectedValues;
  },

  onHandleChange: function (selectedValues) {
    this.state.selectedValues = selectedValues;
    if(this.props.onHandleChange) this.props.onHandleChange(selectedValues);
  },

  render: function() {
    return (
      <div>
        <RC_MyCheckboxList data={this.state.data} name={this.props.name} onHandleChange={this.onHandleChange}/> 
      </div>
    );
  }
});

export default RC_MyRadio;