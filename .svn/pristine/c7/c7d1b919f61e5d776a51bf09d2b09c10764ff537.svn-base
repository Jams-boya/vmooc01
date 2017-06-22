import eventproxy from 'eventproxy';
import mongoose from 'mongoose';
import _ from 'lodash';
import fs from 'fs';
import moment from 'moment';
import {
  Company,
  Role,
  CmsModule,
  Recommend,
  FocusPicture,
  Partner,
  Navigation,
  CommissionLevel
} from '../models';
import commonDal from './commonDal';

// const logger = log4js.getLogger('app');
/** 搜索条件 */
function buildSearchCondition(query) {
  let condition = {};
  const fields = ["startAt", "endAt"];
  condition = commonDal.buildAndMatchConditions(fields, query);
  return condition;
}

/** 权限分组 */
function rightGroup(right) {
  CmsModule.aggregate([
    {group: {
      _id: {groupCode: '$groupCode'},
      modules: {$push: '$moduleCode'}
    }}
  ])
}
export default {
  /**
   * 返回用户具有的权限
   */
  getUserRights(_id, partnerDomain, callback) {
    const ep = new eventproxy();
    ep.all('allRights', 'userRoleRights',
      (allRights, userRoleRights) => {

        let result = [];

          userRoleRights.map((right) => {

            let moduleDetail = _.find(allRights, {
              moduleCode: right.moduleCode
            });
            if (!moduleDetail) {
              return;
            }

            let preGroup = _.find(result, {
              groupCode: moduleDetail.groupCode
            });
            if (!preGroup) {
              result.push({
                groupCode: moduleDetail.groupCode,
                groupCss: moduleDetail.groupCss,
                groupDisplayOrder: moduleDetail.displayOrder,
                groupName: moduleDetail.groupName,
                modules: [{
                  moduleCode: right.moduleCode,
                  moduleName: moduleDetail.moduleName,
                  operations: right.operations,
                  viewFellowData: right.viewFellowData,
                  editFellowData: right.editFellowData,
                  url: moduleDetail.moduleUrl,
                  displayOrder: moduleDetail.displayOrder,
                }],
              });
              return;
            }

            let preModule = _.find(preGroup.modules, {
              moduleCode: right.moduleCode
            });
            if (!preModule) {
              preGroup.modules.push({
                moduleCode: right.moduleCode,
                moduleName: moduleDetail.moduleName,
                operations: right.operations,
                viewFellowData: right.viewFellowData,
                editFellowData: right.editFellowData,
                url: moduleDetail.moduleUrl,
                displayOrder: moduleDetail.displayOrder,
              });
              return;
            }

            preModule.viewFellowData = preModule.viewFellowData || right.viewFellowData;
            preModule.editFellowData = preModule.editFellowData || right.editFellowData;
            right.operations.map((code) => {
              if (!preModule.operations.includes(code)) {
                preModule.operations.push(code);
              }
            });
          });

        result = _.orderBy(result, ['groupDisplayOrder'], ['asc']);
        result.map((grp) => {
          grp.modules = _.orderBy(grp.modules, ['displayOrder'], ['asc']);
        });

        callback(null, result);
      });


    // get all rights
    CmsModule.find({}).sort({
      displayOrder: 1
    }).exec(ep.done('allRights'));

    Role.findOne({partnerDomain}, (err, role) => {
      let result = [];
      if (role && role.right) {
        role.right.map(item => {
          item.codes.map(code => {
            code.map(c => {
              result.push({moduleCode: c});
            });
          });
        });
      }

      /** 默认权限 */
      if (role && role.defaultRight) {
        role.defaultRight.map(right => {
          result.push({moduleCode: right});
        });
      }
      ep.emit('userRoleRights', result);
    });
  },

  /** 读取推荐位管理 */
  getrecommend(page, callback) {
    page = new RegExp(page);
    Recommend.find({ page }, callback);
  },

  /** 上传焦点图 */
  applyfocuspic(content, callback) {
    FocusPicture.update({ platform: content.platform }, { $set: content }, { upsert: true }, callback);
  },

  /** 读取焦点图 */
  getfocuspic(platform, callback) {
    FocusPicture.findOne({ platform }, callback);
  },
  /** 合作方管理统计 */
  count(query, callback) {
    const condition = buildSearchCondition(query);
    Partner.count({ logicalDelete: 0 }, callback);
  },
  /**获取合作方列表 */
  list(query, callback) {
    const condition = buildSearchCondition(query);
    Partner.find({ logicalDelete: 0 }, null, commonDal.buildPageAndOrderOptions(query, { sort: { _id: -1 } }), callback);
  },
  /** 合作方添加编辑用户 */
  savePartner(partner, callback) {
    partner.updateAt = new Date().getTime();
    if (!partner._id) {
      partner.createAt = partner.updateAt;
      let p = new Partner(partner);
      p.save(callback);
    } else {
      Partner.findOneAndUpdate({ _id: partner._id }, partner, { upsert: true, new: true }, callback);
    }
  },
  /** 合作方编辑域名，修改配置 */
  editNavDomain(oldDomain, newDomain, callback) {
    Navigation.update({ domain: oldDomain }, { $set: { domain: newDomain } }, callback);
  },
  // 删除合作方
  delPartner(domain, callback) {
    Partner.update({ domain }, { $set: { logicalDelete: 1 } }, callback);
  },
  // 删除网页配置
  delNav(domain, callback) {
    Navigation.update({ domain }, { $set: { logicalDelete: 1 } }, callback);
  },
  /** 合作方管理初始添加初始顶部配置 */
  addFrontDeploy(newNav, callback) {
    let nav = new Navigation(newNav);
    nav.save(callback);
  },
  /** 顶部配置获取数据 */
  getNav(domain, callback) {
    Navigation.findOne({ domain, logicalDelete: 0 }, callback);
  },
  /** 顶部配置新增 */
  addNav(navInfo, callback) {
    let nav = new Navigation(navInfo);
    nav.save(callback);
  },
  /**获取底部配置 */
  bottomNav(domain, callback) {
    Navigation.findOne({ domain }, callback);
  },
  /**修改顶部 */
  editTop(domain, navigation, callback) {
    delete navigation._id;
    Navigation.update({ domain }, navigation, {upsert: true}, callback);
  },

  /** 根据域名读取页面配置 */
  async getNavigation(domain) {
    return new Promise(function (resolve, reject){
      Navigation.findOne({domain}, (err, data) => {
        if (err) {
          console.log('--err,', err);
        } else {
          return resolve(data);
        }
      });
    });
  },

  /** 根据域名读取权限和分成 */
  getRightsByDomain(domain, callback) {
    const ep = new eventproxy();

    ep.all('getRights', 'getLevel', (rights, level) => {
      callback(null, {rights, level});
    });

    /** 读取权限 */
    Role.findOne({partnerDomain: domain}, (err, rights) => {
      if (err)
        console.log('err', err);
      ep.emit('getRights', (rights && rights.right) || []);
    });

    /** 读取分成规则 */
    CommissionLevel.find({from: domain}, (err, level) => {
      if (err)
        console.log('err', err);
      ep.emit('getLevel', level);
    });
  },

  /** 修改权限 */
  editRightsByDomian(domain, rights, callback) {
    Role.update({partnerDomain: domain}, {$set: {right: rights}}, {upsert: true}, callback);
  },

  /** 修改分成设置 */
  editDeductByDomain(domain, deducts, callback) {
    const ep = new eventproxy();
    ep.after('editDeduct', deducts.length, (result) => {
      callback(null, result);
    });

    deducts.map(deduct => {
      CommissionLevel.update({from: domain, type: deduct.type}, {$set: {level: deduct.level || []}}, {upsert: true}, (err, item) => {
        if (err)
          console.log('err', err);

        ep.emit('editDeduct', item);
      });
    });
  }
}