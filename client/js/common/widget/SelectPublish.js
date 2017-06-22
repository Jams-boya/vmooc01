import _ from 'lodash';
import React, {Component} from 'react';
import ReactDom from 'react-dom';
/**
 * 上传课程选择
 * @author: gs
 */
class SelectPublish extends Component {
  constructor(props) {
    super(props);
    this.state={
    }
  }
  particular() { 
    window.location.href = "/microCourse";
  }

  series() { 
    window.location.href = "/coursePublish";
  }
  render() {
    return (
      <div className="modal fade" id="myModal" tabIndex="9" role="dialog" aria-labelledby="myModalLabel" aria-hidden="false">
      <div className="modal-dialog">
          <div className="mbody modal-content" style={{height:"400px"}}>
          <div className="modal-header">
            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h4 className="modal-title" style={{ fontSize: '18px'}} id="myModalLabel">新建课程</h4>
          </div>
          <div className="modal-body">
              <div id="selectBody" style={{margin:"auto",width:"500px",marginTop:"20px"}}>
                <div style={{ width: "220px", height: "230px",border:"solid",borderColor:"#C0C0C0",float:"left"}}>
                  <img src="../../../img/series.png" style={{ width: "100px", height: "100px",marginLeft:"60px",marginTop:"5px"}} />
                  <div style={{marginTop:"10px",marginLeft:"10px",marginRight:"6px",marginBottom:"5px",fontSize:"14px"}}>适用于复杂的课程内容，将利用章节结构，将课程内容进行归纳整理后进行发布</div>
                  <button style={{marginLeft:"50px"}} type="button" className="btn btn-success" onClick={this.series.bind(this)}>创建系列课程</button>
                </div>
                <div style={{ width: "220px", height: "230px",border:"solid",borderColor:"#C0C0C0",float:"right"}}>
                  <img src="../../../img/particular.png" style={{ width: "100px", height: "100px",marginLeft:"60px",marginTop:"5px"}} />    
                  <div style={{marginTop:"10px",marginLeft:"10px",marginRight:"6px",marginBottom:"25px",fontSize:"14px"}}>适用于学时短、可快速完成的单个课程</div>  
                  <button style={{marginLeft:"60px"}} type="button" className="btn btn-success" onClick={this.particular.bind(this)}>创建微课程</button>
                </div>
              </div>
        </div>
      </div>
    </div>
    </div>    
    );
  }
}

export default SelectPublish;

