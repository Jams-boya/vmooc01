import {myRender} from './common';
import collectionDal from '../dal/courseCollectionDal';

export default {
	/**
   * 首页获取专题列表
   * @author bs
   */
  // getCollections(req, res, next) {
  // 	collectionDal.getCollections((err, data) => {
  		
  // 	});
  // }

  //根据专题id推送我的课程
  myCoursePush(req, res, next) {
  	let order = req.query.order;
  	let user  = req.session.user;
  	let id    = req.query.collectionId;
  	myCoursePush(user, order, id, (err, data) => {
  		if (err) {
  			console.log("err", err);
  			return next(err);
  		}
  		res.json(data);
  	});
  }
}