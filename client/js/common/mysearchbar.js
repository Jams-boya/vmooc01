import _ from 'lodash';
import React, {Component} from 'react';
import ReactDom from 'react-dom';

class MySearchBar extends Component {
  constructor(props) {
    super(props);

    this.onSearch = this.onSearch.bind(this);
    this.onInputKeyPress = this.onInputKeyPress.bind(this);
  }  

  onSearch() {
    this.props.onSearch(this.refs.input.value);
  }

  onInputKeyPress(e) {
    if (e.keyCode === 13 || e.which === 13) {
      e.preventDefault();
      this.onSearch();
    }
  }

  render() {
    return (
      <form className="form-inline">
        <div className="form-group">
          <input 
            type='text' 
            ref='input'
            className="form-control" 
            onKeyPress={this.onInputKeyPress} 
            placeholder={this.props.placeholder}
          />
          <button 
            type='button' 
            className="btn btn-default"
            onClick={this.onSearch}
          ><i className="fa fa-search"></i>
          </button>
        </div> 

        {
          this.props.onAdd && (
            <button 
              type='button' 
              className="btn btn-success"
              onClick={this.props.onAdd}
            >新增
            </button>
          )
        }

      </form>
    );
  }
}

MySearchBar.propTypes = { 
  placeholder: React.PropTypes.string, 
  onSearch: React.PropTypes.func,
  onAdd: React.PropTypes.func,
};
MySearchBar.defaultProps = { 
  placeholder: '输入搜索关键字'
};

export default MySearchBar;
