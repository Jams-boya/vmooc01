import basicMethod from './basicMethod';
import validator from 'validator';
import config from './config';
import comConfig from '../config';
// import iconv from 'iconv-lite';
let userapp = {};

/** 获取cookies */
function genSessionCookie(user, res, domain) {
    let authToken = user._id + '$$$$';
    
    if (config.domain === 'localhost') {
      res.cookie(config.auth_cookie_name, authToken, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        signed: true,
        httpOnly: true,
      });
    } else {
      res.cookie(config.auth_cookie_name, authToken, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        signed: true,
        httpOnly: true,
        domain: domain
      });
    }

    res.cookie(`${config.auth_cookie_name}${config.auth_cookie_signout}`, authToken, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      signed: true,
      httpOnly: true,
      domain: domain
    });
}

/** 显示登录页面 */
userapp.showsignin = function(req, res, next) {
  delete req.session.user;
  delete res.locals.user;
  res.clearCookie(config.auth_cookie_name, { path: '/' });
  res.clearCookie(config.auth_cookie_name, { path: '/', domain: req.session.domain });
  res.clearCookie('connect.sid', {path: '/', domain: 'psptest.chungdee.com'});

	if (req.query.fr)
    req.session._loginReferer = req.query.fr;
  else if (req.headers.referer)
    req.session._loginReferer = req.headers.referer;
  else
    req.session._loginReferer = '/';

	if (req.session._loginReferer.indexOf('signup') >= 0 ||
    req.session._loginReferer.indexOf('signin') >= 0 || 
    req.session._loginReferer.indexOf('resetpwd') >= 0 ||
    req.session._loginReferer.indexOf('lostpasswordentry') >= 0)
    req.session._loginReferer = '/';
  
	res.render(req.session.domain == comConfig.vmoocDomain? 'sign/signin': 'sign/mhp_signin');
}

/** 用户登录 */
userapp.loginIn = function(req, res, next) {
  console.log('----start login-----');
  const username = validator.trim(req.body.username).toLowerCase();
  const password = validator.trim(req.body.password);
  const remember = req.body.remember;
  if (!username || !password) {
    res.status(422);
    return res.render(req.session.domain == comConfig.vmoocDomain? 'sign/signin': 'sign/mhp_signin', {error : '无效的用户名或密码'});
  }

  /** vmooc 本身的登录 */
  if(req.session.domain == comConfig.vmoocDomain) {
    basicMethod.loginIn(username, password, config.module, (err, loginInfo) => {
      if (!loginInfo || !loginInfo.hasUser) {
        res.status(403);
        return res.render(req.session.domain == comConfig.vmoocDomain? 'sign/signin': 'sign/mhp_signin', {error : '无效的用户名或密码'});
      }
      if (!loginInfo.active && loginInfo.note)
        return res.status(403).render(req.session.domain == comConfig.vmoocDomain? 'sign/signin': 'sign/mhp_signin', {error: loginInfo.note});

      
      req.session.user = loginInfo;

      // logger.info(`user[${loginInfo.login_name}]signin[${password}]`);  
      // let authToken = req.signedCookies[userapp.config.auth_cookie_name];

      if (remember) {
        genSessionCookie(loginInfo, res, req.session.domain);
      }
      res.redirect(req.session._loginReferer || '/');

    });
  } else {
    //{"scalar":"1","username":"admin","email":"admin@admin.com","password":"admin"}' } '{"scalar":"1","username":"admin","email":"admin@admin.com","password":"admin"}
    basicMethod.OAuthLogin(username, password, (err, result) => {
      console.log('====', result);
      if (!result || err) 
        return res.render(req.session.domain == comConfig.vmoocDomain? 'sign/signin': 'sign/mhp_signin', {error : '无效的用户名或密码'});
      
      if (result == -2 || result.scalar == -2)
        return res.render(req.session.domain == comConfig.vmoocDomain? 'sign/signin': 'sign/mhp_signin', {error : '密码错误'});
        
      if (result == -1 || result.scalar == -1)
        return res.render(req.session.domain == comConfig.vmoocDomain? 'sign/signin': 'sign/mhp_signin', {error : '用户不存在'});
        
      /** 绑定vmooc数据库人员信息 */
      result['username'] = username;
      basicMethod.bindOtherOAuth(result, req.session.domain, (err, user) => {
        req.session.user = user;
        genSessionCookie(user, res, req.session.domain);
        res.redirect(req.session._loginReferer || '/');
      });
    });
  }
}

/** 退出登录 */
userapp.signout = function(req, res, next) {
  res.clearCookie(config.auth_cookie_name, { path: '/'});
  res.clearCookie('psp', { path: '/', domain: req.session.domain });
  res.clearCookie(config.auth_cookie_name, { path: '/', domain: req.session.domain });
  res.clearCookie('connect.sid', {path: '/', domain: 'psptest.chungdee.com'});
  res.clearCookie('connect.sid', {path: '/', domain: req.session.domain});
  res.clearCookie(`${config.auth_cookie_name}signin`, { path: '/', domain: req.session.domain });
  // res.clearCookie(config.bbs_cookie_name, { path: '/', domain: config.domain });
  req.session.destroy();
  res.redirect('/');
}

/** 用户验证 */
userapp.userRequired = function (req, res, next) {
  if (!req.session || !req.session.user) {
    return res.redirect(`/signin?fr=${encodeURIComponent(req.url)}`);
  }
  // if (!req.session.user.active) {
  //   return res.status(403).send('您的账号已被停用');
  // }

  next();
}

/**
 * 判断用户是否具有权限
 * @param {Array} right 权限code
 */
userapp.rightRequired = function(right) {
  return (req, res, next) => {
    let rights = new Set(req.session.user.rights);
    if (!rights.has(right)) {
      return res.status(403).send('您无权限访问');
    }
    next();
  }
}

/**
 * 判断用户是否具有权限集合中的权限(满足一个即可)
 * @param {Array} rights 权限code集合
 */
userapp.rightOrRequired = function(rights) {
  return (req, res, next) => {
    let myRights = new Set(req.session.user.rights);
    for (let r of rights) {
      if (myRights.has(r)) {
        return next();
      }
    }
    return res.status(403).send('您无权限访问');
  }
}

/**
 * 判断是否是模块管理员
 */
userapp.companyAdminRequired = function(module) {
  return (req, res, next) => {
    basicMethod.isAdminByModule(
    req.session.user.login_name,
    module,
    (err, u) => {
      if (err || !u || u.note) {
        return res.status(403).send('您无权访问');
      }
      
      if (u && u.isAdmin) {
        return next();
      }

      return res.status(403).send('您无权访问');
    });
  }
}

/** 确认讲师资格 */
userapp.confirmInstructor = function(userId, isInstructor, callback) {
  if (!userId) {
    return callback(null, null);
  }

  basicMethod.confirmInstructor(userId, isInstructor, (err, result) => {
    callback(null, result);
  });
}

/** 验证讲师资格 */
userapp.checkIsTeacher = function(req, res, next) {
  const user = req.session.user;
  if (!user || !user.isInstructor) {
    return res.status(403).send('您无权访问');
  }

  next();
}

/** 获取人员 */
userapp.getPersonList = function(req, res, next) {
  const keyword = req.query.keyword;
  const company_code = req.session.user.company_code;
  req.query['company_code'] = company_code;
  basicMethod.getPersonList(req.query, (err, result) => {
    if(err) {
      res.status(500).send(err);
    }

    if (result) {
      const count = result.count;
      const list = result.list;

      if (validator.isInt(String(count))) {
        res.setHeader('x-total-count', count);
      }
      res.json(list);
    }
  });
}

/** 更改密码 */
userapp.editUserPwd = function(userId, newpwd, callback) {

  basicMethod.editUserPwd(userId, newpwd, (err, result) => {
    if (err)
      console.log("err=", err);
    callback(err, result);
  });
}

/** 读取人员信息 */
userapp.getPersonInfo = function(userId, callback) {
  basicMethod.getUserByUserId(userId, (err, userInfo) => {
    if (err)
      console.log("err=", err);
    callback(err, userInfo);
  });
}

/** 获取所有用户 */
userapp.getAllUsersList = function(req, res, next) {
  const domain = req.session.domain;
  req.query['domain'] = domain;
  basicMethod.getAllUsersList(req.query, (err, result) => {
    if(err) {
      res.status(500).send(err);
    }

    if (result) {
      const count = result.count;
      const list = result.list;

      if (validator.isInt(String(count))) {
        res.setHeader('x-total-count', count);
      }
      res.json(list);
    }
  });
}

/** 编辑用户基本信息 */
userapp.editUserBasicInfo = function (userId, query, callback) {
  basicMethod.editUserBasicInfo(userId, query, (err, result) => {
    if (err)
      console.log("err=", err);
    callback(err, result);
  });
}

userapp.getAllUsersCount = function(req, res, next) {
  basicMethod.getAllUsersCount(req.query, (err, count) => {
    if(err) {
      res.status(500).send(err);
    }
    res.setHeader('Cache-Control', 'no-cache');
    res.json(count);
  });
}

/** 读取用户权限 */
userapp.getUserRights = function(userId, callback) {
  basicMethod.getUserRights(userId, callback);
}


export default userapp; 