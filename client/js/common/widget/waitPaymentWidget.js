import '../../../css/waitpay.css';
import '../../../css/selectpay.css';
import '../../../css/purchase.css';
import {Popover, message, Button, Icon, Input } from 'antd';
import _ from 'lodash';
import React, {Component} from 'react';
import ReactDom from 'react-dom';
import bootbox from 'bootbox';
/**
 * 等待支付的模态框的react组件
 * @author: ba
 */
class WaitPaymentWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      amount: 1,
      totalPrice: this.props.data.price,
      modalContent: '',
      modalTitle: '确认支付信息',
      payMethod: 0,
      orderType: this.props.orderType,
      modalHeight: {},
      qaTeacher  : null,
      qaTitle    : '',
      qaContent  : '',
      contentLength: 0,
      userAccount: null,
      order: this.props.order,
      promoCode: '',
      tooltip: '',
      actualMoney: '',
    }
    /** 监测 */
    socket.on('paidSuccess', (result) => {
      this.listenPayResult(result);
    });
    
  }

  listenPayResult(result) {
    $("#myModal").modal('hide');
    // bootbox.alert({message: '支付成功！', size: 'small'});
    if (this.state.orderType == 'course') {
      message.success('支付成功！正在为您跳转...');
      window.setTimeout(window.location.href = '/myCourses', 3000);
    } else if (this.state.orderType == 'qa') {
      this.qaRedirect();
    } else if (this.state.orderType == 'peek') {
      message.success('支付成功！正在为您跳转...');
      window.setTimeout(location.reload(true), 2000);
    } else if (this.state.orderType == 'collection') {
      message.success('支付成功！正在为您跳转...');
      window.setTimeout(window.location.href='/myOrders', 2000);
    }
  }

  componentWillMount() {
    let userAccount;
    $.ajax({
      url: '/getmyaccount',
      type: 'get',
      async:false,
      success: function(data) {
        userAccount = data;
      },
      error: function(err) {
        console.log("err", err);
      }
    });

    this.state.userAccount = userAccount;
    if (this.props.payInfo) {
      this.payOrderExists(this.props.payInfo);
    } else if (this.state.orderType == 'course') {
      this.genConfirmPayment(userAccount);
    } else if (this.state.orderType == 'qa') {
      this.genQuiz();
    } else if (this.state.orderType == 'collection')  {
      this.genConfirmPayment();
    } else if (this.state.orderType == 'peek')  {
      this.selectPayment();
    }
  }

  componentWillReceiveProps(nextProps) {
    this.state.payMethod = 0;
    this.state.qaTitle = '';
    this.state.qaContent  = '';
    if (nextProps.payInfo) {
      this.payOrderExists(this.props.payInfo);
    } else {
      if (nextProps.orderType == 'course')
        this.genConfirmPayment();
      else if (nextProps.orderType == 'qa') {
        this.state.qaTeacher = nextProps.qaTeacher;
        this.state.data = nextProps.data;
        this.genQuiz();
      } else if (this.state.orderType == 'collection')  {
        this.genConfirmPayment();
      } else if (this.state.orderType == 'peek')  {
        this.selectPayment();
      }
    }
  }

  handleCountChange(e) {
    let num = e.target.value;
     let codeStyle = {};
    if(this.state.orderType == "course") { 
      codeStyle = {
        display: "inline-block"
      }
    } else {
    codeStyle = {
          display: "none"
        }
    }  
    if (num > 10000) { 
      bootbox.alert({
        message: "超过了购买上限!",
        size: 'small'
      });
      return false;
    }
    num = num.replace(/[^\d]/g, '');
    let total = num * Number(this.state.data.price);
    let modalContent = (
      <div>
        <div className="modal-body">
          <div className="rows">
            <span className="condition">使用人数：</span>
            <span className="result"><input type="text" defaultValue={num} value={num} onChange={this.handleCountChange.bind(this)} className="count" />&nbsp;人</span>
          </div>
          <div className="rows">
            <span className="condition">课程期限：</span>
            <span className="result">{this.state.data.usePeriod ? this.state.data.usePeriod + ' 个月' : "12个月"}</span>
          </div>
          <div className="rows">
            <span className="condition">金&nbsp;&nbsp;额：</span>
            <span className="result">￥{Number(total).toFixed(2)}</span>
            <Button id="code" type="primary" style={codeStyle} ghost onClick={this.clickPromoCode.bind(this)}>优惠码</Button>
          </div>
          <div className="rows" id="promocode" style={{display: "none"}}>
            <span className="condition">优惠码：</span>
            <Input className="result" size="small" placeholder="输入优惠码" defaultValue={this.state.promoCode} onChange={this.handlePromoCode.bind(this)} />
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="submitbtn btn btn-success" onClick={this.selectPayment.bind(this)}>下一步</button>
        </div>
      </div>
    );
    this.setState({
      totalPrice: total,
      amount: Number(num),
      modalContent: modalContent
    });
  }

  paySuccess(id, e) {
    let url = '/getOrderById?orderId=' + id;
    $.get(url, (order) => {
      if (order.state != 1) {
        //message.success('尚未完成支付，请稍等后再确认');
         bootbox.alert("尚未完成支付，请稍等后再确认");
      } else {
        //message.success('支付成功！');
        if (this.state.orderType == 'course' || this.state.orderType == 'collection') {
          bootbox.alert("支付成功,正在为您跳转...");
          window.setTimeout(window.location.href='/myCourses', 4000);
        } else if (this.state.orderType == 'qa') {
          $("#myModal").modal('hide');
          this.qaRedirect();
        } else if (this.state.orderType == 'peek') {
          bootbox.alert('支付成功！正在为您跳转...');
          window.setTimeout(location.reload(true), 2000);
        }
      }
    });
  }

  payFailure(e) {
    $("#myModal").modal('hide');
  }

  payOrderExists(payInfo) {
    this.selectPayment();
  }

  handlePayment(e) {
    //AJAX返回支付成功信息后生成二维码
    const {data, amount, totalPrice, payMethod, orderType, promoCode, actualMoney} = this.state;
    $(".topay").attr('disabled', 'true');
    $(".modal-body").append("<span class='loader4'></span>");
    if (!this.props.payInfo) {
      
      $.post('/createcourseorder', {data, amount, totalPrice, payMethod, orderType, promoCode, actualMoney}, (result) => {
        //支付宝扫描二维码支付
        $(".loader4").remove();
        if (result.chargeQrUrl) {
          let modalHeight = {height: '380px'}
          let modalTitle = "正在支付中";
          let url = '/buildqr?qrUrl=' + result.chargeQrUrl;
          let modalContent =(
            <div>
                <div className="modal-body">
                  <div id="wait"><h4>请扫描二维码完成支付</h4></div>
                  <div id="prohibit"><h6>支付前不要关闭此窗口</h6></div>
                  <div id="qrPic" style={{paddingLeft:'100px'}}>
                    <img style={{height:'160px', width:'160px'}} src={url}/>
                  </div>
                </div>
                <div className="mfooter modal-footer">
                  <button type="button" className="success btn btn-success" onClick={this.paySuccess.bind(this, result.orderId)}>支付成功</button>
                  <button type="button" onClick={this.payFailure.bind(this)} className="fail btn btn-success">支付失败</button>
                </div>
            </div>
          );
          this.setState({modalContent: modalContent, modalHeight: modalHeight, modalTitle: modalTitle});
        //余额支付
        } else if (result.success) {
          $("#myModal").modal('hide');
          // bootbox.alert({message: '支付成功！', size: 'small'});
          if (this.state.orderType == 'course') {
            bootbox.alert('支付成功！正在为您跳转...');
            window.setTimeout(window.location.href = '/myCourses', 3000);
          } else if (this.state.orderType == 'qa') {
            this.qaRedirect();
          } else if (this.state.orderType == 'peek') {
            bootbox.alert('支付成功！正在为您跳转...');
            window.setTimeout(location.reload(true), 3500);
          } else if (this.state.orderType == 'collection') {
            bootbox.alert('支付成功！正在为您跳转...');
            window.setTimeout(window.location.href='/myOrders', 3500);
          }
        } else if (result.error) {
          bootbox.alert({message: result.error});
          $(".topay").removeAttr('disabled');
        }
      });
    } else {
      if (this.state.payMethod == 1) {
          let modalHeight = {height: '380px'}
          let modalTitle = "正在支付中";
          let url = '/buildqr?qrUrl=' + this.props.payInfo.QrUrl;

          let modalContent =(
            <div>
                <div className="modal-body">
                  <div id="wait"><h4>请扫描二维码完成支付</h4></div>
                  <div id="prohibit"><h6>支付前不要关闭此窗口</h6></div>
                  <div id="qrPic" style={{paddingLeft:'100px'}}>
                    <img style={{height:'160px', width:'160px'}} src={url}/>
                  </div>
                </div>
                <div className="mfooter modal-footer">
                  <button type="button" className="success btn btn-success" onClick={this.paySuccess.bind(this, this.props.payInfo.orderId)}>支付成功</button>
                  <button type="button" onClick={this.payFailure.bind(this)} className="fail btn btn-success">支付失败</button>
                </div>
            </div>
          );
          this.setState({modalContent: modalContent, modalHeight: modalHeight, modalTitle: modalTitle});
      } else if (this.state.payMethod == 0) {
        $.post('/unPaidOrderPay', {order: this.props.payInfo, payMethod: this.state.payMethod, promoCode: this.state.promoCode, amount: this.state.amount, actualMoney: this.state.actualMoney}, (result) => {
          if (result.success) {
            $("#myModal").modal('hide');
            bootbox.alert('支付成功！正在为您跳转...');
            if (this.props.payInfo.type == 'course') {
              window.setTimeout(window.location.href = '/myCourses', 4000);
            }
            if (this.state.orderType == 'course') {
              window.setTimeout(window.location.href = '/myCourses', 4000);
            } else if (this.state.orderType == 'qa') {
              window.setTimeout(location.reload(true), 3000);
            } else if (this.state.orderType == 'peek') {
              window.setTimeout(location.reload(true), 3000);
            } else if (this.state.orderType == 'collection') {
              window.setTimeout(window.location.href='/myOrders', 3000);
            }
          } else if (result.error) {
            bootbox.alert({message: result.error});
          }
        });
      }
    }
  }

  qaRedirect() {
    bootbox.confirm({
      message: "您的提问已支付成功，是否立即进入用户中心查看我的提问?",
      buttons: {
        confirm: {
          label: '是',
          className: 'btn-success'
        },
        cancel: {
          label: '否',
          className: 'btn-danger'
        }
      },
      callback: function (result) {
        if (result) {
          window.open('/myQAEntry');
        }
      }
    });
  }

  methodClick(e) {
    if (e.target.id == "zfye") {
      this.state.payMethod = 0;
      $("#zfye").css('background-color', '#DDDDDD');
      $("#zfb").css('background-color', 'white');
      $(".topay").removeAttr('disabled');
    } else if (e.target.id == "zfb") {
      this.state.payMethod = 1;
      $("#zfb").css('background-color', '#DDDDDD');
      $("#zfye").css('background-color', 'white');
      $(".topay").removeAttr('disabled');
    }
    this.setState();
  }

  //选择支付方式
  selectPayment() {
    if (!!this.state.promoCode) {
      $.ajax({
        url: '/checkPromoCode',
        type: 'get',
        data: {
          courseId: this.state.data._id,
          promoCode: this.state.promoCode,
          useCount: this.state.amount,
        },
        async: false,
        success: (data) => {
          if (data.result === 1) {
            this.state.actualMoney = this.state.totalPrice;
            this.state.totalPrice = 0;
            this.setState({});
          } else {
            this.setState({ tooltip: data.tooltip });
            let dialog = bootbox.dialog({
              message: `<p class="text-center">${data.tooltip}</p>`,
              closeButton: false
            });
            setTimeout(() => {
              dialog.modal('hide');
            }, 2000);
          }
        },
        error: (err) => {
          console.log("err", err);
        }
      });
    }
    if (!this.state.promoCode || this.state.totalPrice === 0) {
      let prevBtn;
      if (this.state.orderType == "qa" && (this.state.qaTitle.length == 0 || this.state.qaContent.length == 0)) {
        // bootbox.alert({message: '问题标题/描述不能为空！', size: 'small'});
        message.warn('问题标题/描述不能为空!');
        return;
      }
      if (this.state.amount == 0 || this.state.amount == "") {
        message.warn('购买人数不能为0!');
        return;
      }
      let prev = (this.state.orderType == "course" || this.state.orderType == 'collection') ? this.genConfirmPayment.bind(this) : this.genQuiz.bind(this);
      if (this.state.orderType != 'peek' && !this.props.payInfo) {
        prevBtn = (<button type="button" className="back btn btn-default" onClick={prev}>上一步</button>);
      }
      if (this.state.orderType == "qa") {
        let qaData = {
          askerId: guser._id,
          askerName: guser.name,
          askerAvatar: guser.Avatar,
          requiredAnswerId: this.state.qaTeacher.userId,
          requiredAnswerName: this.state.qaTeacher.name,
          requiredAnswerAvatar: this.state.qaTeacher.avatar,
          courseId: this.state.data._id,
          courseName: this.state.data.name,
          money: this.state.qaTeacher.money || 10,
          state: 0,
          title: this.state.qaTitle,
          content: this.state.qaContent,
          answerCount: 0,
          tag: [],
          createAt: new Date(),
          updateAt: new Date(),
        }
        this.state.data = qaData;
      } else if (this.state.orderType == 'peek') {

      } else if (this.state.orderType == 'collection') {
      }
      let modalContent = (
        <div>
          <div className="modal-body">
            <div className="way">
              <span className="menu">支付方式:</span>
              <div className="payment">
                <button type="button" className="zfspan btn btn-default btn-sm" id="zfye" style={{ backgroundColor: '#DDDDDD' }} onClick={this.methodClick.bind(this)}>账户余额</button>
              </div>
              <div className="payment">
                <button type="button" className="zfspan btn btn-default btn-sm" id="zfb" onClick={this.methodClick.bind(this)}>支付宝支付</button>
              </div>
              <div style={{ 'clear': 'both' }}>
              </div>
            </div>
            <div className="way" style={{ marginTop: '15px' }}>
              <span className="menu">账户余额: </span>
              <div className="payment">
                ￥{Number(this.state.userAccount.balance).toFixed(2) || 0.00}
              </div>
              <div style={{ 'clear': 'both' }}></div>
            </div>
            <div className="pays" style={{ marginTop: '15px', height: '40px' }}>
              <div className="balance">
                <span className="alipay">支付金额:</span>
                <span className="money">￥{Number(this.state.totalPrice).toFixed(2)}</span>
              </div>
              <div className="footer" style={{ paddingTop: '56px' }}>
                <div id="line"></div>
                <button type="button" className="topay btn btn-success" onClick={this.handlePayment.bind(this)}>去付款</button>
                {prevBtn}
              </div>
            </div>
          </div>
        </div>
      );
      this.setState({ modalContent: modalContent, modalTitle: '选择支付方式', modalHeight: {} });
    }
  }

  //确认支付信息
  genConfirmPayment() {
     let codeStyles = {};
      if(this.state.orderType == "course") { 
        codeStyles = {
          display: "inline-block"
        }
      } else {
      codeStyles = {
            display: "none"
          }
      }  
    let modalContent = (
      <div>
        <div className="modal-body">
          <div className="rows">
            <span className="condition">使用人数：</span>
            <span className="result"><input type="text" defaultValue={this.state.amount} onChange={this.handleCountChange.bind(this)} className="count" />&nbsp;人</span>
          </div>
          <div className="rows">
            <span className="condition">课程期限：</span>
            <span className="result">{this.state.data.usePeriod ? this.state.data.usePeriod + ' 个月' : "12 个月"}</span>
          </div>
          <div className="rows">
            <span className="condition">金&nbsp;&nbsp;额：</span>
            <span className="result">￥{Number(this.state.totalPrice).toFixed(2)}</span>
            <Button id="code" style={codeStyles} type="primary" ghost onClick={this.clickPromoCode.bind(this)}>优惠码</Button>
          </div>
          <div className="rows" id="promocode" style={{display: "none"}}>
            <span className="condition">优惠码：</span>
            <Input className="result" size="small" placeholder="输入优惠码" defaultValue={this.state.promoCode} onChange={this.handlePromoCode.bind(this)} />
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="submitbtn btn btn-success" onClick={this.selectPayment.bind(this)}>下一步</button>
        </div>
      </div>
    );
    this.setState({
      modalContent: modalContent,
      modalHeight: {},
      payMethod: 0,
    });
  }
  // 输入优惠码
  clickPromoCode() {
    $('#promocode').show();
  }
  // 优惠码
  handlePromoCode(e) {
    this.setState({ promoCode: e.target.value });
  }

  //检测字数限制
  checkLimit(limit, e) {
    let length = e.target.value.length;
    if (length > limit) {
      message.warn('超过字数限制!');
      return;
    }
    this.state.contentLength = length;
    //记录标题内容
    this.state.qaTitle = e.target.value;
    this.genQuiz();
  }

  //记录问题内容
  handleContentChange(e) {
    this.state.qaContent = e.target.value;
  }

  //提问时填写问题标题和问题内容s
  genQuiz() {
    let modalHeight = {height: '400px', width: '600px'}
    let holderStr = "填写问题标题，比如：关于光伏发电的成本高及高峰问题，实际应用中是怎样解决的？只能提一个问题，超过一个，专家默认回答第一个。(必填)";
    let limit = 30;
    let modalContent = (
      <div>
        <div className="modal-body" style={{height: '295px'}}>
          <div className="rows" style={{width: '600px', margin: '0px 0px 0px 20px'}}>
            <span style={{fontSize: '18px', width: '15%', float: 'left'}}>问题标题：</span>
            <textarea style={{width: '70%', float: 'left', resize: 'none'}} maxLength="30" defaultValue={this.state.qaTitle} onChange={this.checkLimit.bind(this, limit)} placeholder={holderStr} className="QaTitle"></textarea>
            <span style={{float: 'left', marginLeft:'5px', marginTop: '20px'}}>{this.state.contentLength}/{limit}</span>
          </div>
          <div className="rows" style={{width: '600px', margin: '30px 0px 0px 20px'}}>
            <span style={{fontSize: '18px', width: '15%', float: 'left'}}>问题描述：</span>
            <textarea onChange={this.handleContentChange.bind(this)} defaultValue={this.state.qaContent} style={{width: '70%', height: '200px', float: 'left', resize: 'none'}} placeholder="填写问题描述(必填)" className="QaContent"></textarea>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="submitbtn btn btn-success" onClick={this.selectPayment.bind(this)}>下一步</button>
        </div>
      </div>
    );
    this.setState({
      modalContent: modalContent,
      modalHeight: modalHeight,
      modalTitle: '付费提问',
      payMethod: 0,
      totalPrice: this.state.qaTeacher.money || 10,
      orderType: 'qa'
    });
  }

  render() {
    return (
      <div className="modal fade" id="myModal" tabIndex="9" role="dialog" aria-labelledby="myModalLabel" aria-hidden="false" style={{color:"black"}}>
        <div className="modal-dialog">
          <div className="mbody modal-content" style={this.state.modalHeight}>
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
              <h4 className="modal-title" style={{fontSize: '18px'}} id="myModalLabel">{this.state.modalTitle}</h4>
            </div>
            {this.state.modalContent}
          </div>
        </div>
      </div>
    );
  }
}

export default WaitPaymentWidget;

