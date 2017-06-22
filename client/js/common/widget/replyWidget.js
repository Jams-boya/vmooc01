import _ from 'lodash';
import {Popover, message, Button } from 'antd';
import React, {Component} from 'react';
import ReactDom from 'react-dom';
/**
 * 专家回答react组件
 * @author: wac
 */
class ReplyWidget extends Component {
  constructor(props) {
    super(props);
    let {answerData} = this.props;
    this.state = { answerData: answerData };
  }
  render() {
    let reply = [];
    let peeker;
    let peekId = '';
    let likeId = '';
    this.state.answerData.map((answers, index) => {
      if (answers.peekCount > 0 && answers.peekCount <= 5) {
        peeker = <div key="index">
          {
            answers.peeker.map((val, idx) => {
              return <a key="idx">{val.name.substring(0, 3)}&nbsp;</a>;
            })
          }
          偷看过
        </div>
      }
      else if (answers.peekCount > 5) {
        peeker = <div>
          {
            answers.peeker.map((val, idx) => {
              return <a>{val.name.substring(0, 3)}&nbsp;</a>;
            })
          }
          等
          <span className="peekCount">{answers.peekCount}</span>
          人偷看过
        </div>
      }
      else {
        peeker = '暂时没人偷看过';
      }
      answers.peekCount > 0 ? peekId = 'see' : peekId = '';
      answers.likeCount > 0 ? likeId = 'agree' : likeId = '';
      let reKey = 're' + index;
      let answersTitle = answers.title;
      if (answersTitle.length > 25) {
        answersTitle = answersTitle.substring(0, 25) + "...";;
      } else { 
        answersTitle = answers.title;
      }
      let url = "";
      if (answers.questionId) {
        url = '/expertqa/' + answers.questionId + '/' + answers.askerId;
      } else {
        url = '/expertqa/' + answers._id + '/' + answers.askerId;
      }
      reply.push(
        <div key={reKey} className="quelist">
          <span className="spansm">
            <span id={peekId}>{answers.peekCount}</span>
            <br />
            偷看过
          </span>
          <span className="spansm">
            <span id={likeId} style={{ outline:"none"}}>{answers.likeCount}</span><br />
            点赞
          </span>
          <span>
            <a className="question" href={url} target="_blank" style={{color:"#333"}}>
              {answersTitle}
            </a>
            <br />
            <span className="quename spansm" style={{color:"#999", fontSize:11}}>
              {peeker}
            </span>
          </span>
          <div className="clear"></div>
        </div>
      );
    });
    return (
      <div>{reply}</div>
    );
  }
}

ReplyWidget.propTypes = {

};

ReplyWidget.defaultProps = {

};

export default ReplyWidget;