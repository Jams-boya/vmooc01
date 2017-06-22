import './css/buttons.css';
import './css/notpay.css';
import _ from 'lodash';
import { Popover, message, Button } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import React, { Component } from 'react';
import ReactDom from 'react-dom';
import display from './display.js';
import Answer from './answer.js';
import CourseQa from './courseqa.js';
import Recommend from './recommend.js';
import WaitPaymentWidget from 'js/common/widget/waitPaymentWidget';
import bootbox from 'bootbox';

(() => {
    let answer;
    let courseQa;
    let recommend;
    let payment;
    let questionid = question;
    let userId = que.userId; //wac
    let answerInfo;
    let askerId = que.askerId;
    //@updateAuthor: wac
    $('.expertAnswer').hide();
    $.get('/findAsker', { askerId }, (data) => {
        $('#askNick')[0].innerHTML = data.nickName;
    });
    if (guser) {
        let guserId = guser._id;
        $.post('/selsetMoney', { guserId }, (r) => {
            if (que.state == 1 && que.askerId != guserId) {
                $('.expertAnswer').show();
                // $('.expertAnswer')[0].style.display = "block";    
                $('.anBtn').click(() => {
                    if ($('.anCon').val().length < 50) {
                        message.warn('回答不少于50字');
                        return false;
                    } else {
                        bootbox.confirm({
                            message: "确定提交?",
                            buttons: {
                                confirm: {
                                    label: '确认',
                                    className: 'btn-success'
                                },
                                cancel: {
                                    label: '取消',
                                    className: 'btn-danger'
                                }
                            },
                            callback: function(result) {
                                if (result) {
                                    let answerText = $('.anCon').val();
                                    if (answerText != '') {
                                        let answers = {};
                                        let createAt = new Date();
                                        answers.content = answerText;
                                        answers.questionId = que._id ? que._id : '';
                                        answers.answererId = que.requiredAnswerId ? que.requiredAnswerId : '';
                                        answers.answererName = que.requiredAnswerName ? que.requiredAnswerName : '';
                                        answers.answererAvatar = que.requiredAnswerAvatar ? que.requiredAnswerAvatar : '';
                                        answers.createAt = createAt;
                                        answers.money = r.money;
                                        answers.ordersId = que.ordersId ? que.ordersId : '';
                                        answers.ordersCode = que.ordersCode ? que.ordersCode : '';
                                        $.ajax({
                                            url: '/expertAnswerPay',
                                            type: 'post',
                                            async: false,
                                            data: {
                                                answers: answers
                                            },
                                            success: (data) => {
                                                if (data.ok) {
                                                    message.success('回答成功!');
                                                    location.reload(true);
                                                    localStorage.setItem('flag', true);
                                                    $('.expertAnswer').hide();
                                                    answer = ReactDom.render( <
                                                        Answer url = "/answer"
                                                        id = { answers.questionId }
                                                        userId = { answers.answererId }
                                                        />,
                                                        document.querySelector('.answer')
                                                    );
                                                }
                                            },
                                            error: (err) => {
                                                console.log('expertAnswer: ', err);
                                            }
                                        });
                                    }
                                }
                            }
                        });
                    }
                });
            }
        });
    }

    
    let answerState = {};
    //@updateAuthor: wac end
    if (que.state == 2) {
        if (guser) {
            let guserId = guser._id;
            // 专家回答问题
            answer = ReactDom.render( <
                Answer url = "/answer"
                id = { questionid }
                userId = { guserId }
                peekClick = { onPay }
                />,
                document.querySelector('.answer')
            );
            answerState = answer.state.data;
        } else {
            let guserId = "";
            answer = ReactDom.render( <
                Answer url = "/answer"
                id = { questionid }
                userId = { guserId }
                peekClick = { onPay }
                />,
                document.querySelector('.answer')
            );
        }
    } else if (que.asker == guser._id && que.state == 1) {
        $('.expertAnswer')[0].style.display = "none";
        return false;
    }
    let qInfo = answerState;
    qInfo.name = $("#ctitle").html();
    qInfo.price = Number($('#price').text());
    //支付组件
    let payWidget = ReactDom.render( <
        WaitPaymentWidget data = { qInfo }
        orderType = { "peek" }
        />,
        document.querySelector('.buy-modal')
    );
    function onPay() {
        payWidget.componentWillReceiveProps({ orderType: 'peek' });
        if (guser) {
            // $.post('/findIsBuyCourse', { userId: guser._id, questionid: questionid }, (results) => {
            $('#myModal').modal("show");
            // if (results.length == 0) {
            //     message.warn('偷看前需先购买该课程！');
            //     return false;
            // } else if (results[0].userId == guser._id) {
            //     $('#myModal').modal("show");
            // }
            // })
        } else if (!guser) {
            bootbox.alert({
                message: "请先登录!",
                size: 'small'
            });
            window.location.href = '/signin';
        }
    }
})();