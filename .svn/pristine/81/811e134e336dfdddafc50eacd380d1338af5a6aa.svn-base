import request from 'request';
import https   from 'https';
import http    from 'http';
import fs      from 'fs';
import qs      from 'querystring';
import config  from './config';
// import iconv   from 'iconv-lite';
// import gbk from 'gbk';

let basicMethod = {};

basicMethod.DEFALT_HOST   = 'acc.chungdee.com';//默认主机
basicMethod.DEFALT_PORT   = 8899;//默认端口
basicMethod.protocol      = 'http';
basicMethod.defaultParams = {
	userCode  : "57ddf860e55179a6ba943695",
	userModule: "vmooc"
};

let host = "";
host = config.isDev? `http://localhost:8899`: `${basicMethod.protocol}://${basicMethod.DEFALT_HOST}`;
host = config.isServer? 'http://localhost:86': host;
host = config.url;
export default {
	/**
	 * [loginIn 登录]
	 * @param  {[type]}   loginName [登录名]
	 * @param  {[type]}   password  [密码]
	 * @param  {[type]}   module    [模块]
	 * @param  {Function} callback  [description]
	 */
	loginIn(loginName, password, module, callback) {
		const loginInfo = {
			loginName,
			password,
			...basicMethod.defaultParams
		};
		const params = qs.stringify(loginInfo);//传输的参数
		const url = `${host}/authUser?${params}`;
		request.post(url, (err, resp, body) => {
			if (err) 
				return callback(err, null);
			if (resp.statusCode === 200) {
				let result = resp ? JSON.parse(resp.body): {err: "network error"};
				return callback(err, result);
			}
			callback(err, null);
		});
	},
	/**
	 * [getUserByLoginName 根据登录名查找用户]
	 * @param  {[type]}   loginName [登录名]
	 * @param  {Function} callback  [description]
	 */ 
	getUserByLoginName(loginName, callback) {
		const loginInfo = {
			loginName,
			...basicMethod.defaultParams
		}
		const params = qs.stringify(loginInfo);//传输的参数
		request.get(`${host}/getUserByLoginName?${params}`, (err, resp, body) => {
			if (err) 
				return callback(err, null);
			if (resp.statusCode === 200) {
				let result = resp ? JSON.parse(resp.body): {err: "network error"};
				return callback(err, result);
			}
			callback(err, null);
		});
	},

	/**
	 * [isAdminByModule 是否是模块的管理员]
	 * @param  {[type]}   loginName  [登录名]
	 * @param  {[type]}   moduleCode [模块]
	 * @param  {Function} callback   [description]
	 */ 
	isAdminByModule(loginName, moduleCode, callback) {
		const loginInfo = {
			loginName,
			moduleCode,
			...basicMethod.defaultParams
		}
		const params = qs.stringify(loginInfo);//传输的参数
		request.post(`${host}/isAdminByModule?${params}`, (err, resp, body) => {
			if (err) 
				return callback(err, null);
			if (resp.statusCode === 200) {
				let result = resp ? JSON.parse(resp.body): {err: "network error"};
				return callback(err, result);
			}
			callback(err, null);
		});
	},

	/**
	 * [confirmInstructor 确认讲师资格]
	 * @param  {[type]}   loginName  [登录名]
	 * @param  {[type]}   moduleCode [模块]
	 * @param  {Function} callback   [description]
	 */ 
	confirmInstructor(userId, isInstructor, callback) {
		const loginInfo = {
			userId,
			isInstructor,
			...basicMethod.defaultParams
		}
		const params = qs.stringify(loginInfo);//传输的参数
		request.post(`${host}/confirmInstructor?${params}`, (err, resp, body) => {
			if (err) 
				return callback(err, null);
			if (resp.statusCode === 200) {
				let result = resp ? JSON.parse(resp.body): {err: "network error"};
				return callback(err, result);
			}
			callback(err, null);
		});
	},

	/**
	 * getPersonList 获取人员列表
	 * condition 搜索条件
	 * 
	 */
	getPersonList(condition, callback) {
		condition = {...basicMethod.defaultParams, ...condition};
		const params = qs.stringify(condition);

		request.post(`${host}/getpersonlist?${params}`, (err, resp, body) => {
			if (err) 
				return callback(err, null);
			if (resp.statusCode === 200) {
				
				let result = resp ? JSON.parse(resp.body): {err: "network error"};
				return callback(err, result);
			}
			callback(err, null);
		});
	},

	/** 更改用户密码 */
	editUserPwd(userId, newpwd, callback) {
		const condition = {...basicMethod.defaultParams, userId, newpwd};
		const params = qs.stringify(condition);
		request.post(`${host}/editUserPwd?${params}`, (err, resp, body) => {
			if (err) 
				return callback(err, null);
			if (resp.statusCode === 200) {
				
				let result = resp ? JSON.parse(resp.body): {err: "network error"};
				return callback(err, result);
			}
			callback(err, null);
		});
	},

	/** 根据用户id查找用户信息*/
	getUserByUserId(userId, callback) {
		const userInfo = {
			userId,
			...basicMethod.defaultParams
		}
		const params = qs.stringify(userInfo);//传输的参数
		request.get(`${host}/getUserByUserId?${params}`, (err, resp, body) => {
			if (err) 
				return callback(err, null);
			if (resp.statusCode === 200) {
				let result = resp ? JSON.parse(resp.body): {err: "network error"};
				return callback(err, result);
			}
			callback(err, null);
		});
	},

	/** 获取所有用户的列表 */
	getAllUsersList(condition, callback) {
		condition = {...basicMethod.defaultParams, ...condition};
		const params = qs.stringify(condition);

		request.post(`${host}/getallusersList?${params}`, (err, resp, body) => {
			if (err) 
				return callback(err, null);
			if (resp.statusCode === 200) {
				
				let result = resp ? JSON.parse(resp.body): {err: "network error"};
				return callback(err, result);
			}
			callback(err, null);
		});
	},

	/** 编辑用户基本信息 */
	editUserBasicInfo(userId, query, callback) {
		let qry = {userId, ...query, ...basicMethod.defaultParams};

		const params = qs.stringify(qry);
		request.post(`${host}/edituserbasicinfo?${params}`, (err, resp, body) => {
			if (err) 
				return callback(err, null);
			if (resp.statusCode === 200) {
				
				let result = resp ? JSON.parse(resp.body): {err: "network error"};
				return callback(err, result);
			}
			callback(err, null);
		});
	},

	/** 获取所有用户的统计 */
	getAllUsersCount(condition, callback) {
		condition = {...basicMethod.defaultParams, ...condition};
		const params = qs.stringify(condition);

		request.get(`${host}/getuserscount?${params}`, (err, resp, body) => {
			if (err) 
				return callback(err, null);
			if (resp.statusCode === 200) {
				
				let result = resp ? JSON.parse(resp.body): {err: "network error"};
				return callback(err, result);
			}
			callback(err, null);
		});
	},

	/** 获取用户权限 */
	getUserRights(userId, callback) {
		let condition = {...basicMethod.defaultParams, userId};
		const params = qs.stringify(condition);
		request.get(`${host}/getuserrights?${params}`, (err, resp, body) => {
			if (err) 
				return callback(err, null);
			if (resp.statusCode === 200) {
				
				let result = resp ? JSON.parse(resp.body): {err: "network error"};
				return callback(err, result);
			}
			callback(err, null);
		});
	},

	/** 授权登录 */
	OAuthLogin(loginName, password, callback) {
		request.post({
			url : `${config.mhpUrl}/api/vmooc/vmooc_login_api.php`,
			form: {
				name: loginName,
				pwd : password
			}},

			(err, resp, body) => {
				if (err) 
					return callback(err, null);
				if (resp.statusCode === 200) {
					let result = resp ? JSON.parse(resp.body): {err: "network error"};
					return callback(err, result);
				}
				callback(err, null);
				}
		);
	},

	/** 绑定其他来源的用户 */
	bindOtherOAuth(user, from, callback) {
		if (!user || !user.email)
			return callback({err: 'no email'}, null);

		const condition = {...basicMethod.defaultParams, ...user, from};
		const params = qs.stringify(condition);
		request.post(`${host}/bindOtherOAuth?${params}`, (err, resp, body) => {
			if (err) 
				return callback(err, null);
			if (resp.statusCode === 200) {
				
				let result = resp ? JSON.parse(resp.body): {err: "network error"};
				return callback(err, result);
			}
			callback(err, null);
		});
	}
}
