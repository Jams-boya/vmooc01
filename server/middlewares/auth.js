import eventproxy from 'eventproxy';
import moment from 'moment';
import _ from 'lodash';
import userapp from '../user/userapp';
import commonfig from '../config';
import client from '../middlewares/redis';
import config from '../user/config';
import cmsDal from '../dal/cmsDal';
function judgeDomain(host) {
  const domain = commonfig.domain[host];
  return domain;
}

export default {
  async authUser(req, res, next) {
    const ep = new eventproxy();
    const domain = judgeDomain(req.host);
    let navigation = '';

    res.locals.user   = null;
    res.locals.config = commonfig;
    
    res.locals.domain  = domain;
    req.session.domain = domain;

    if (!navigation || !navigation.topNav) {
      navigation = await cmsDal.getNavigation(req.session.domain);
      if (navigation) {
        navigation['topNav']  = _.filter(navigation.iterms, (o) => {if (o.direct == 0) return true});
        navigation['footNav'] = _.filter(navigation.iterms, (o) => {if (o.direct == 1) return true});
      }
    }
    res.locals.navigation  = navigation;
    req.session.navigation = navigation;

    ep.fail(next);

    ep.all('get_user', user => {
      if (!user) {
        return next();
      }

      if (!user.active) {
        res.clearCookie(config.auth_cookie_name, {
          path: '/'
        });
        return next();
      }

      userapp.getUserRights(user._id, (err, rights) => {
        if (err)
          return next(err);

        user.rights = rights; // 权限right的code字段集合
        user._id    = user._id.toString();
        res.locals.user = req.session.user = user;
        return next();
      });
    });
    const signId = req.signedCookies[`${config.auth_cookie_name}${'signin'}`];
    if (signId && req.session.user && signId.split('$$$$')[0] !== req.session.user.id) {
      userapp.getPersonInfo(signId.split('$$$$')[0], ep.done('get_user'));
    } else {
      if (req.session.user) {
        // TODO performance tune
        userapp.getUserRights(req.session.user._id, (err, rs) => {

          /** 查询讲师变动 */
          client.get(`expertStateChange:${req.session.user._id}`, (err, redis_res) => {
            if (redis_res) {
              userapp.getPersonInfo(req.session.user._id, (err, userInfo) => {
                req.session.user = userInfo;
                req.session.user.rights = rs;
                res.locals.user = req.session.user;
                client.del(`expertStateChange:${req.session.user._id}`, (err, redis_result) => {
                  return next();
                });
              });
            } else {
              req.session.user.rights = rs;
              res.locals.user = req.session.user;
              return next();
            }
          });

        });
      } else {
        let authToken = req.signedCookies[config.auth_cookie_name] || req.signedCookies['psp'];
        if (!authToken) {
          return next(); 
        }
        userapp.getPersonInfo(authToken.split('$$$$')[0], ep.done('get_user'));
      }
    }
    
  }
};