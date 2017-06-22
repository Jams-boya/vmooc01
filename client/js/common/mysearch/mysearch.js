import React, {Component} from 'react';

class RC_MySearch extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className = 'console-table-wapper margin-top myDetailSearchBar clearfix'>
        <div className="form-inline">
          <button className = 'btn btn-primary'>搜索</button>
        </div>
      </div>
    );
  }
}

export default RC_MySearch;