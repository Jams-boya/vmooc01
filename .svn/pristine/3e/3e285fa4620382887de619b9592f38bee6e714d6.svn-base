import _ from 'lodash';
import validator from 'validator';
import eventproxy   from 'eventproxy';
import {myRender} from './common';
import messageCenterDal from '../dal/messageCenterDal';

export default {
	/*	消息中心入口
	 *	@author bs
	*/
	messageCenterEntry(req, res, next) {
		let type = req.query.type;
		myRender(req, res, 'messageCenter/messageCenter', {layout: 'public_layout_user', type: type});
	},

	//获取我的信息（总数）
	getMyMessagesCount(req, res, next) {
		let filter = req.query.filter;
		console.log(req.query.filter);
		messageCenterDal.getMyMessagesCount(filter, (err, count) => {
			if (err) {
				console.log("err", err);
				res.json({err: err});
				return;
			}
			res.setHeader('Cache-Control', 'no-cache');
      res.json(count);
		});
	},

	//获取我的分页
	getMyMessages(req, res, next) {
		let filter = req.query.filter;
		let curPage = req.query.curPage;
		let limit = req.query.limit;
		messageCenterDal.getMyMessages(filter, curPage, limit, (err, data) => {
			if (err) {
				console.log("err", err);
				res.json({err: err});
				return;
			}
			res.setHeader('Cache-Control', 'no-cache');
      res.json(data);
		});
	},

	//标记消息已读
	updateMessage(req, res, next) {
		messageCenterDal.updateMessage(req.query.mId, (err, data) => {
			if (err) {
				console.log("err", err);
				res.json({err: err});
				return;
			}
			res.setHeader('Cache-Control', 'no-cache');
      res.json(data);
		});
	},
}
