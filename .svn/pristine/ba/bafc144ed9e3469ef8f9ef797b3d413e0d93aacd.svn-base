import mailer from 'nodemailer';
import crypto from 'crypto';
import smtpTransport from 'nodemailer-smtp-transport';
import config from '../config';
import util from 'util';
import log4js from 'log4js';

const _logger = log4js.getLogger('app');
const _transport = mailer.createTransport(smtpTransport(config.mail_opts));
const SITE_ROOT_URL = 'http://' + config.host;


const sendMail = function(data) {
    _transport.sendMail(data, (err) => {
        if (err)
            _logger.error(`send mail error: [${data.toString()}] [${err}]`); 
    });
}

/**
 * 发送激活通知邮件
 * @param {String} tomail 接收人的邮件地址
 * @param {String} token 重置用的token字符串
 * @param {String} name 接收人的用户名
 */
const sendActiveMail = function(tomail, token, name) {
    const from    = util.format('%s <%s>', config.name, config.mail_opts.auth.user);
    const to      = tomail;
    const subject = `${config.name}帐号激活`;
    const html    = '<p>您好：' + name + '</p>' +
        '<p>我们收到您在' + config.name + '的注册信息，请点击下面的链接来激活帐户：</p>' +
        '<a href  = "' + SITE_ROOT_URL + '/signup/active/' + token + '/' + tomail + '">激活链接</a>' +
        '<p>若您没有在' + config.name + '社区填写过注册信息，说明有人滥用了您的电子邮箱，请删除此邮件，我们对给您造成的打扰感到抱歉。</p>'; 

    sendMail({
        from: from,
        to: to,
        subject: subject,
        html: html
    });
};

/**
 * 发送邀请同事邮件
 * @param {String} tomail 接收人的邮件地址
 * @param {String} id 发送者的id
 * @param {String} name 发送者的名字
 * @param {String} company 发送者的公司名字
 */
const sendInviteWorkmateMail = function(tomail, id, name, company, companyCode) {
    const from    = util.format('%s <%s>', config.name, config.mail_opts.auth.user);
    const to      = tomail;
    const subject = `${config.name}邀请注册`;
    let   token   = '';

    const cip = crypto.createCipher(config.cipher, config.cipher_key);
    token += cip.update(JSON.stringify({tomail, id, name, company, companyCode}), 'utf8', 'hex');
    token += cip.final('hex');

    const html = 
        '<p>您好：</p>' +
        `<p>您的朋友${name}邀请您加入${config.name}, 请点击下面的链接来激活帐户：</p>` +
        `<a href="${SITE_ROOT_URL}/signup/invite/${token}">激活链接</a>`; 

    _logger.info(`sendInviteWorkmateMail: fr=${name}(${id}) to=${tomail}`);

    sendMail({from, to, subject, html});
};

/**
 * 发送邀请客户注册邮件
 * @param {String} tomail 接收人的邮件地址
 * @param {String} name 发送者的名字
 */
const sendInviteOtherMail = function(tomail, name) {
    const from    = util.format('%s <%s>', config.name, config.mail_opts.auth.user);
    const to      = tomail;
    const subject = `${config.name}邀请注册`;
    const html    = '<p>您好：</p>' +
        '<p>您的朋友' + name + '邀请您加入' + config.name + '，请点击下面的链接来进行注册：</p>' +
        '<a href  = "' + SITE_ROOT_URL + '/signup/">注册</a>'; 

    console.log('html=', html);

    sendMail({
        from: from,
        to: to,
        subject: subject,
        html: html
    });
};

/**
 * 发送被管理员添加通知邮件
 * @param {String} tomail 接收人的邮件地址
 * @param {String} name 接收人的用户名
 * @param {String} password 接收人的密码
 * @param {String} aname 发送者的密码
 */
const sendAdminNoticeMail = function(tomail, aname ,name, password ) {
     const from     = util.format('%s <%s>', config.name, config.mail_opts.auth.user);
     const to       = tomail;
     const subject  = `${config.name}已注册`;
     const html     = '<p>您好：</p>'+
          '<p>您的朋友' +aname+ '已帮您将邮箱号为' +tomail+ '的邮箱注册了石化设备全生命周期管理平台，登录名为：' +tomail+ ',密码为：'+
          password + ',请妥善保管您的账号和密码！</p>';
          
     sendMail({
         from:from,
         to: to,
         subject: subject,
         html: html
     });
     
     console.log('邮件发送成功');

};

/**
 * 发送邮件至上级
 * @param {String} aname 发件人
 * @param {String} name 收件人
 * @param {String} tomail 收件人email
 * @param {String} mail 发件人email
 * @param {String} desc 内容
 */
const MySuperiorMail = function(aname, name, tomail, mail, desc) {
     const from     = util.format('%s <%s>', aname, config.mail_opts.auth.user);
     const to       = tomail;//tomail
     const subject  = `${config.name}`;
     const html     = '<p>' + desc + '</p>';
     sendMail({
         from    : from,
         to      : to,
         subject : subject,
         html    : html
     });
};

/**
 * 发送邮件至下级
 * @param {String} aname 发件人
 * @param {String} tomail 收件人email
 * @param {String} desc 内容
 */
const MyteamMail = function(aname, tomail, desc) {
    
     const from     = util.format('%s <%s>', aname, config.mail_opts.auth.user);
     const to       = tomail;//tomail
     const subject  = `${config.name}`;
     const html     = '<p>' + desc + '</p>';
     sendMail({
         from    : from,
         to      : to,
         subject : subject,
         html    : html
     });
};

export default {
    sendMail,
    sendActiveMail,
    sendInviteWorkmateMail,
    sendInviteOtherMail,
    sendAdminNoticeMail,
    MySuperiorMail,
    MyteamMail
}

