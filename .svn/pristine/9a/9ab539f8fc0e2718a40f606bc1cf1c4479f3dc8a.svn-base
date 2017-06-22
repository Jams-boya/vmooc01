import 'rc-calendar/assets/index.css';
import RangeCalendar from 'rc-calendar/lib/RangeCalendar';
import React from 'react';
import ReactDOM from 'react-dom';
import Picker from 'rc-calendar/lib/Picker';

import 'rc-time-picker/assets/index.css';

import zhCN from 'rc-calendar/lib/locale/zh_CN';
import enUS from 'rc-calendar/lib/locale/en_US';
import 'rc-time-picker/assets/index.css';
import TimePickerPanel from 'rc-time-picker/lib/Panel';

import moment from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/en-gb';

import './mycalendar.css';
import util from './util'; 

const formatStr = 'YYYY-MM-DD'; 

const now = moment(); 
now.locale('zh-cn').utcOffset(8); 

const defaultCalendarValue = now.clone();
defaultCalendarValue.add(-1, 'month');

const timePickerElement = <TimePickerPanel />;
  
function format(v) {
  return v ? v.format(formatStr) : '';
}

function isValidRange(v) {
  return v && v[0] && v[1];
}

let RC_MyRangeCalendar = React.createClass({
  getInitialState() {
    return {
      showTime: this.props.showTime,
      showDateInput: true,
      disabled: false,
      value: this.props.defaultValue, 
      field: this.props.field,
      label: this.props.label,
      value: [],
    };
  },

  componentWillReceiveProps: function(nextProps) {

    const {initData} = nextProps;

    if (initData) {
      let v1 = util.getFieldVal(initData, this.state.field[0]);
      let v2 = util.getFieldVal(initData, this.state.field[1]);
      if (v1 && v2) {
        this.setState({value:  [moment(v1), moment(v2)]});
      } else { 
        this.setState({value: []});
      }
    }
  },

  clearCalendar: function (e) {
    e.preventDefault();    
    e.stopPropagation();

    this.setState({value:[]});
    
    if(this.props.onHandleChange) {
      this.props.onHandleChange({[this.state.field[0]]: '',[this.state.field[1]]: ''});
    } 
  },

  onChange(value) { 
    this.setState({
      value,
    });
 
    if(this.props.onHandleChange) {
      this.props.onHandleChange({[this.state.field[0]]: format(value[0]),[this.state.field[1]]: format(value[1])});
    } 
  },

  render() {
    const state = this.state;
    const calendar = (
      <RangeCalendar
        showWeekNumber={false}
        dateInputPlaceholder={['start', 'end']}
        defaultValue={[now, now]}
        locale={zhCN}
        disabledTime={state.showTime ? disabledTime : null}
        timePicker={state.showTime ? timePickerElement : null} 
      />
    );
    return (

      <div className={this.props.className}>
        <div >
          <label className="control-label col-md-3 col-sm-3 col-xs-12">
            {this.state.label} 
          </label>
          <div className="col-md-9 col-sm-9 col-xs-12">
            <Picker
              value={state.value}
              onChange={this.onChange}
              animation="slide-up"
              calendar={calendar}
            >
              {
                ({ value }) => {
                  return (<span>
                        <input
                          placeholder="" onChange={this.onChange}
                          disabled={state.disabled} 
                          className="form-control ant-calendar-picker-input ant-input"
                          value={isValidRange(value) && `${format(value[0])} - ${format(value[1])}` || ''}
                        />
                        <a className="calendarclear" type="button" onClick={this.clearCalendar}>×</a>
                        </span>);
                }
              }
            </Picker>
          </div>
        </div>
      </div>
    );
  },
});

export default RC_MyRangeCalendar;