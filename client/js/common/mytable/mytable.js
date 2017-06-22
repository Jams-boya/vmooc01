import _ from 'lodash';
import React from 'react';
import ReactDom from 'react-dom';
import {DropdownButton, MenuItem} from 'react-bootstrap';
import './mytable.css';

//----------------------------MyTableColumn------------------------------------
export let RC_MyTableHeaderColumn = React.createClass({

  getInitialState: function() {
    return {
      order: 'desc',
    }
  },

  onClick: function(e) {

    const {sortable, onSort, dataField} = this.props;

    if (sortable) {
      this.setState({
        order: this.state.order === 'desc' ? 'asc' : 'desc'
      });

      onSort(dataField, this.state.order);
    }
  },

  onCheckboxClick: function(e) {
    this.props.onCheckboxClick(-1, e.target.checked);
  },

  render: function() {

    const {title, sortable, dataField, sortInfo, checkbox, width} = this.props;

    let className = '';
    let sortSpan = null;
    let content = title;

    if (sortable) {
      className = 'sort-column';
      if (dataField === sortInfo.field) {
        let sortClassName = sortInfo.order === 'asc' ? 'order dropup' : 'order';
        sortSpan = (<span className={sortClassName}><span className="caret" ></span></span>);
      }
    }

    if (checkbox) {
      content = (
        <input type="checkbox" 
          defaultChecked={false}
          onClick={this.onCheckboxClick}
        />
      );
    }

    return (
      <th className={className} style={{width}}>
        <div ref="innerDiv" onClick={this.onClick}>
          {content}
          {sortSpan}
        </div>
      </th>
    );
  }
});

//----------------------------MyTableHeader------------------------------------
let RC_MyTableHeader = React.createClass({

  attachSortFunc: function() {
    let children = React.Children.map(this.props.children, (child, idx) => {
      return React.cloneElement(
        child,
        {
          key: idx,
          onCheckboxClick: this.props.onCheckboxClick,
          onSort: this.props.onSort, 
          sortInfo: this.props.sortInfo,
        }
      );      
    });

    return children;
  },

  render: function() {
    return (
      <div className='table-header'>
        <table className='table table-hover' style={{marginBottom: '0px'}}>
          <thead>
            <tr ref="header">
              {this.attachSortFunc()}
            </tr>
          </thead>
        </table>
      </div>
    );
  }
});

//----------------------------MyTableBody--------------------------------------
var RC_MyTableBody = React.createClass({

  onRowClick: function(i) {
    const {onRowClick} = this.props;
    onRowClick && onRowClick(i);
  },

  onRowDoubleClick: function(i, e) {
    e.preventDefault();
    e.stopPropagation();
    const {onRowDoubleClick} = this.props;
    onRowDoubleClick && onRowDoubleClick(i);
  },

  onCustomizeOpr: function(i, code, e) {
    e.preventDefault();    
    e.stopPropagation();
    this.props.onCustomizeOpr(i, $(e.target), code);
  },

  linkActionWrapper: function(linkAction, mrow, mIdx, e) {
    e.preventDefault();    
    e.stopPropagation();

    linkAction(mrow, mIdx, e.target);
  },

  onCheckboxClick: function(mIdx, e) {
    e.stopPropagation();
    this.props.onCheckboxClick(mIdx, e.target.checked);
  },

  componentDidMount: function() {
  },

  renderDropdownCustomizeOPrs: function(more, mrow, mIdx) {
    let menuItems = [];

    more.items.map((item, iIdx) => {
      if (item.filter && !item.filter(mrow)) {
        return;
      }

      menuItems.push(
        <MenuItem 
          key={iIdx}
          eventKey={item.code}
          onSelect={this.onCustomizeOpr.bind(this, mIdx)}
        >
          {item.title}
        </MenuItem>
      );
    });

    if (!menuItems.length) {
      return null;
    }

    return (
      <DropdownButton 
        bsStyle='link' 
        title={more.title}
        key={'copr_more'}
        id={`dropdown-more`}
        className='mytable-menu-drop'
      >
        {menuItems}
      </DropdownButton>
    );
  },

  render: function() {
    let headThs;
    let rows = [];

    headThs = this.props.columns.map((col, i) => {
      return (<th style={{width:col.width}} key={i}></th>);
    });

    this.props.mrows.map((mrow, mIdx) => {
      let tds = this.props.columns.map((col, cIdx) => {

        // customize operation column
        if (col.customizeOpr) {
          let customizeBtns = [];

          col.customizeOpr.map((copr) => {

            if (copr.type === 'more') {
              let moreBtn = this.renderDropdownCustomizeOPrs(copr, mrow, mIdx);
              if (moreBtn) {
                customizeBtns.push(moreBtn);                
              }
              return;
            }

            if (copr.filter && !copr.filter(mrow)) {
              return;
            }
            customizeBtns.push(
              <a href="#" 
                key={'copr_' + copr.code}
                title={copr.title}
                onClick={this.onCustomizeOpr.bind(this, mIdx, copr.code)}>
                {
                  copr.className ?
                    (<i className={copr.className}>{copr.title}</i>) :
                    (copr.title)
                }
              </a>
            );
          });

          return (
            <td key={cIdx} className='mytable-operate-td'>{customizeBtns}</td>
          );
        }

        // checkbox column
        if (col.checkbox) {
          return (
            <td key={cIdx}>
              <input 
                type="checkbox" 
                checked={this.props.mrowsChecked[mIdx]}
                onClick={this.onCheckboxClick.bind(this, mIdx)}
              />
            </td>
          );
        }

        // column content
        let tdContent = col.displayChange ?
          col.displayChange(this.props.getFieldVal(mrow, col.dataField), mrow) :
          this.props.getFieldVal(mrow, col.dataField);

        tdContent = (_.isUndefined(tdContent) || _.isNull(tdContent)) ? 
                    '' : String(tdContent);

        // link action column
        col.linkAction && (tdContent = (
          <a href="#" 
            onClick={this.linkActionWrapper.bind(this, col.linkAction, mrow, mIdx)}
          >
            {tdContent}
          </a>
        ));

        if (col.htmlContent) {
          return (
            <td key={cIdx} dangerouslySetInnerHTML={{__html: tdContent}}/>
          );

        } else {
          return (
            <td key={cIdx}>
              {tdContent}
            </td>
          );
        }

      });

      rows.push(
        <tr 
          className={this.props.highlight === mIdx ? 'info' : ''} 
          key={mIdx} 
          onClick={this.onRowClick.bind(this, mIdx)}
          onDoubleClick={this.onRowDoubleClick.bind(this, mIdx)}
        >
          {tds}
        </tr>
      );
    });

    let bodyHeight = this.props.bodyHeight || '250px';

    return (
      <div ref='tableContainer' className='table-container' style={{height: bodyHeight}}>
        <div className='msgplaceholder'></div>
        <table className='table table-hover'>
          <thead>
            <tr>
              {headThs}
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    );
  }
});

//----------------------------MyTablePagination--------------------------------
let RC_MyTablePagination = React.createClass({

  computeCurrentPage: function(pagination) {
    return pagination.totalCount ? 
      (Math.floor(pagination.offset / pagination.limit) + 1) : 0;
  },

  computeTotalPage: function(pagination) {
    return Math.ceil(pagination.totalCount / pagination.limit);
  },

  getInitialState: function() {
    const {pagination} = this.props;

    return {
      currentPage: this.computeCurrentPage(pagination)
    };
  },

  componentWillReceiveProps: function(nextProps) {
    const {pagination} = nextProps;

    this.setState({
      currentPage : this.computeCurrentPage(pagination)
    });
  },

  handleChange: function(e) {
    let input = Number(e.target.value);
    if (_.isInteger(input)) {
      this.setState({currentPage: input || ''});
    }
  },

  handleKeyPress: function(e) {
    if (e.keyCode === 13 || e.which === 13) { 
      e.preventDefault();
      if (this.state.currentPage === '') {
        return;
      }

      const {goPage} = this.props;

      goPage(Number(this.state.currentPage));
    }    
  },

  render: function() {

    const {pagination, firstPage, previousPage, nextPage, lastPage} = this.props;

    if (pagination.hide)
      return null;

    return (
      <ul className="pagination mytable-pagination">
        <li><a onClick={firstPage} href="#" className='jump'>&laquo;</a></li>
        <li><a onClick={previousPage} href="#" className='jump'>&lsaquo;</a></li>
        <li>
          <a>
            <input 
              className='gopage' 
              type="text" 
              value={this.state.currentPage}
              onChange={this.handleChange}
              onKeyPress={this.handleKeyPress}
            />/{this.computeTotalPage(pagination)}页    共{pagination.totalCount}条
          </a>
        </li>
        <li><a onClick={nextPage} href="#" className='jump'>&rsaquo;</a></li>
        <li><a onClick={lastPage} href="#" className='jump'>&raquo;</a></li>
      </ul>
    );
  }
});

//-------------------------------MyTableToolbar--------------------------------
let RC_MyTableToolbar = React.createClass({

  onTool: function(code) {
    //console.log('onTool=', code);
    this.props.onToolbarClick(code);
  },

  onSelectChange: function(e) {
    e.preventDefault();
    let code = $(e.target.selectedOptions).val();
    if (code)
      this.onTool(code);
  
    e.target.options.selectedIndex = 0;
  },

  render: function() {

    const {toolbar} = this.props;

    let buttons = [];
    toolbar.buttons && toolbar.buttons.map((btn, idx) => {
      buttons.push(
        <li key={idx}>
          <button 
            type="button" 
            className={`btn btn-default ${btn.className || ''}`}
            onClick={this.onTool.bind(this, btn.code)}
          >
            {btn.name}
          </button>
        </li>
      );      
    });

    let select = null;
    if (toolbar.select){
      let options = [];
      toolbar.select.options.map((opt, idx) => {
        options.push(
          <option 
            value={opt.code}
            key={idx}
          >
            {opt.name}
          </option>
        );
      });

      select = (
        <li>
          <select className="form-control" onChange={this.onSelectChange}>
            <option value="">{toolbar.select.name}</option>
            {options}
          </select>
        </li>
      );     
    }

    return (
      <ul className="pagination mytable-toolbar">
        {buttons}
        {select}
      </ul>
    );
  },
});

//-------------------------------MyTable---------------------------------------
let RC_MyTable = React.createClass({

  _getDefaultPageSetting: function() {
    return {
      hide: !!this.props.hidePagination,
      limit: this.props.limit || 100,
      offset: 0,
      totalCount: 0
    };
  },

  getInitialState: function() {
    return {
      mrows: [],
      mrowsChecked: [],
      highlight: -1,
      pagination: this._getDefaultPageSetting(),
      url: null,
      sort: {
        field: null,
        order: 'asc',
      },
      toolbar: this.props.toolbar || ''
    };
  },

  _attachPageInfo(url, pagination, sort, fetchTotalCount) {
    let separator = url.indexOf('?') < 0 ? '?' : '&';
    let sortOrder = sort.order === 'asc' ? encodeURIComponent('+') : '-';
    let sortField = sort.field ? `&sort=${sortOrder}${sort.field}` : '';
    return `${url}${separator}limit=${pagination.limit}&offset=${pagination.offset}&fetch_total=${!!fetchTotalCount}${sortField}`;
  },

  loadModels: function(url, searchData = {}, callback) {
    this.loadModelsCallback = callback;
    const nextState = {
      url: url || this.state.url,
      searchData: searchData,
      highlight: -1,
      pagination: this._getDefaultPageSetting(),
      mrows: [],
      mrowsChecked: [],
      sort: this.state.sort,
    };

    this._doLoad(nextState, true);
  },

  _doLoad: function(nextState, fetchTotalCount) {
    const {pagination, url, sort, searchData} = nextState;

    const {modelProvider} = this.props;
    if (modelProvider) {
      pagination.totalCount = modelProvider.getTotalCount();
      nextState.mrows = modelProvider.getRows(
        pagination.offset, pagination.limit, pagination.sort);
      nextState.mrowsChecked = nextState.mrows.map(r => false);
      this.setState(nextState);
      this.loadModelsCallback && this.loadModelsCallback(nextState.mrows.length);
      return;
    }

    if (!url) {
      return;            
    }
    console.log('searchdata', searchData);
    $.get(
      encodeURI(this._attachPageInfo(url, pagination, sort, fetchTotalCount)), 
      searchData,
      (data, textStatus, jqXHR) => {
        // console.log('data=', data);
        if (data.error) {
          //console.log(`get url=${url} err=${data.error}`);
          return;
        }

        if (fetchTotalCount) {
          pagination.totalCount = Number(jqXHR.getResponseHeader('x-total-count'));
        }

        nextState.mrows = data;
        nextState.mrowsChecked = data.map(r => false);

        this.setState(nextState);

        this.loadModelsCallback && this.loadModelsCallback(nextState.mrows.length);
      });
  },

  getMrow: function(idx) {
    return this.state.mrows[idx];
  },

  getHighlight: function() {
    return this.state.highlight;
  },

  updMrow: function(mrow, idx) {
    if (idx >= 0 && idx < this.state.mrows.length) {
      const mrows = [...this.state.mrows];
      mrows[idx] = mrow;
      this.setState({mrows});
    }
  },

  onRowClick: function(idx) {
    let lastHighlight = this.state.highlight;
    this.setState({highlight: idx});

    const {onRowClick} = this.props;
    onRowClick && onRowClick(this.state.mrows[idx], idx, lastHighlight);
  },

  onRowDoubleClick: function(idx) {
    let lastHighlight = this.state.highlight;
    this.setState({highlight: idx});

    const {onRowDoubleClick} = this.props;
    onRowDoubleClick && onRowDoubleClick(this.state.mrows[idx], idx, lastHighlight);
  },

  onCustomizeOpr: function(i, $target, code) {
    this.props.onCustomizeOpr(code, this.state.mrows[i], i, $target, this);
  },

  onToolbarClick: function(code) {
    this.props.toolbar.callback(code, this.state.mrows, this.state.mrowsChecked);
  },

  confirmAdd: function(mrow, idx) {
    let mrows = [...this.state.mrows];
    let mrowsChecked = [...this.state.mrowsChecked];

    if (typeof idx === 'undefined') {
      mrows.push(mrow);
      mrowsChecked.push(false);
      this.setState({
        mrows,
        mrowsChecked,
        highlight: mrows.length - 1,
      });
      return this.state.mrows.length - 1;

    } else {
      mrows.splice(idx, 0, mrow);
      mrowsChecked.splice(idx, 0, false);
      this.setState({
        mrows,
        mrowsChecked,
        highlight: idx,
      });
      return idx;
    }
  },

  confirmEdit: function(mrow, i) {
    let mrows = [...this.state.mrows];
    mrows[i] = mrow;
    this.setState({
      mrows,
      highlight: i,
    });
  },

  confirmDel: function(i) {
    let mrows = [...this.state.mrows];
    let mrowsChecked = [...this.state.mrowsChecked];
    mrows.splice(i, 1);
    mrowsChecked.splice(i, 1);

    let highlight = this.state.highlight;
    if (highlight === i)
      highlight = -1;

    this.setState({
      mrows,
      mrowsChecked,
      highlight,
    });
  },

  onCheckboxClick: function(mIdx, checked) {
    //console.log('onCheckboxClick called:', mIdx, ' ', checked);
    let mrowsChecked = [...this.state.mrowsChecked];

    // click header checkbox
    if (mIdx === -1) {
      mrowsChecked.map((c, idx) => {mrowsChecked[idx] = checked; });      
    } else {
      mrowsChecked[mIdx] = checked;
    }

    //console.log('mrowsChecke=', mrowsChecked);

    this.setState({mrowsChecked});
  },

  onSort: function(dataField, order) {
    //console.log('dataField=', dataField);
    const {url, pagination} = this.state;
    let newState = {
      url,
      sort: {
        field: dataField,
        order,
      },
      pagination: {
        ...pagination,
        offset: 0,
      },
    };

    this._doLoad(newState, false);
  },

  getMrows:function() {
    return this.state.mrows;
  },

  changeOffset: function(offset) {
    const {pagination, url, sort} = this.state;

    if (!pagination.totalCount || 
      offset === pagination.offset || 
      offset >= pagination.totalCount ||
      offset < 0) {
      return;
    }

    const nextState = {
      url,
      sort,
      highlight: -1,    
      mrows: [],
      mrowsChecked: [],
      pagination: {
        ...pagination,
        offset,
      },
    };

    this._doLoad(nextState, false);
  },

  goPage: function(page) {
    const {pagination} = this.state;
    let offset = (page - 1) * pagination.limit;
    this.changeOffset(offset);
  },

  nextPage: function(e) {
    e.preventDefault();
    const {pagination} = this.state;
    let offset = pagination.offset + pagination.limit;
    this.changeOffset(offset);
  },

  previousPage: function(e) {
    e.preventDefault();
    const {pagination} = this.state;
    let offset = pagination.offset - pagination.limit;
    this.changeOffset(offset);
  },

  firstPage: function(e) {
    e.preventDefault();
    this.changeOffset(0);
  },

  lastPage: function(e) {
    e.preventDefault();
    const {pagination} = this.state;
    let offset = 
      (Math.ceil(pagination.totalCount / pagination.limit) - 1) 
      * pagination.limit;
    this.changeOffset(offset);
  },

  componentDidMount: function() {
    this.loadModels(null, null);
  },

  getFieldVal: function(mrow, field) {

    var fs = field.split('.');
    var v = mrow;

    for (let i = 0; i < fs.length; i++) {
      v = v[fs[i]]; 
      if (_.isNull(v) || _.isUndefined(v)) {
        break;
      }
    }

    return v;
  },

  /** 底部 */ 
  toolbarElement: function() {
    const toolbar = this.state.toolbar;
    let toolbarElement = null;
    if (toolbar) {
      toolbarElement = (
        <RC_MyTableToolbar 
          toolbar={toolbar} 
          onToolbarClick={this.onToolbarClick}
        />);
    }
    return toolbarElement;
  },

  changeToolbar: function(toolbar) {
    this.state.toolbar = toolbar;
    this.setState({toolbar: toolbar});
  },


  render: function() {

    const {children, toolbar, bodyHeight} = this.props;
    let columns;

    if (children.length) {
      columns = children.map(col => col.props);
    } else {
      columns = [];
      columns.push(children.props);
    }

    // let toolbarElement = null;
    // if (toolbar) {
    //   toolbarElement = (
    //     <RC_MyTableToolbar 
    //       toolbar={toolbar} 
    //       onToolbarClick={this.onToolbarClick}
    //     />);
    // }

    return (
      <div className='mytable-container' ref="mytableContainer" >
        <RC_MyTableHeader 
          onCheckboxClick={this.onCheckboxClick}
          onSort={this.onSort} 
          sortInfo={this.state.sort} 
        >
          {children}
        </RC_MyTableHeader>

        <RC_MyTableBody 
          mrows={this.state.mrows} 
          mrowsChecked={this.state.mrowsChecked} 
          highlight={this.state.highlight} 
          columns={columns}
          onRowClick={this.onRowClick} 
          onRowDoubleClick={this.onRowDoubleClick} 
          onCheckboxClick={this.onCheckboxClick} 
          onCustomizeOpr={this.onCustomizeOpr} 
          getFieldVal={this.getFieldVal} 
          bodyHeight={bodyHeight}
        />

        <RC_MyTablePagination 
          nextPage={this.nextPage} 
          previousPage={this.previousPage} 
          goPage={this.goPage}
          firstPage={this.firstPage}
          lastPage={this.lastPage}
          pagination={this.state.pagination}
        />

        {this.toolbarElement()}
      </div>
    );
  }
}); 

export default RC_MyTable;

