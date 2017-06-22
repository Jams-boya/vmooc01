import hbhelper from './hbhelper';
import _ from 'lodash';
import autoincrement from '../dal/autoincrement';
import { Messages } from '../models';
import socketServer from '../socket';
/** 获取基本信息 */
function getGroupModuleCode(req) {
  let groupCode, moduleCode;
  if (!req.session.user || !req.session.user.cmsModule) {
    return {groupCode, moduleCode};
  }
  let rights = req.session.user.cmsModule;  
  let url = req.url.split('?')[0];
  url = url !== '/cms' ? _.trimEnd(url, '/') : url;

  rights.some((right) => {

    let module = _.find(right.modules, {url}); 

    if (module) {
      groupCode  = right.groupCode;
      moduleCode = module.moduleCode;
      return true;
    }

    return false;
  });
  return {groupCode, moduleCode};
}

/** 生成订单号 */
async function buildSn(module) {
  return new Promise(function (resolve, reject){
    // 对照表
    const lut = {
      course: 12,
      collection: 13,
      qa: 11
    };
    // 时间
    const time = moment().format("YYMMDD");
    autoincrement.buildautoincrement('order', (err, increment) => {
      if (err || !increment)
        return reject(err);
      let orderSn = `${lut[module]}${time}${increment.incrementcount}`;
      return resolve(orderSn);
    });
  });
}

export function myRender(req, res, view, locals = {}) {

  const {groupCode, moduleCode} = getGroupModuleCode(req);
  if (req.session.user) {
    let session = req.session.user._id;
    Messages.find({userId: req.session.user._id, state: 0}, {type: 1}, (err, messages) => {
      res.render(view, {
        ...locals,      
        groupCode,
        user: req.session.user,
        newMessage: {
          count: messages.length > 0 ? messages.length : "" , 
          type: messages.length > 0 ? messages[0].type : 'course'
        },
        moduleCode,
        helpers: hbhelper,
      });
    });
  } else {
    res.render(view, {
      ...locals,      
      groupCode,
      user: req.session.user,
      newMessage: 0,
      moduleCode,
      helpers: hbhelper,
    });
  }
  
}

