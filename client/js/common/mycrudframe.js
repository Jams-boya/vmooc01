import _ from 'lodash';
import React, {Component} from 'react';
import ReactDom from 'react-dom';
import MySearchBar from 'js/common/MySearchBar';

class MyCrudFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'list-view',
    };

    this.onSearch = this.onSearch.bind(this);
    this.onCreate = this.onCreate.bind(this);
    this.onReturn = this.onReturn.bind(this);

    this.tableElement = React.cloneElement(
      this.props.children[0],
      {
        ref: c => this.myTable = c,
        onCustomizeOpr: (code, row, idx, target, rcTable) => {
          if (code === 'view') {
            this.myEditor.enterView(row);
            this.setState({
              view: 'edit-view',
            });
            return;
          }

          if (code === 'edit') {
            this.myEditor.enterEdit(
              row,
              idx,
              (mrow, idx) => {this.myTable.confirmEdit(mrow, idx);} 
            );
            this.setState({
              view: 'edit-view',
            });
            return;
          }

          this.props.children[0].props.onCustomizeOpr(code, row, idx, target, rcTable);
        }
      }
    );

    this.editorElement = React.cloneElement(
      this.props.children[1],
      {ref: c => this.myEditor = c}
    );
  }  

  onSearch(val) {
    let keyword = _.trim(val);    
    let url = this.props.listUrl;

    if (keyword)
      url += `?keyword=${keyword}`;

    this.myTable.loadModels(url); 
  }

  onCreate() {
    this.myEditor.enterCreate(
      (mrow) => { return this.myTable.confirmAdd(mrow); }, 
      (mrow, idx) => { this.myTable.confirmEdit(mrow, idx); } 
    );
    this.setState({
      view: 'edit-view',
    });
  }

  onReturn() {
    this.setState({
      view: 'list-view',
    });
  }

  render() {
    let showList = this.state.view === 'list-view' ? '' : 'none';
    let showEdit = this.state.view === 'list-view' ? 'none' : '';
    return (
      <div>
        <div style={{display: showList}}>
          <div className="gridSection clearfix">
            <MySearchBar 
              onSearch={this.onSearch}
              onAdd={this.onCreate}
            />
          </div>

          <div className="gridSection clearfix">
            {this.tableElement}
          </div>
        </div>

        <div style={{display: showEdit}}>
          <div className="form-group">
            <button 
              type='button' 
              className="btn btn-primary"
              onClick={this.onReturn}
            >返回
            </button>
          </div>

          <div className="gridSection clearfix">
            {this.editorElement}
          </div>
        </div>
      </div>
    );
  }
}

MyCrudFrame.propTypes = { 
  listUrl: React.PropTypes.string, 
};

export default MyCrudFrame;
