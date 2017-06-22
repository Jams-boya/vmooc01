import _ from 'lodash';
import React from 'react';
import ReactDom from 'react-dom';
import Select from 'react-select'
import 'react-select/dist/react-select.css';
import util from './util'; 

let RC_MySelect = React.createClass({
  getInitialState: function() { 
    console.log(this.props); 
    return { 
      placeholder: this.props.placeholder || '请选择',
      label: this.props.label,
      labelClassName: this.props.labelClassName,
      multi: this.props.multi || false, 
      multifield: this.props.multifield,
      valuefield: this.props.valuefield,
      labelfield: this.props.labelfield,
      value: this.props.defaultValue || '', 
      options: this.props.options || []
    }; 
  },

  componentWillMount() {   
    //init data 
    if(this.props.remoteurl) {
      $.ajax({
        headers: {
          'Accept'       : 'application/json',
          'Content-Type' : 'application/json'
        },
        url: this.props.remoteurl,
        type: 'GET',
        data: {nd: new Date().getTime()}, 
        success: (data) => {
          if (data.error) {
            console.warn('初始化' + this.props.label + '失败:' + data.error);
            return;
          } 

          let remoteOptions =data.map((item) => {
            return {value:item[this.props.remotevalue], label: item[this.props.remotelabel]};
          }); 
  
          this.setState({options: remoteOptions});
        },
        error: (err) => {
          console.warn('初始化' + this.props.label + '失败:' + err); 
        }
      });
    } 
  }, 


  componentWillReceiveProps: function(nextProps) { 
    const {initData} = nextProps;

    if (initData) {
      let v;
      if (this.state.multi) { 
        let multivalue = util.getFieldVal(initData, this.state.multifield); 
        if (Array.isArray(multivalue)) {
          v = multivalue.map((value) => {
            return {value: value[this.state.valuefield], label: value[this.state.labelfield]};
          });
        } else {
          v = [];
        }
      }
      else {
        v = util.getFieldVal(initData, this.state.valuefield);   
      } 
      this.setState({value:  v});
    }
  }, 

  handleChange(val) {
    let state = {...this.state, ...{value: val}};
    this.setState(state);

    if(this.props.onHandleChange) {
      if(!val){
        this.props.onHandleChange({[this.state.valuefield]: '', [this.state.labelfield]: ''});
      }
      else if(Array.isArray(val)) {
        let multivalue = val.map((option)=>{
          return {[this.state.valuefield]: option.value, [this.state.labelfield]: option.label};
        });

        this.props.onHandleChange({[this.state.multifield]: multivalue});
      } else { 
        this.props.onHandleChange({[this.state.valuefield]: val.value, [this.state.labelfield]: val.label});
      }
    }
  },

  onlisten: function(e) {

  },
  
  render: function() {
    let labelClass = 'control-label col-md-3 col-sm-3 col-xs-12';
    let bodyClass = 'col-md-9 col-sm-9 col-xs-12';
    if (this.props.labelClassName) {
      labelClass = `${labelClass} ${this.props.labelClassName}`;
    }
    if (this.props.forminline) {
      labelClass = '';
      bodyClass = ''
    }

    let label = this.state.label ? (<label className={labelClass}>{this.state.label} </label>): "";
    bodyClass = this.state.label ? bodyClass : "col-md-12 col-sm-12 col-xs-12";

    return ( 
      <div className={this.props.className}> 
            {label}
            <Select 
              className={bodyClass}
              name="form-field-name" 
              options={this.state.options}
              placeholder={this.state.placeholder}
              multi={this.state.multi}
              onChange={this.handleChange}
              value={this.state.value}
            /> 
        </div> 
    );
  }
});

export default RC_MySelect;
