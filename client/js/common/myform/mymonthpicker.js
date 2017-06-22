import _ from 'lodash';
import React from 'react';
import ReactDom from 'react-dom'; 
import util from './util'; 
import Picker from 'react-month-picker'
import 'react-month-picker/css/month-picker.css';
import moment from 'moment';
 
let RC_MyMonthPicker = React.createClass({
  propTypes: {
  }, 
  
  getInitialState() {
      return {
        label: this.props.label || '',
        field: this.props.field || '',
        mvalue: {year: moment().year(), month: moment().month() + 1} 
      }
  }, 

  componentWillReceiveProps(nextProps){ 
    const {initData} = nextProps;

    if (initData) {
      let v = util.getFieldVal(initData, this.state.field);
      if (v) {
        this.setState({mvalue:  v});
      }
    }
  }, 

  handleClickMonthBox(e) {
    this.refs.pickAMonth.show()
  }, 

  handleAMonthChange(value, text) {    
  }, 

  handleAMonthDissmis(value) {
    this.setState( {mvalue: value} );

    if(this.props.onHandleChange) { 
      this.props.onHandleChange({[this.state.field]: value});
    } 
  },  
  
  render: function() {   
    let labelClass = 'control-label col-md-3 col-sm-3 col-xs-12';
    let bodyClass = 'col-md-9 col-sm-9 col-xs-12';
    if (this.props.forminline) {
      labelClass = '';
      bodyClass = ''
    }


    let pickerLang = {
            months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
            , from: '开始', to: '结束'
        }
        , mvalue = this.state.mvalue ;

    let makeText = m => {
        if (m && m.year && m.month) return (m.year + '年 ' + pickerLang.months[m.month-1] )
        return '?'
    } 

    return ( 

      <div className={this.props.className}> 
            
      <Picker
          ref="pickAMonth" 
          value={mvalue}
          lang={pickerLang.months}
          onChange={this.handleAMonthChange}
          onDismiss={this.handleAMonthDissmis}
          > 
            <div className="box" onClick={this.handleClickMonthBox}> 
              <label  className={labelClass}>
                {this.state.label} 
              </label>
              <div >
                <label>{makeText(mvalue)}</label>
              </div> 
            </div> 
      </Picker>
      </div>
    );
  }
});

export default RC_MyMonthPicker;
