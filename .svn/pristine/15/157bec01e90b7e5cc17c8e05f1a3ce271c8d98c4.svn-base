import _ from 'lodash';
import React from 'react';
import ReactDom from 'react-dom';  
import RC_MyRadio from '../myradio'
import moment from 'moment';
import './myscheduler.css';

let RC_MySchedulerToolbar = React.createClass({
  getInitialState: function() {
    return {
      type: this.props.data.type,
      start: this.props.data.start,
      end: this.props.data.end
    };
  },

  onTypeChange: function (type) {
    this.state.type = type;

    if (this.state.type === 'week') {
      this.state.start = moment().weekday(0);
      this.state.end = moment().weekday(6);
    } else if (this.state.type === 'day') { 
      this.state.start = this.state.end = moment();
      console.log('day start', this.state.start);
    } else if (this.state.type === 'month') {
      this.state.start = moment().dates(1);
      let days = moment().daysInMonth();
      this.state.end = moment().dates(days);
    }

    this.onDateRangeChange();
  },

  prev: function () {
    if (this.state.type === 'week') {
      this.state.start.add(-7, 'd');
      this.state.end.add(-7, 'd');
    } else if (this.state.type === 'day') {
      this.state.start.add(-1, 'd');
      this.state.end.add(-1, 'd');
    } else if (this.state.type === 'month') {
      this.state.start.add(-1, 'M');
      let days = this.state.end.add(-1, 'M').daysInMonth();
      this.state.end.dates(days);
    }

    this.onDateRangeChange();
  },

  next: function () {
    if (this.state.type === 'week') {
      this.state.start.add(7, 'd');
      this.state.end.add(7, 'd');
    } else if (this.state.type === 'day') {
      this.state.start.add(1, 'd');
      this.state.end.add(1, 'd');
    } else if (this.state.type === 'month') {
    console.log('toolbar type', this.state.type,this.state.start.format('YYYY-MM-DD'),this.state.end.format('YYYY-MM-DD'));
      this.state.start.add(1, 'M');
      this.state.end.add(1, 'M');
    }

    this.onDateRangeChange();
  },

  onDateRangeChange: function () {
    if(this.props.onDateRangeChange) this.props.onDateRangeChange(this.state);
  },

  render: function() { 
    let typeData = [{value: 'day', text: '日'}, {value: 'week', text: '周'}, {value: 'month', text: '月'}];
    typeData.map((type)=>{
      if(type.value === this.props.data.type) {
        type.checked = true;
      }
    });

    let showDate = '';
    if(this.state.start.format('YYYY-MM-DD') === this.state.end.format('YYYY-MM-DD')) {
      showDate = this.state.start.format('YYYY-MM-DD');
    } else {
      showDate = this.state.start.format('YYYY-MM-DD') + ' ~ ' + this.state.end.format('YYYY-MM-DD'); 
    }

    return (
      <div className="myschedulertoolbar clearfix">
        <div className="left">
          <RC_MyRadio name="myschedulerType"
                      data={typeData}
                      onHandleChange={this.onTypeChange}>
          </RC_MyRadio>
        </div>
        <div className="center">
          <button type="button" className="btn btn-default pull-left" onClick={this.prev}><i className="fa fa-angle-left"></i></button>
          <h4 className="pull-left date-range">{showDate}</h4>
          <button type="button" className="btn btn-default pull-left" onClick={this.next}><i className="fa fa-angle-right"></i></button> 
        </div>
        <div className="right"> 
        </div>
      </div>
    );
  }

});

let RC_MySchedulerHeader = React.createClass({
  getInitialState: function() { 
    return {
      type: this.props.data.type,
      start: this.props.data.start,
      end: this.props.data.end
    }; 
  },
 
  componentWillReceiveProps: function(nextProps) { 
    this.setState({
      type: nextProps.data.type,
      start: nextProps.data.start, 
      end: nextProps.data.end
    });
  },

  render: function () { 
    let headThs = [];

    if (this.state.type === 'day') {
      let week = this.state.start.day();
      headThs.push(<th key="1" width="90px;"></th>);
      headThs.push(<th key="2">星期{week}</th>);
    } else if (this.state.type === 'week') {
      headThs = ['', '一', '二', '三', '四', '五', '六', '七'].map((col, i) => {
        if (i ===0 ) {
          return(<th key={i}></th>);
        } 

        return (<th key={i}>星期{col}</th>); 
      });   
    } else if(this.state.type === 'month') {
      headThs = [ '一', '二', '三', '四', '五', '六', '七'].map((col, i) => {  
        return (<th key={i}>星期{col}</th>); 
      }); 
    } else {
      console.error('unsupported scheduler type', this.state.type);
    }

    return (
      <thead><tr>{headThs}</tr></thead>
    );
  }
});

let RC_MySchedulerWeekBody = React.createClass({
  getInitialState: function() { 
    return {
      type: this.props.data.type,
      start: this.props.data.start,
      end: this.props.data.end,
      timeSlots: this.props.data.timeSlots || [],
      events: this.props.data.events || []
    }; 
  },

  componentWillReceiveProps: function(nextProps) { 
    this.setState({
      type: nextProps.data.type,
      start: nextProps.data.start, 
      end: nextProps.data.end,
      timeSlots: nextProps.data.timeSlots || [],
      events: nextProps.data.events || []
    });
  },

  onAddEvent: function (weekday, timeSlot, e) { 
    e.preventDefault();    
    e.stopPropagation();
    let date = this.state.start.clone();

    date = moment(date.format('YYYY-MM-DD'));

    if(this.props.onAddEvent) this.props.onAddEvent(date.add(weekday-1,'d'), timeSlot);
  },

  onEditEvent: function (event, e) { 
    e.preventDefault();    
    e.stopPropagation();
    if(this.props.onEditEvent) this.props.onEditEvent(event);
  },

  onOpr: function (event, oprCode, e) { 
    e.preventDefault();    
    e.stopPropagation();
    if(this.props.onOpr) this.props.onOpr(event, oprCode);
  },

  render: function () {
    console.log('render body week', this.state); 

    let body = this.state.timeSlots.map((timeSlot, i)=>{
      let tds = [1,2,3,4,5,6,7].map((weekday, i) => {
        let event = _.filter(this.state.events, function (o) {
          return moment(o.time).day() == weekday && moment(o.time).format('HH:mm') == timeSlot.beginAt;
        }); 
        if(event && event.length > 0) {
          let eventContent = event.map((eventItem, eventIdx)=>{
            //时间格式化
            let time = moment(eventItem.time).format('HH:mm');
            //生成操作按钮
            let opr = eventItem.oprs.map( (opr, oprIdx)=>{
              return (<a key={oprIdx} onClick={this.onOpr.bind(this, eventItem, opr.code)} title={opr.title}><i className={opr.className}></i></a>)
            });

            return (<li key={eventIdx} className={eventItem.style}><a onClick={this.onEditEvent.bind(this, eventItem)}><i className="fa fa-circle"></i> {time} {eventItem.display}</a> {opr}</li>);
          });
          return (<td onClick={this.onAddEvent.bind(this, weekday, timeSlot)} key={i} className="aligntop" width="14.3%"><ul>{eventContent}</ul></td>);
        }
        else {
          return (<td onClick={this.onAddEvent.bind(this, weekday, timeSlot)} key={i} className="aligntop" width="14.3%"><a></a></td>);
        }
      });

      let timeSlotDisplay = '';

      if(timeSlot.beginAt == timeSlot.endAt) timeSlotDisplay = timeSlot.beginAt;
      else timeSlotDisplay = timeSlot.beginAt + "~" + timeSlot.endAt;

      let timeSlotDisplayTd;

      if (this.state.type === 'day' || this.state.type === 'week') {
        timeSlotDisplayTd = (<td>{timeSlotDisplay}</td>);
      }

      return (
        <tr key={i}>
          {timeSlotDisplayTd}
          {tds} 
        </tr>
      );
    }); 

    return ( 
      <tbody> 
        {body} 
      </tbody> 
    );
  }
});


let RC_MySchedulerDayBody = React.createClass({
  getInitialState: function() { 
    return {
      type: this.props.data.type,
      start: this.props.data.start,
      end: this.props.data.end,
      timeSlots: this.props.data.timeSlots || [],
      events: this.props.data.events || []
    }; 
  },

  componentWillReceiveProps: function(nextProps) { 
    this.setState({
      type: nextProps.data.type,
      start: nextProps.data.start, 
      end: nextProps.data.end,
      timeSlots: nextProps.data.timeSlots || [],
      events: nextProps.data.events || []
    });
  },

  onAddEvent: function (date, timeSlot, e) { 
    e.preventDefault();    
    e.stopPropagation();

    if(this.props.onAddEvent) this.props.onAddEvent(date.clone(), timeSlot);
  },

  onEditEvent: function (event, e) { 
    e.preventDefault();    
    e.stopPropagation();
    if(this.props.onEditEvent) this.props.onEditEvent(event);
  },

  onOpr: function (event, oprCode, e) { 
    e.preventDefault();    
    e.stopPropagation();
    if(this.props.onOpr) this.props.onOpr(event, oprCode);
  },

  render: function () {
    console.log('render body day', this.state); 

    let body = this.state.timeSlots.map((timeSlot, i)=>{
      let td;
      let event = _.filter(this.state.events, function (o) {
        return moment(o.time).format('HH:mm') == timeSlot.beginAt;
      });  
      if(event && event.length > 0) {
        let eventContent = event.map((eventItem, eventIdx)=>{
          //时间格式化
          let time = moment(eventItem.time).format('HH:mm');
          //生成操作按钮
          let opr = eventItem.oprs.map( (opr, oprIdx)=>{
            return (<a key={oprIdx} onClick={this.onOpr.bind(this, eventItem, opr.code)} title={opr.title}><i className={opr.className}></i></a>)
          });

          return (<li key={eventIdx} className={eventItem.style}><a onClick={this.onEditEvent.bind(this, eventItem)}><i className="fa fa-circle"></i> {time} {eventItem.display}</a> {opr}</li>);
        });
        td = (<td onClick={this.onAddEvent.bind(this, this.state.start, timeSlot)} key={i} className="aligntop"><ul>{eventContent}</ul></td>);
      }
      else {
        td = (<td onClick={this.onAddEvent.bind(this, this.state.start, timeSlot)} key={i} className="aligntop"><a></a></td>);
      } 

      let timeSlotDisplay = '';

      if(timeSlot.beginAt == timeSlot.endAt) timeSlotDisplay = timeSlot.beginAt;
      else timeSlotDisplay = timeSlot.beginAt + "~" + timeSlot.endAt;

      let timeSlotDisplayTd;

      if (this.state.type === 'day' || this.state.type === 'week') {
        timeSlotDisplayTd = (<td>{timeSlotDisplay}</td>);
      }

      return (
        <tr key={i}>
          {timeSlotDisplayTd}
          {td} 
        </tr>
      );
    }); 

    return ( 
      <tbody> 
        {body} 
      </tbody> 
    );
  }
});


let RC_MySchedulerMonthBody = React.createClass({
  getInitialState: function() { 
    return {
      type: this.props.data.type,
      start: this.props.data.start,
      end: this.props.data.end,
      timeSlots: this.props.data.timeSlots || [],
      events: this.props.data.events || []
    }; 
  },

  componentWillReceiveProps: function(nextProps) { 
    this.setState({
      type: nextProps.data.type,
      start: nextProps.data.start, 
      end: nextProps.data.end,
      timeSlots: nextProps.data.timeSlots || [],
      events: nextProps.data.events || []
    });
  },

  onAddEvent: function (date, timeSlot, e) { 
    e.preventDefault();    
    e.stopPropagation(); 

    if(this.props.onAddEvent) this.props.onAddEvent(date, timeSlot);
  },

  onEditEvent: function (event, e) { 
    e.preventDefault();    
    e.stopPropagation();
    if(this.props.onEditEvent) this.props.onEditEvent(event);
  },

  onOpr: function (event, oprCode, e) { 
    e.preventDefault();    
    e.stopPropagation();
    if(this.props.onOpr) this.props.onOpr(event, oprCode);
  },

  render: function () {
    console.log('render body month', this.state); 

    let timeSlot = {beginAt:'09:00', endAt:'09:45'};

    let startDate = this.state.start.weekday(0);

    let body = [0, 1, 2, 3, 4, 5].map((rowIdx, i)=>{
      let tds = [0, 1, 2, 3, 4, 5, 6].map((weekday, i) => {
        let monthdate = startDate.clone().add(rowIdx*7+weekday, 'd');

        let dayOfMonth;
        if(monthdate.date() === 1) { 
          dayOfMonth = (monthdate.month() + 1) + '月' + monthdate.date() + '日';
        }
        else { 
          dayOfMonth = monthdate.date();
        }

        let event = _.filter(this.state.events, function (o) {
          return moment(o.time).format('YYYY-MM-DD') == monthdate.format('YYYY-MM-DD');
        }); 
        if(event && event.length > 0) {
          let eventContent = event.map((eventItem, eventIdx)=>{
            //时间格式化 

            return (<li key={eventIdx} className={eventItem.style}><a onClick={this.onEditEvent.bind(this, eventItem)}><i className="fa fa-circle"></i></a></li>);
          });
          return (<td onClick={this.onAddEvent.bind(this, monthdate, timeSlot)} key={i} className="aligntop" width="14.3%" height="110px"><span className="schedulerDate">{dayOfMonth}</span><ul>{eventContent}</ul></td>);
        }
        else {
          return (<td onClick={this.onAddEvent.bind(this, monthdate, timeSlot)} key={i} className="aligntop" width="14.3%"  height="110px"><span className="schedulerDate">{dayOfMonth}</span><a></a></td>);
        }
      });
 
      return (
        <tr key={i}> 
          {tds} 
        </tr>
      );
    }); 

    return ( 
      <tbody className="monthstyle"> 
        {body} 
      </tbody> 
    );
  }
});

let RC_MySchedulerBody = React.createClass({
  getInitialState: function() { 
    return {
      type: this.props.data.type,
      start: this.props.data.start,
      end: this.props.data.end,
      timeSlots: this.props.data.timeSlots || [],
      events: this.props.data.events || []
    }; 
  },

  componentWillReceiveProps: function(nextProps) { 
    this.setState({
      type: nextProps.data.type,
      start: nextProps.data.start, 
      end: nextProps.data.end,
      timeSlots: nextProps.data.timeSlots || [],
      events: nextProps.data.events || []
    });
  },

  onAddEvent: function (date, timeSlot) {     
    if(this.props.onAddEvent) this.props.onAddEvent(date, timeSlot);
  },

  onEditEvent: function (event) {  
    if(this.props.onEditEvent) this.props.onEditEvent(event);
  },

  onOpr: function (event, oprCode) {  
    if(this.props.onOpr) this.props.onOpr(event, oprCode);
  },

  render: function () {
    console.log('render body', this.state); 

    let body;

    if (this.state.type === 'week') {
      body = (<RC_MySchedulerWeekBody data={this.state} onAddEvent={this.onAddEvent} onEditEvent={this.onEditEvent} onOpr={this.onOpr}></RC_MySchedulerWeekBody>);
    } else if (this.state.type === 'day') {
      body = (<RC_MySchedulerDayBody data={this.state} onAddEvent={this.onAddEvent} onEditEvent={this.onEditEvent} onOpr={this.onOpr}></RC_MySchedulerDayBody>);
    } else if (this.state.type === 'month') {
      body = (<RC_MySchedulerMonthBody data={this.state} onAddEvent={this.onAddEvent} onEditEvent={this.onEditEvent} onOpr={this.onOpr}></RC_MySchedulerMonthBody>);
    }
 
    return (
      <div>
        <table className="table table-bordered marginTop"> 
          <RC_MySchedulerHeader data={this.state}></RC_MySchedulerHeader>  
          {body}  
        </table>
      </div>
    );
  }
});

let RC_MyScheduler = React.createClass({
  getInitialState: function() {
    return {
      type: 'week',
      timeSlots: this.props.timeSlots, 
      start: moment().weekday(0),
      end: moment().weekday(6),
      events: [],
      url: '',
      params: {}
    };
  },

  loadModels: function (url, params = {}) {
    const nextState = {
      type: this.state.type,
      url: url || this.state.url,
      start: this.state.start,
      end: this.state.end,
      params: {...this.state.params, ...params},
      events: []
    }; 

    nextState.params = {...nextState.params, ...{ 
        type: this.state.type,
        start: moment(nextState.start.format('YYYY-MM-DD')).format('x'),
        end:  moment(nextState.end.format('YYYY-MM-DD')).add(1,'d').add(-1, 's').format('x')
      }
    };
 
    console.log('nextstate', nextState);

    if(nextState.url) {
      $.ajax({
        url: encodeURI(nextState.url),
        method: "GET",
        data: nextState.params,
        dataType: "json"
      }).done((result) => { 
        nextState.events = result;  
        this.setState(nextState); 
      });  
    }
  }, 

  onDateRangeChange: function (data) {
    this.state.type = data.type;
    this.state.start = data.start;
    this.state.end = data.end;

    this.loadModels();
  },

  onAddEvent: function (date, timeSlot) {  
    if(this.props.onAddEvent) this.props.onAddEvent(date, timeSlot);
  },

  onEditEvent: function (event) { 
    if(event.clickResult === 'edit') {
      if(this.props.onEditEvent) this.props.onEditEvent(event.data);
    }
    else if(event.clickResult === 'detail') {
      if(this.props.onShowDetail) this.props.onShowDetail(event.data);
    }
  },

  onOpr: function (event, oprCode) {
    if(this.props.onOpr) this.props.onOpr(event.data, oprCode);
  },
 
  render: function() {
    console.log('render all', this.state);
    return (
      <div className="myscheduler">
        <RC_MySchedulerToolbar data={this.state} onDateRangeChange={this.onDateRangeChange}/>

        <RC_MySchedulerBody data={this.state} onAddEvent={this.onAddEvent} onEditEvent={this.onEditEvent}  onOpr={this.onOpr}/>
      </div>
    );
  }
});

export default RC_MyScheduler;

