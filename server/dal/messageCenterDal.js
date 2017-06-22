import eventproxy from 'eventproxy';
import _ from 'lodash';
import validator from 'validator';
import log4js from 'log4js';
import mongoose from 'mongoose';
import { Messages } from '../models';
import commonDal from './commonDal';
import moment from 'moment';

export default{
	/*获取我的信息总数
	 *@author bs
	 */
	getMyMessagesCount(filter, callback) {
		Messages.count(filter, callback);
	},

	/*获取我的信息分页
	 *@author bs
	 */
	getMyMessages(filter, curPage, limit, callback) {
		let offset = Number(curPage);
		Messages.find(filter)
		.lean()
		.sort({'state': 'asc', '_id': -1})
		.skip((offset - 1) * Number(limit))
		.limit(Number(limit))
		.exec((err, messages) => {
			messages.map(message => {
				message.createAt = new Date(message.createAt).toLocaleString();
				if (message.state == 0)
					message.content = message.content;
			});
			callback(null, messages);
		});
	},

	//标记信息为已读
	updateMessage(mId, callback) {
		Messages.update({_id: mongoose.Types.ObjectId(mId)}, { $set: { state: 1 } }, callback);
	}
}