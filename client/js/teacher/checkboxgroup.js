import _ from 'lodash';
import React from 'react';
import ReactDom from 'react-dom';

import util from '../common/myform/util';

let RC_MyCheckbox = React.createClass({
  getInitialState: function () {
    return {
      label: this.props.label,
      field: this.props.field,
      type: this.props.type,
      value: [],
    };
  },
  componentWillMount() {
    if (!this.props.type) {
      return;
    }
    this.props.type.values.map((val, idx) => {
      this.state.type.values[idx].checked = false;
      this.state.value.push(false);
    });
  },
  componentWillReceiveProps: function (nextProps) {
    const {initData} = nextProps;
    let {type, value} = this.state;
    if (initData) {
      if (initData["skilled"]) {
      initData.skilled.map((val,idx) => {
        type.values.map((va, idx) => {
          if (va.name === val) {
            type.values[idx].checked = true;
            value[idx] = true;
          }
        });
      });
      if (this.props.onHandleChange) {
        this.props.onHandleChange({[this.state.field]: type.values });
      }
      this.setState({});
    } else {
      this.state.value.map((val, idx) => {
        val = false;
      });
      this.state.type.values.map((val, idx) => {
        val.checked = false;
      });
    }
  }
  },

  handleChange(idx, event) {
    let ckvalue = event.target.checked;
    let type = this.state.type.values;
    let value = this.state.value;
    value[idx] = ckvalue;
    type[idx].checked = ckvalue;
    this.setState({ value: value });
    if (this.props.onHandleChange) {
      this.props.onHandleChange({ [this.state.field]: type });
    }
  },

  render: function () {
    let label = this.props.label;
    let typearr = [];
    let validClass = '';
    let className = this.props.className;
    if (this.state.type) {
      typearr = this.state.type.values;
    }

    let newarr = typearr.map((val, idx) => {
      return (
        <div key={idx}>
          <div className="col-xs-4 col-sm-4">
            <label className="control-label">
              <input type="checkbox" checked={this.state.value[idx]}
                onChange={this.handleChange.bind(this, idx) } />
              {val.name}
            </label>
          </div>
        </div>
      );
    });
    return (
      <div className="item form-group col-md-12 col-sm-12 col-xs-12">
        <label className="control-label col-md-3 col-sm-3 col-xs-12" >
          {label}
        </label>
        <div className="col-md-9 col-sm-9 col-xs-12">
          {newarr}
        </div>
      </div>
    )
  }
});

export default RC_MyCheckbox;

