import _ from 'lodash';

import 'rc-calendar/assets/index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import Calendar from 'rc-calendar';
import DatePicker from 'rc-calendar/lib/Picker';
import zhCN from 'rc-calendar/lib/locale/zh_CN';
import enUS from 'rc-calendar/lib/locale/en_US';
import 'rc-time-picker/assets/index.css';
import TimePickerPanel from 'rc-time-picker/lib/Panel';

import moment from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/en-gb';

import './mycalendar.css';
import util from './util'; 

const now = moment(); 
now.locale('zh-cn').utcOffset(8); 

function format(v, formatStr = 'YYYY-MM-DD') {
  return v ? v.format(formatStr) : '';
}

const defaultCalendarValue = now.clone();
defaultCalendarValue.add(-1, 'month');

const timePickerElement = <TimePickerPanel />;

let RC_MyCalendar = React.createClass({
  propTypes: {
    defaultValue: React.PropTypes.object,
    defaultCalendarValue: React.PropTypes.object,
  },

  getInitialState() {
    return {
      showTime: this.props.showTime,
      format: this.props.format || (this.props.showTime? 'YYYY-MM-DD HH:mm:ss' :'YYYY-MM-DD'),
      showDateInput: true,
      disabled: false,
      value: this.props.defaultValue || '',
      label: this.props.label,
      field: this.props.field
    };
  }, 

  componentWillReceiveProps: function(nextProps) {

    const {initData} = nextProps;

    if (initData) {
      let v = util.getFieldVal(initData, this.state.field);
      if (v) {
        this.setState({value:  moment(v)});
      } else { 
        this.setState({value:''});
      }
    }
  },

  clearCalendar: function (e) {
    e.preventDefault();    
    e.stopPropagation();

    this.setState({value:''});
    
    if(this.props.onHandleChange) {
      this.props.onHandleChange({[this.state.field]: ''});
    } 
  },

  onChange(value) { 
    this.setState({
      value,
    });
 

    if(this.props.onHandleChange) {
      this.props.onHandleChange({[this.state.field]: format(value, this.state.format)});
    }
  },

  render() {
    const state = this.state;
    const calendar = (<Calendar
      locale={ zhCN }
      style={{ zIndex: 1000 }}
      dateInputPlaceholder=""
      formatter={this.state.format} 
      timePicker={state.showTime ? timePickerElement : null}
      defaultValue={this.props.defaultCalendarValue}
      showDateInput={state.showDateInput} 
    />);
    return (
      <div className={this.props.className}>
        <div >
          <label className="control-label col-md-3 col-sm-3 col-xs-12">
            {this.state.label} 
          </label>
          <div className="col-md-9 col-sm-9 col-xs-12">
            <DatePicker
              animation="slide-up"
              disabled={state.disabled}
              calendar={calendar}
              value={state.value || NaN}
              onChange={this.onChange}
            >
              {
                ({ value }) => {
                  return (
                    <span tabIndex="0">
                    <input
                      placeholder="" onChange={this.onChange}
                      disabled={state.disabled} 
                      className="form-control ant-calendar-picker-input ant-input"
                      value={value && format(value, this.state.format) || ''}
                    />
                    <a className="calendarclear" type="button" onClick={this.clearCalendar}>×</a>
                    </span>
                  );
                }
              }
            </DatePicker>
          </div>
        </div>
      </div>
        
    );
  },
});

export default RC_MyCalendar;