import _ from 'lodash';
import React from 'react';
import ReactDom from 'react-dom';
import util from '../common/myform/util'; 

let RC_MyCheckbox = React.createClass({
  getInitialState: function() {
    return {
      url  : this.props.url || null,
      label: this.props.label,
      field: this.props.field,
      type : this.props.type,
      value : [],
    };
  },
  componentWillMount() { 
    this.props.type.values.map((val, idx) => {
      this.state.type.values[idx].checked = false;
      this.state.value.push(false);
    });
  },


  componentWillReceiveProps: function(nextProps) {
    const {initData} = nextProps;
    if (initData) {
      let v = util.getFieldVal(initData, this.state.field);
      this.setState({value: v});
    }
  }, 

  handleChange(idx, event) { 
    let ckvalue = event.target.checked;
    let type   = this.state.type.values;
    let value  = this.state.value;
    value[idx] = ckvalue;
    type[idx].checked = ckvalue;
    this.setState({value: value});

    if(this.props.onHandleChange) {
      this.props.onHandleChange({[this.state.field]: type});
    }
  },

  onlisten: function(e) {
    if(this.props.compute) this.props.compute(e, (data)=>{

    });
  },
  
  render: function() { 
    let validClass = '';
    let typearr = this.state.type.values;
    let newarr;
    let label;

    let className = this.props.className;
    if (typearr.length !==0) {
      newarr = typearr.map((val, idx) => {
        if (idx === 0) {
          label = "* 擅长:";
        } else {
          label = "";
        }
        return (
          <div key={idx}>
          <div className={className}>
            <div className={validClass}>
              <label className="control-label col-md-3 col-sm-3 col-xs-12">
                {label}
              
              </label>
              <div className="col-md-9 col-sm-9 col-xs-12">
                <label className="control-label">
                  <input type="checkbox" checked={this.state.value[idx]} onChange={this.handleChange.bind(this, idx)} />
                  {val.name}
               </label>


              </div>
            </div>
          </div>
        </div>
        )
      });

    } else {
      newarr =(<div className={className}>
        <div className={validClass}>
          <label className="control-label col-md-3 col-sm-3 col-xs-12">
            {this.state.label} 
          </label>
          <div className="col-md-9 col-sm-9 col-xs-12">
            <input type="checkbox" checked={this.state.value} onChange={this.handleChange} className="form-control col-md-12 col-xs-12"/>
          </div>
        </div>
      </div>)
    }
    return ( 
      <div>
        {newarr}
      </div>
    );
  }
});

export default RC_MyCheckbox;

