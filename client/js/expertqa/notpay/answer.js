import _ from 'lodash';
import {Popover, message, Button } from 'antd';
import React, { Component } from 'react';
import ReactDom from 'react-dom';
import bootbox from 'bootbox';
import config from '../../../../server/config.js';

class Answer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      answererAvatar: "",
      answererName: "",
      likeCount: "",
      money: "",
      liker: [],
      peekCount: "",
      content: "",
      state: "",
      data: {},
      flag: false,
    };
  };
  
  componentDidMount() {
    let {url, id, userId} = this.props;
    if (!url) {
      return;
    }
    if (userId) {
      $.ajax({
        url: url,
        type: 'get',
        async: false,
        data: {
          id: id,
          userId: userId
        },
        success: (data) => {
          // 查询偷看个数
          if (data) {
            let answersId = data._id;
            $.post('/findpeekCount', { answersId }, (r) => {
            });
            this.state.data = data;
            if (data.isPeek == true || data.answererId == guser._id || askerId == guser._id) {
              $('#money').css('display', 'none');
              data.content = data.content;
              this.setState({flag:true});
            } else {
              $('#money').css('display', 'show');
              data.content += '...';
            }
            this.setState({
              answererAvatar: data.answererAvatar,
              answererName: data.answererName,
              money: data.money,
              likeCount: data.likeCount,
              peekCount: data.peekCount,
              content: data.content,
            });
          } else {
            console.log('no data');
          }
        },
        error: (err) => {
          console.log('err', err);
        }
      });
    } else {
     $.ajax({
        url: '/answerNoGuser',
        type: 'post',
        async: false,
        data: {
          id: id,
        },
        success: (data) => {
          if (data) {
            let answersId = data._id;
            $.post('/findpeekCount', { answersId }, (r) => {
            });
            this.state.data = data;
            $('#money').css('display', 'show');
            data.content =  data.content.substring(0, 30) + "...";
            this.setState({
              answererAvatar: data.answererAvatar,
              answererName: data.answererName,
              money: data.money,
              likeCount: data.likeCount,
              peekCount: data.peekCount,
              content: data.content,
            });
          } else {
            console.log('no data');
          }
        },
        error: (err) => {
          console.log('err', err);
        }
      });
    }
  }

  peekClick() {
    this.props.peekClick();
  }

  handlePeekCount() {
    if (this.state.flag == true) {
      if (guser) {
        // 查询是否点赞
        $.ajax({
          url: "/findIsLike",
          type: 'post',
          async: false,
          data: {
            userId: guser._id,
            answerId: que._id,
          },
          success: (data) => {
            if (!data) {
              this.setState({ likeCount: this.state.likeCount + 1 });
              message.success("点赞成功！");
              // 添加点赞者信息
              $.get('/addLiker', { userId: guser._id, answerId: que._id });
              let {likeCount} = this.state;
              let {id} = this.props;
              $.get('/calLikeCount', { id, likeCount });
            } else {
              message.warn('你已经点过赞了');
              return false;
            }
          },
          error: (err) => {
            console.log('err', err);
          }
        });
      } else {
        bootbox.alert({
          message: "请先登录!",
          size: 'small'
        });
        window.location.href = '/signin';
      }
    } else { 
      return false;
    }
  }

  render() {
    console.log('tahissadasd', this.state.data);
    return (
      <div>
        <div id="answer">
          <div id="tips"><p>已回答</p></div>
          <div id="detail">
          <div className="aleft" style={{ 'border': '0' }}>
              <a href={`/expert/${this.state.data.answererId}`}><img src={`${config.avatorUrl}/vmooc/findPicOther/${this.state.data.answererId}`} className="img-circle" /></a>
            <p>{this.state.answererName}</p>
            </div>
            <div className="aright">
              <div id="artop">
                <span id="countspan"></span>
                <span>偷看{this.state.peekCount}</span>
                <span onClick={this.handlePeekCount.bind(this)} id="likecount" style={{ cursor: "pointer" }}>点赞{this.state.likeCount}</span>
              </div>
              <div id="ahr"></div>
              <div id="amain" style={{wordBreak:"break-all"}}>{this.state.content}</div>
            </div>
          </div>
        </div>
        <div id="money">
          <div className="mbtn">
                    <a href="javascript:;" onClick={this.props.peekClick} className="button button-glow button-rounded button-caution"><span id="price">{this.state.money}</span>元偷看</a>
          </div>
        </div>
        <div style={{ 'clear': 'both' }}></div>
      </div>
    );
  };
}

export default Answer;
