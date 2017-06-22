import _ from 'lodash';
import React, {Component} from 'react';
import ReactDom from 'react-dom';

class PersonList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: this.props.data,
		}
	}

	onDel(e) {
		if (this.props.onDel) {
			this.props.onDel(e.target.id);
		}
	}

	genTr() {
		let _tr = [];
		if (this.state.data.length == 0) {
			_tr.push(
					<tr>
				    <td>暂无</td>
				    <td>暂无</td>
				    <td></td>
				  </tr>
				);
		} else {
			this.state.data.map((person, idx) => {
				_tr.push(
					<tr id={idx}>
				    <td>{person.name}</td>
				    <td>{person.email}</td>
				    <td>
				    	<a>
				    		<span id={idx} className="glyphicon glyphicon-remove" onClick={this.onDel.bind(this)}></span>
				    	</a>
				    </td>
				  </tr>
				);
			});
		}
		return _tr;
		
	}

	render() {
		console.log('render', this.state.data);
		return (
			<table className="table table-hover">
			  <thead>
			  </thead>
			  <tbody>
			    {this.genTr()}
			  </tbody>
			</table>
		);
	}
}

export default PersonList;