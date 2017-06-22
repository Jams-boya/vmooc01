import _ from 'lodash';
import React, {Component} from 'react';
import ReactDom from 'react-dom';
import RC_MySelect from 'js/common/myform/myselect';
import RC_MyForm from 'js/common/myform/myform';
import './MyDetailSearchBar.css';

class MyDetailSearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchMode: 'lite', // 'lite' || 'detail'
    };

    this.onSearch = this.onSearch.bind(this);
    this.toggleSearchMode = this.toggleSearchMode.bind(this);

    this.buttons = [];
    this.detailFormElement = null;

    let buttonStartIdx = 0;
    if (!this.props.hideDetail) {
      let myformChild = React.Children.count(this.props.children) > 1 ?
        this.props.children[0] : this.props.children;
        
      this.detailFormElement = React.cloneElement(
        myformChild,
        {ref: r => this.detailForm = r}
      );

      buttonStartIdx = 1;
    }

    React.Children.forEach(this.props.children, (child, idx) => {
      if (idx < buttonStartIdx)
        return;

      this.buttons.push(React.cloneElement(
        child,
        {key: `button_${idx}`},
      ));
    });
  }
  
  componentDidMount() {
    this.refs.keyword.focus(); 

    if (this.props.defaultSearch) {
      this.onSearch();
    };
  }

  onKeyDown(e) {
    console.log('key down', e);
    var key = e.which;

    if (key == 13) {
      this.onSearch();
    }
  }

  hasPrefix() {
    if (this.props.hasSelect) {

    }
  }

  onSearch() {
    if (this.state.searchMode === 'lite') {
      let  keyword = _.trim(this.refs.keyword.value);
      this.props.onSearch({
        keyword
      });
      return;
    }

    this.props.onSearch(this.detailForm.val());
  }

  toggleSearchMode() {
    this.setState({
      searchMode: this.state.searchMode === 'lite' ? 'detail' : 'lite',
    });
  }

  render() {

    let displayLite = this.state.searchMode === 'lite' ? '' : 'none';
    let displayDetail = this.state.searchMode === 'lite' ? 'none' : '';

    return (
      <div className="console-table-wapper margin-top myDetailSearchBar clearfix"> 
        
        <div className="form-inline" style={{display: displayLite}}>
          <div className="form-group">
            <input id='keyword' className="form-control col-md-12 col-xs-12" 
              ref='keyword'
              placeholder={this.props.placeholder}
              onKeyDown={this.onKeyDown.bind(this)}
            />
          </div> 

          <button className="btn btn-primary" onClick={this.onSearch}>
            搜索
          </button>

          {
            !this.props.hideDetail &&
            (
            <button className="btn btn-default" onClick={this.toggleSearchMode}>
              详细搜索
            </button>
            )
          }

          {this.buttons}
        </div>

        <div style={{marginTop: '8px', display: displayDetail}}>
          {this.detailFormElement}
          <div className='col-md-12'>
            <div style={{float:'right'}}> 
              <button className="btn btn-primary" onClick={this.onSearch}>
                搜索
              </button>
              <button className="btn btn-default" onClick={this.toggleSearchMode}>
                简易搜索
              </button>
            </div>
          </div>
        </div>

      </div>
    ); 
  }
}

MyDetailSearchBar.propTypes = { 
  hideDetail: React.PropTypes.bool, 
  placeholder: React.PropTypes.string, 
  onSearch: React.PropTypes.func, 
};

MyDetailSearchBar.defaultProps = { 
  hideDetail: false,
  placeholder: '输入关键字搜索',
  onSearch: () => {},
};

export default MyDetailSearchBar;

