import 'antd/lib/modal/style';
import 'antd/dist/antd.css';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Modal, Input, Button, message } from 'antd';
class NewCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id:"",
      code: "",
      count: "",
      visible: false,
      number: "",
    }
    $.ajax({
			url: '/findNumber',
      type: 'get',
      success: (data) => {
        this.setState({ number: data.count });
			},
			error: (err) => {
				console.log(err);
			}
		});
  }
  showModal = (id) => {
    this.setState({id, visible: true});
  }
  // 创建随机数
  randomWord = (num) => {
    let str = "",
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9','A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    for(let i=0; i< num; i++){
        let pos = Math.round(Math.random() * (arr.length-1));
        str += arr[pos];
    }
    return str;
  }

  onCreate = (e) => {
    if (!this.state.count) { 
      message.warning('请输入优惠码生成次数!');
      return;
    }
 	  $.ajax({
			url: '/saveCodeByCourseId',
      type: 'get',
      data: {
        courseId: this.state.id,
        code: this.randomWord(12),
        count: this.state.count,
      },
      success: (data) => {
        if (data.tip === 0) {
          message.warning(data.result);
          return;
        } else { 
          message.success(data.result, 3);
          this.setState({visible: false});
        }
        this.setState({ count: '' });
			},
			error: (err) => {
				console.log(err);
			}
		});
  }
  handleCancel = (e) => {
    this.setState({visible: false});
  }
  handleCount = (e) => {
    this.setState({ count: e.target.value });
  }
  render() {
    return (
      <div>
        <Modal
          title="优惠码"
          visible={this.state.visible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <div>
            <h5 style={{textAlign:"center"}}>每个优惠码最多可使用{this.state.number}次，收到优惠码的用户可在购买视频使用</h5>
            <h5 style={{textAlign:"center"}}>填写优惠码次数
            <Input style={{ width: 80, marginRight: 10 }} value={this.state.count} onChange={this.handleCount}/><Button type="primary" onClick={this.onCreate.bind(this)}>生成优惠码</Button></h5>
          </div>
        </Modal>
      </div>
    );
  }
}

ReactDOM.render(
	<NewCode />,
	document.querySelector('#newCode')
);

export default NewCode;