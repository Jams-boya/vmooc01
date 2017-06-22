module.exports = {
	name: '视频课程',
  port: 7777,
  browsersync_port: 7070, 

  run_at_win: false,

  db: 'mongodb://127.0.0.1/vmooc',
	mongoose_debug: true,
	session_serect: 'vmooc!session!serect!!!',
  auth_cookie_name: 'vmooc',
  session_user_check_interval: 3,

	use_redis: true,
  redis_host: '127.0.0.1',
  redis_port: 6379,
  redis_db: 3,
  test :true,



  /** 用户点击的前缀 */
  userUrl: 'http://acc.chungdee.com',
  pspUrl: 'http://www.lcpsp.com',
  vmoocUrl: 'http://vmooc.chungdee.com',
  avatorUrl: 'http://localhost:8888'
};
