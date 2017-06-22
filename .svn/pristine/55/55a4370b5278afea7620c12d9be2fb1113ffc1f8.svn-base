import _ from 'lodash';
import React, {Component} from 'react';

class RC_TeacherSearch extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: ""
        };
        this.onSearch = this.onSearch.bind(this);
        this.onInputKeyPress = this.onInputKeyPress.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    onSearch() {
        this.props.onSearch(this.state.value);
    }

    onInputKeyPress(e) {
        if (e.keyCode === 13 || e.which === 13) {
            this.onSearch();
        }
    }
    handleChange(event) {
        let value = _.trim(event.target.value);
        this.setState({ value: value });
    }

    render() {
        return (
            <div className='item form-group col-md-12 col-sm-12'>
                <div className='col-md-9 col-sm-9 col-xs-12'>
                    <input onKeyPress={this.onInputKeyPress}
                        value={this.state.value}
                        onChange={this.handleChange}
                        type='text' className="form-control col-md-12 col-xs-12"
                        placeholder='可输入邮箱、联系方式进行查询'/>
                </div>
                <div className='col-md-3 padding'>
                    <button onClick={this.onSearch} type='button'
                        className='btn btn-primary btn-block '>搜索</button>
                </div>
            </div>
        );
    }
}

export default RC_TeacherSearch;