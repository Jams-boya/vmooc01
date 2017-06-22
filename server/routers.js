import express from 'express';
import account from './bl/account';
import cms from './bl/cms';
import course from './bl/course';
import enumcode from './bl/enumCode';
import expert from './bl/expert';
import expertqa from './bl/expertqa';
import home from './bl/home';
import menu from './bl/menu';
import order from './bl/order';
import player from './bl/player';
import project from './bl/project';
import qrcode from './bl/qrcode';
import setup from './bl/setup';
import special from './bl/special';
import teacher from './bl/teacher';
import test from './bl/test';
import uploader from './bl/uploader';
import userapp from './user/userapp';
import withdraw from './bl/withdraw';
import courseCollection from './bl/courseCollection';
import messageCenter from './bl/messageCenter';

// import userapp from './user/userapp';
const routers = express.Router();

// /** 首页入口 */
routers.get('/', home.entry);

/** 用户 */
//登录页面
routers.get("/signin", userapp.showsignin);
// //登录
routers.post('/signin', userapp.loginIn);
// 注销
routers.get("/signout", userapp.signout);
// 获取用户列表
routers.get('/getpersonlist', userapp.userRequired, userapp.getPersonList);

/**
 * 课程介绍、目录、专家答疑
 * @author: gs
 */
// 前端课程详情入口
routers.get('/course/:id', course.entry);
// 获取课程学习者列表
routers.get('/courselearners', course.getLearners);
// 获取相关课程的信息
routers.post('/relevantcourse', course.getRelevantCourse);
// 获取所有课程
routers.get('/findAllCourse', course.findAllCourse);
// 获取课程介绍的信息
routers.get('/courseintro', course.getCourseIntro);
// 获取课程目录的信息
routers.get('/coursecatalog', course.getCourseCatalog);
// 获取课程问答的信息
routers.get('/courseqa', course.getCourseQa);
// 查询讲师信息
routers.get('/findExpert', expert.findExpert);
//我的问答入口
routers.get('/myQAEntry', userapp.userRequired, course.myQAEntry);
//我的偷看入口
routers.get('/myPeekEntry', userapp.userRequired, course.myPeekEntry);
//获取我的偷看总数
routers.get('/getMyPeekCount', userapp.userRequired, course.getMyPeekCount);
//获取我的偷看分页
routers.get('/getMyPeek', userapp.userRequired, course.getMyPeek);
// 根据回答id查询问题id
routers.post('/mypeek/findQuestionId', userapp.userRequired, course.findQuestionId);
// 获取我的问答总数
routers.get('/getMyQA', userapp.userRequired, course.getMyQA);

// 获取我的问答分页
routers.get('/getMyQACount', userapp.userRequired, course.getMyQACount);

// 偷看我的入口
routers.get('/peekMeEntry', userapp.userRequired, course.peekMeEntry);
//获取偷看我的总数
routers.get('/getPeekMeCount', userapp.userRequired, course.getPeekMeCount);
//获取偷看我的分页
routers.get('/getPeekMe', userapp.userRequired, course.getPeekMe);
/**
 * 专家问答(已付费、未付费)
 * @author:gs
 */
// 专家问答入口
routers.get('/expertqa/:id/:userId', expertqa.entry);
// 专家回答（付费前后）
routers.get('/answer', userapp.userRequired, expertqa.getAnswer);
// 查看问答(未登陆)
routers.post('/answerNoGuser', expertqa.answerNoGuser)
// 相关推荐问答
routers.get('/coursesqa', expertqa.getCoursesQa);
// 获取提问者的昵称
routers.get('/findAsker', expertqa.findAsker);
// 点赞统计并保存点赞人员
routers.get('/calLikeCount', userapp.userRequired, expertqa.getLikeCount);
// 查询用户是否点赞
routers.post('/findIsLike', userapp.userRequired, expertqa.findIsLike);
// 更新点赞用户
routers.get('/updateLike', userapp.userRequired, expertqa.updateLike);

/** expert */
//专家主界面入口
routers.get('/expert/:id', expert.entry);
/** expert */
//专家的回答
routers.post('/myAnswer', expert.myAnswer);
/** expert */
//专家的课程
routers.post('/ownCourse', expert.ownCourse);
/**
 * project课程页面入口
 * @author: wac
 */
routers.get('/course', course.courseListEntry);

//课程列表页--根据筛选项获取课程总数
routers.get('/coursesListCount', course.courseListCount);

//课程列表页--根据筛选项获取课程信息
routers.get('/coursesList', course.courseList);

/**
 *  讲师申请入口
 * @author:ls
*/
routers.get('/teachersign/steps/', userapp.userRequired, teacher.entry);
// 讲师申请合作
routers.post('/teachersign/add', teacher.add);

routers.get('/findOneUserIdByTeacher', teacher.findOneUserIdByTeacher);
// 申请列表
routers.get('/teachersign/list', userapp.userRequired, cms.getCmsModule, teacher.list);
// 搜索列表
routers.get('/teachersign/searchList', userapp.userRequired, teacher.searchList);
// 讲师通过
routers.get('/teachersign/through', userapp.userRequired, teacher.through);
// 讲师上传生活照
routers.post('/upload/:module', userapp.userRequired, uploader.upTeacher);
// 查找文件
routers.get('/view/:module/:userid/:file', uploader.view);
// 讲师管理
routers.get('/teacherRule', userapp.userRequired, cms.getCmsModule, teacher.rule);

routers.post('/teacherApply/employ', userapp.userRequired, teacher.employ);
// 完成状态用来判断下一次用户进入申请合作时直接跳转新页面
routers.post('/teacherApply/isState', userapp.userRequired, teacher.isState);

/**
 *  菜单
 * @author:ls
*/
routers.get('/menu/list', userapp.userRequired, menu.findOne);

/**
 * 获取课程分类信息
 * @author: wac
 */
routers.get('/courseMenuList', course.courseMenuList);
// 课程分类
routers.get('/gettype', enumcode.gettype);
/**
 * 随机获取推荐讲师信息
 * @author: wac
 */
routers.get('/recommend', course.recommend);
/**
 * 获取人气课程信息
 * @author: wac
 */
routers.get('/popCourse', course.popCourse);
/**
 * 视频播放入口
 * @author: wac
 */
routers.get('/player/:id', userapp.userRequired, player.playerEntry);
/**
 * 获取播放的课程详细信息
 * @author: wac
 */
routers.get('/courseDetails', player.CourseDetails);
/**
 * 校验用户是否已购买当前课程
 * @author: bs
*/
routers.get('/courseCheck', player.CourseCheck);

/**
 * 播放页获取讲师信息和问答信息
 * @author: bs
*/

routers.get('/playerTeacherInfo', player.getTeacherInfoById);

//test
//routers.get('/test', enumcode.test);

//讲师端-我的课程入口
routers.get('/courseManage', userapp.userRequired, userapp.checkIsTeacher, course.courseManageEntry);

//讲师端-订单管理入口
routers.get('/orderManage', userapp.userRequired, userapp.checkIsTeacher, order.orderManageEntry);

/**
 * 讲师发表课程(讲师端)
 * @author:gs
 */
routers.get('/coursepublish', userapp.userRequired, userapp.checkIsTeacher, course.PublishEntry);
/**
 * 获取课程的章节信息
 * @author:gs
 */
routers.get('/course/toc/tocPublish', userapp.userRequired, userapp.checkIsTeacher, course.getToc);
/**
 * 发布、保存为草稿
 * @author:gs
 */
routers.post('/course/toc/saveToc', userapp.userRequired, userapp.checkIsTeacher, course.saveToc);

/**
 * 专题页面入口
 * @author: wac
 */
routers.get('/special/:id', special.entry);

/**
 * 获取专题推荐专家信息
 * @author: wac
 */
routers.get('/rmdExperts', special.rmdExperts);

/**
 * 获取专题课程合辑信息
 * @author: wac
 */
routers.get('/courseCompilation', special.courseCompilation);

/**
 * 获取专题头部信息
 * @author: wac
 */
routers.get('/topInfo', special.topInfo);

/**讲师端-获取我的课程信息
 * @author bs
 */
routers.get('/getExpertCourses', userapp.userRequired, course.getExpertCourses);

/**讲师端-获取我的课程信息
 * @author bs
 */
routers.get('/getExpertCoursesCount', userapp.userRequired, course.getExpertCoursesCount);
/**根据课程id获取课程
 * @author bs
 */
routers.get('/getCourseById', userapp.userRequired, course.getCourseById);

/**根据课程id删除课程
 * @author bs
 */
routers.get('/delCourse', userapp.userRequired, course.delCourse);

/**
 * 讲师端--问答管理入口
 * @author: wac
 */
routers.get('/answerManage', userapp.userRequired, course.answerManageEntry);


/**
 * 根据专家ID获取专家的问题
 * @author: wac
 */
routers.get('/expertAnswer', userapp.userRequired, course.expertAnswer);
/**
 * 根据专家ID获取专家的问题的总数
 * @author: wac
 */
routers.get('/expertAnswerCount', userapp.userRequired, course.expertAnswerCount);
/**
 * 删除问题
 * @author: wac
 */
routers.post('/delAnswer', userapp.userRequired, course.delAnswer);
/**
 * 课程后台管理入口
 * @author: wac
 */
routers.get('/cmscoursemanage', userapp.userRequired, cms.getCmsModule, userapp.companyAdminRequired("vmooc"), cms.getCmsModule, course.cmEntry);
/**
 * 发表微课程信息编辑
 * @author:gs
 */
routers.get('/microCourse', userapp.userRequired, userapp.checkIsTeacher, course.microCourseEntry);

/**
 * 微课程的发布、保存为草稿
 * @author:gs
 */
routers.post('/course/micro/saveMicro', userapp.userRequired, userapp.checkIsTeacher, course.saveMicro);
/**
 * 查询微课程的信息
 *@author:gs
 */
// routers.get('/course/micro/microPublish', userapp.userRequired, userapp.checkIsTeacher, course.findMicro);

/**
 *学生端-我的课程入口
 * @author: bs
 */
routers.get('/myCourses', userapp.userRequired, course.myCourseEntry);

/**
 *学生端-获取我的课程总数
 * @author: bs
 */
routers.get('/getMyCoursesCount', userapp.userRequired, course.getMyCoursesCount);
/**
 *学生端-获取我的课程(分页)
 * @author: bs
 */
routers.get('/getMyCourses', userapp.userRequired, course.getMyCourses);

//学生端-我的课程更新状态提醒
routers.get('/newGiveCourse', userapp.userRequired, course.giveNewGiveCourse);
/**
 *学生端-我的订单入口
 * @author: bs
 */
routers.get('/myOrders', userapp.userRequired, order.myOrdersEntry);

/**
*学生端-我的订单 获取订单信息总数
* @author: bs
*/
routers.get('/getMyOrdersCount', userapp.userRequired, order.getMyOrdersCount);

/**
*学生端-我的订单 获取订单信息（分页）
* @author: bs
*/
routers.get('/getMyOrders', userapp.userRequired, order.getMyOrders);

/**
*学生端-赠送课程入口
* @author:bs
*/
routers.get('/giveCourseEntry', userapp.userRequired, course.giveCourseEntry);
/**
*讲师端-订单管理 获取订单信息总数
* @author: bs
*/
routers.get('/getExpertOrdersCount', userapp.userRequired, order.getExpertOrdersCount);

/**
*讲师端-订单管理 获取订单信息（分页）
* @author: bs
*/
routers.get('/getExpertOrders', userapp.userRequired, order.getExpertOrders);

/**
*讲师端-订单管理 删除订单信息
* @author: bs
*/
routers.get('/delOrderById', userapp.userRequired, order.delOrderById);
/**
*学生端-我的订单 取消订单
* @author: bs
*/
routers.get('/cancelOrderById', userapp.userRequired, order.cancelOrderById);
/**
 *根据订单ID获取订单信息
 */
routers.get('/getOrderById', userapp.userRequired, order.getOrderById);
/**
 * 后台管理
 * @author: shen
 */
// 后台入口
routers.get('/cms', userapp.userRequired, userapp.companyAdminRequired("vmooc"), cms.getCmsModule, cms.entry);

/** 后台管理 - 枚举 */
// 获取枚举
routers.get('/getenumcode/:code', userapp.userRequired, enumcode.getEnumcodeByCode);

/** 后台管理 - 推荐管理 */
// 入口
routers.get('/recommendmanage', userapp.userRequired, userapp.companyAdminRequired("vmooc"), cms.getCmsModule, cms.RECentry);
/**
 * 获取后台课程分类信息
 * @author: wac
 */
routers.get('/cmList', userapp.userRequired, userapp.companyAdminRequired("vmooc"), cms.getCmsModule, course.courseMenuList);
/**
 * 后台课程管理查询
 * @author: wac
 */
routers.get('/cmSelect', userapp.userRequired, userapp.companyAdminRequired("vmooc"), cms.getCmsModule, course.cmSelect);
/**
 * 后台课程数据总数
 * @author: wac
 */
routers.get('/cmSelectCount', userapp.userRequired, userapp.companyAdminRequired("vmooc"), cms.getCmsModule, course.cmSelectCount);
/**
 * 违规下架
 * @author: wac
 */
routers.get('/soldOut', userapp.userRequired, userapp.companyAdminRequired("vmooc"), cms.getCmsModule, course.soldOut);
/**
 * 审核通过
 * @author: wac
 */
routers.post('/audit', userapp.userRequired, userapp.companyAdminRequired("vmooc"), cms.getCmsModule, course.audit);
/**
 * 专家回答问题
 * @wac
 */
routers.post('/expertAnswerPay', userapp.userRequired, expertqa.expertAnswerPay);
/**
 * 添加学习方向、课程类型分类入口
 * @author:gs
 */
// routers.get('/home/addclassify', userapp.userRequired, course.microCourseEntry);
routers.get('/coursetype', userapp.userRequired, userapp.companyAdminRequired("vmooc"), cms.getCmsModule, enumcode.addClassifyEntry);

/**
 * 获取课程分类的所有
 * @author:gs
 */
routers.get('/getclassify', userapp.userRequired, userapp.companyAdminRequired("vmooc"), cms.getCmsModule, enumcode.getclassify);

/**
 * 保存学习方向、课程分类
 * @author:gs
 */
routers.get('/saveAndUpdate', userapp.userRequired, userapp.companyAdminRequired("vmooc"), cms.getCmsModule, enumcode.saveAndUpdate);

// 获取推荐位
routers.get('/getrecommend', userapp.userRequired, userapp.companyAdminRequired("vmooc"), cms.getCmsModule, cms.getrecommend);

/** 后台管理 - 焦点图 */

// 上传图片
routers.post('/cms/upload', userapp.userRequired, userapp.companyAdminRequired("vmooc"), cms.getCmsModule, cms.upload);
// 读取文件
routers.get('/upload/:module/:name', cms.getupload);
// 上传焦点图
routers.post('/cms/focuspic', userapp.userRequired, userapp.companyAdminRequired("vmooc"), cms.applyfocuspic);
// 获取焦点图
routers.get("/cms/focuspic", userapp.userRequired, userapp.companyAdminRequired("vmooc"), cms.getfocuspic);


/** 后台管理 - 课程推荐 */
// 获取列表
routers.get("/cms/getallcourses", userapp.userRequired, userapp.companyAdminRequired("vmooc"), cms.getallcourses);
// 获取数量
routers.get("/cms/getcoursescount", userapp.userRequired, userapp.companyAdminRequired("vmooc"), cms.getcoursescount);
// 课程推荐操作
routers.post("/cms/applyrecommendcourse", userapp.userRequired, userapp.companyAdminRequired("vmooc"), cms.applyrecommendcourse);

/** 讲师推荐 */
// 获取列表
routers.get("/cms/getallexperts", userapp.userRequired, userapp.companyAdminRequired("vmooc"), cms.getallexperts);
// 获取数量
routers.get("/cms/getexpertscount", userapp.userRequired, userapp.companyAdminRequired("vmooc"), cms.getexpertscount);
// 课程推荐操作
routers.post("/cms/applyrecommendexpert", userapp.userRequired, userapp.companyAdminRequired("vmooc"), cms.applyrecommendexpert);

/** 专题推荐 */
// 获取列表
routers.get("/cms/getallcoursecollection", userapp.userRequired, userapp.companyAdminRequired("vmooc"), cms.getallcourseCollection);
// 获取数量
routers.get("/cms/getcoursecollectioncount", userapp.userRequired, userapp.companyAdminRequired("vmooc"), cms.getcourseCollectioncount);
// 课程推荐操作
routers.post("/cms/applyrecommendcoursecollection", userapp.userRequired, userapp.companyAdminRequired("vmooc"), cms.applyrecommendcourseCollection);
/**
 * 新增&修改专题页面入口
 * @author: wac
 */
routers.get("/cms/sprest", userapp.userRequired, userapp.companyAdminRequired("vmooc"), cms.getCmsModule, special.sprest);
/**
 * 后台专题管理页面入口
 * @author: wac
 */
routers.get("/cms/specialManage", userapp.userRequired, userapp.companyAdminRequired("vmooc"), cms.getCmsModule, special.specialManageEntry);
/**
 * 获取专题数量
 * @author: wac
 */
routers.get('/cms/specialCount', userapp.userRequired, userapp.companyAdminRequired("vmooc"), special.specialCount);
/**
 * 获取专题列表
 * @author: wac
 */
routers.get('/cms/specials', userapp.userRequired, userapp.companyAdminRequired("vmooc"), special.specials);
/**
 * 删除专题
 * @author: wac
 */
routers.post('/cms/delSpecial', userapp.userRequired, userapp.companyAdminRequired("vmooc"), special.delSpecial);
/**
 * 上传专题背景
 * @author: wac
 */
routers.post('/special/upload', userapp.userRequired, userapp.companyAdminRequired("vmooc"), special.specialImg);
/**
 * 获取专题课程
 * @author: wac
 */
routers.get('/cms/sepcailCourse', userapp.userRequired, userapp.companyAdminRequired("vmooc"), special.sepcailCourse);
/**
 * 获取专题课程数量
 * @author: wac
 */
routers.get('/cms/sepcailCourseCount', userapp.userRequired, userapp.companyAdminRequired("vmooc"), special.sepcailCourseCount);
/**
 * 获取专题讲师
 * @author: wac
 */
routers.get('/cms/sepcailExpert', userapp.userRequired, userapp.companyAdminRequired("vmooc"), special.sepcailExpert);
/**
 * 获取专题讲师数量
 * @author: wac
 */
routers.get('/cms/sepcailExpertCount', userapp.userRequired, userapp.companyAdminRequired("vmooc"), special.sepcailExpertCount);
//后台管理--课程订单管理入口
routers.get("/courseorder", userapp.userRequired, cms.getCmsModule, userapp.companyAdminRequired("vmooc"), cms.cmsOrderManageEntry);
//后台管理--课程订单管理获取统计数据
routers.get("/orderStatics", userapp.userRequired, userapp.companyAdminRequired("vmooc"), order.cmsOrderStatics);
//后台管理--问答订单管理入口
routers.get("/answerorder", userapp.userRequired, cms.getCmsModule, userapp.companyAdminRequired("vmooc"), cms.cmsQAManageEntry);
//后台管理--偷看订单管理入口
routers.get("/peekorder", userapp.userRequired, cms.getCmsModule, userapp.companyAdminRequired("vmooc"), cms.cmsPeekManageEntry);
//后台管理--专题订单管理入口
routers.get("/collectionorder", userapp.userRequired, cms.getCmsModule, userapp.companyAdminRequired("vmooc"), cms.cmsCollectionManageEntry);
/** 支付 **/

// 生成二维码
routers.get("/buildqr", userapp.userRequired, qrcode.buildQr);

// 生成订单
routers.post('/createcourseorder', userapp.userRequired, order.createCourseOrder);
// 支付未付款的订单
routers.post('/unPaidOrderPay', userapp.userRequired, order.unPaidOrderPay);
// ping++退款测试
routers.post('/pingPayBack', order.pingPayBackSuccess);
// 公共模块 /common
/**
 * 个人资料
 * @author:gs
 */
routers.get('/personal', userapp.userRequired, expert.PersonalEntry);
/**
 * 查询讲师的其他信息
 * @author:gs
 */
routers.get('/expertOther', userapp.userRequired, expert.expertOther);
/**
 * 保存个人资料
 * @author:gs
 */
routers.post('/submit/perInfo', userapp.userRequired, setup.savePerInfo);
/**
 * 保存讲师多余信息
 * @author:gs
 */
routers.post('/submitExpert/perInfo', userapp.userRequired, setup.saveExpertPerInfo);
/**
 * 保存个人头像
 * @author:gs
 */
routers.post('/uploadAvatar', userapp.userRequired, setup.uploadAvatar);
/**
 * 安全设置-修改密码
 * @author:gs
 */
routers.get('/modifypwd', userapp.userRequired, expert.modifyPwdEntry);
/**
 * 验证输入密码是否正确
 *@author:gs
 */
routers.post('/checkpwd', userapp.userRequired, setup.checkOldPwd)
/**
 * 进行修改密码
 * @author:gs
 */
routers.post('/submit/modifypwd', userapp.userRequired, setup.savepwd);

/** 账户 */
// 个人账户入口
routers.get('/myaccount', userapp.userRequired, account.myAccountEntry);
// 读取个人流水
routers.get('/personlaundrylist', userapp.userRequired, account.personlaundrylist);
// 提交提现申请
routers.post('/applywithdrawal', userapp.userRequired, account.applywithdrawal);

/** 个人银行卡 */
// 入口
routers.get('/mycard', userapp.userRequired, account.myCardEntry);
// 绑定银行卡
routers.post('/bindmycard', userapp.userRequired, account.bindMyCard);
// 读取个人账户
routers.get('/getmyaccount', userapp.userRequired, account.getmyaccount);
// 提现申请
routers.post('/applywithdraw', userapp.userRequired, withdraw.applyWithDraw);


/**
 * 讲师问答管理设置-入口
 * @author:gs
 */
routers.get('/qasetup', userapp.userRequired, userapp.checkIsTeacher, expert.QaSetupEntry);
/**
 * 查询讲师问答管理设置
 * @author:gs
 */
routers.get('/getMsg', userapp.userRequired, userapp.checkIsTeacher, setup.findExpert);
/**
 * 更新保存问答管理
 * @author:gs
 */
routers.post('/submit/qasetup', userapp.userRequired, userapp.checkIsTeacher, setup.saveSetup);
//生成课程赠送订单
routers.post('/createGiveCourseOrder', userapp.userRequired, order.createGiveCourseOrder);
// ping ++ 支付完成回调
// routers.get('/pingchargesuccess', order.pingChargeSuccess);
routers.post('/pingchargesuccess', order.pingChargeSuccess);
/** 后台管理 - 会员管理 */
routers.get('/accountManage', userapp.userRequired, userapp.companyAdminRequired("vmooc"), cms.getCmsModule, account.accountManageEntry);
// 获取所有会员
routers.get('/getalluserslist', userapp.userRequired, userapp.companyAdminRequired('vmooc'), userapp.getAllUsersList);
// 获取会员统计
routers.get('/getalluserscount', userapp.userRequired, userapp.companyAdminRequired('vmooc'), userapp.getAllUsersCount);

/**
 * 插入专题信息
 * @author: wac
 */
routers.get('/cms/specialAdd', userapp.userRequired, userapp.companyAdminRequired("vmooc"), special.specialAdd);
/**
 * 修改专题信息
 * @author: wac
 */
routers.get('/cms/specialupdate', userapp.userRequired, userapp.companyAdminRequired("vmooc"), special.specialupdate);
/**
 * 专题预览
 * @author: wac
 */
routers.get('/cms/speciallook', userapp.userRequired, userapp.companyAdminRequired("vmooc"), special.speciallook);
/**
 * 专题预览删除
 * @author: wac
 */
routers.get('/cms/dellook', userapp.userRequired, userapp.companyAdminRequired("vmooc"), special.dellook);
// 更新用户密码
routers.post('/cms/edituserpwd', userapp.userRequired, userapp.companyAdminRequired('vmooc'), cms.editUserPwd);

// 更新课程转码状态
routers.get('/refreshCourse', course.refreshCourse);

// 专题购买成功时，更新我的课程信息
routers.get('/myCoursePush', userapp.userRequired, courseCollection.myCoursePush);



/** 后台管理 - 提现管理 */
// 入口
routers.get('/cashmanage', userapp.userRequired, userapp.companyAdminRequired("vmooc"), cms.getCmsModule, withdraw.cashManageEntry);
// 读取提现
routers.get('/cms/getcashlist', userapp.userRequired, userapp.companyAdminRequired('vmooc'), withdraw.getcashlist);
// 统计
routers.get('/cms/cashstatistic', userapp.userRequired, userapp.companyAdminRequired('vmooc'), withdraw.statisticTotal);
// 确认提现
routers.post('/cms/surewithdraw', userapp.userRequired, userapp.companyAdminRequired('vmooc'), withdraw.sureWithdraw);

/** 后台管理 - 平台收入 */
// 入口
routers.get('/incomeManage', userapp.userRequired, userapp.companyAdminRequired("vmooc"), cms.getCmsModule, cms.incomeManageEntry);
// 读取提现
routers.get('/cms/getincomelist', userapp.userRequired, userapp.companyAdminRequired('vmooc'), cms.getincomelist);
// 统计
routers.get('/cms/incomestatistic', userapp.userRequired, userapp.companyAdminRequired('vmooc'), cms.incomeStatisticList);
/** 后台管理 - 账户流水管理 */
// 入口
routers.get('/cms/accountdetails', userapp.userRequired, userapp.companyAdminRequired("vmooc"), cms.getCmsModule, cms.laundryManageEntry);
// 读取流水
routers.get('/cms/getlaundrylist', userapp.userRequired, userapp.companyAdminRequired('vmooc'), cms.getlaundrylist);
// 统计
routers.get('/cms/laundrystatistic', userapp.userRequired, userapp.companyAdminRequired('vmooc'), cms.statisticTotal);
// 验证图片资源的存在是否
// routers.get('/avatar/:id', setup.checkAvatar);

// 测试退款
// routers.get('/createrefund', order.testrefund);
/**
 * 图片处理
 * @author wac
 */
// routers.get('/gm', imageMagick.imageResize);

// 查找是否购买课程(课程)
// routers.post('/findIsBuy', userapp.userRequired, course.findIsBuy);
routers.post('/findIsBuy', course.findIsBuy);
// 查寻是否买过课程(问答)
routers.post('/findIsBuyCourse', course.findIsBuyCourse);
// 查询偷看人数
routers.post('/findpeekCount', course.findpeekCount);

// 查询peeker
// routers.post('/findPeeker', expertqa.findPeeker);

// 添加点赞者
routers.get('/addLiker', expertqa.addLiker);

//课程播放页--推送学习进度
routers.get('/updateStudySpeed', userapp.userRequired, course.updateStudySpeed);

//课程播放页--获取我的课程信息
routers.get('/getMyCourseByInfo', userapp.userRequired, course.getMyCourseByInfo);
// 通过讲师的Id获取讲师的价格
routers.post('/selsetMoney', userapp.userRequired, expertqa.selsetMoney);

// 消息中心入口
routers.get('/messageCenter', userapp.userRequired, messageCenter.messageCenterEntry);

//获取我的信息总数
routers.get('/getMyMessagesCount', userapp.userRequired, messageCenter.getMyMessagesCount);
//获取我的信息（分页）
routers.get('/getMyMessages', userapp.userRequired, messageCenter.getMyMessages);
//标记消息为已读
routers.get('/updateMessage', userapp.userRequired, messageCenter.updateMessage);
/**
 * 收藏
 * @author: wac
 */
routers.post('/enshrine', userapp.userRequired, course.enshrine);
/**
 * 查询是否收藏课程
 * @author: wac
 */
routers.get('/isEnshrine', userapp.userRequired, course.isEnshrine);
/**
 * 取消收藏
 * @author: wac
 */
routers.get('/delEnshrine', userapp.userRequired, course.delEnshrine);
/**
 * 我的收藏入口
 * @author: wac
 */
routers.get('/enshrineEntry', userapp.userRequired, course.enshrineEntry);
/**
 * 我的收藏数量
 * @author: wac
 */
routers.get('/enshrineCount', userapp.userRequired, course.enshrineCount);
/**
 * 我的收藏
 * @author: wac
 */
routers.get('/myEnshrine', userapp.userRequired, course.myEnshrine);

/** app 马后炮的用户对接 */
routers.get('/getmahoupao/api/user', course.test);
/**
 * 合作方管理
 * @author:gs
 */
routers.get('/cms/joinPartner', userapp.userRequired, cms.getCmsModule, cms.joinPartner);
/** 获取合作方管理的列表 **/
routers.get('/cms/partnerlist', userapp.userRequired, cms.partnerlist);
/** 编辑保存合作方用户 */
routers.post('/saveOrEditPartner', userapp.userRequired, cms.saveOrEdit);
/** 删除合作方 */
routers.post('/delPartner', userapp.userRequired, cms.delPartner);
/** 合作方域名修改 配置修改 */
routers.post('/editNavDomain', userapp.userRequired, cms.editNavDomain);
// 读取权限、分成配置
routers.get('/cms/getrights', userapp.userRequired, cms.getRightsByDomain);
// 读取权限、分成配置
routers.post('/cms/editrights', userapp.userRequired, cms.editRightsByDomian);
/**
 * 前台网页配置
 * @author:gs
 */
routers.get('/cms/frontDeploy', userapp.userRequired, cms.getCmsModule, cms.frontDeploy);
// 顶部配置查询
routers.post('/cms/editNav', userapp.userRequired, cms.editNav);
// 顶部配置新增
routers.post('/cms/addNav', userapp.userRequired, cms.addNav);
// 上传二维码
routers.post('/modifyQrCode', userapp.userRequired, cms.modifyQrCode);
// 上传logo
routers.post('/modifylogo', userapp.userRequired, cms.modifylogo);
// 获取底部配置
routers.post('/cms/bottomNav', userapp.userRequired, cms.bottomNav);
// 修改顶部
routers.post('/cms/edit', userapp.userRequired, cms.edit);

// ---------------------------------优惠码-------------------------------------------------
routers.get('/promoCode', userapp.userRequired, userapp.checkIsTeacher, course.promoCodeEntry);
// 查询讲师课程
routers.get('/getCodeCourses', userapp.userRequired, course.getCodeCourses);
// 查询讲师课程次数
// routers.get('/getCodeCoursesCount', userapp.userRequired, course.getCodeCoursesCount);
// 验证优惠码(次数及是否正确)
routers.get('/checkPromoCode', userapp.userRequired, course.checkPromoCode);
// 查询优惠码详情
routers.get('/getCodesByCourseId', userapp.userRequired, course.getCodesByCourseId);
// 生成优惠码
routers.get('/saveCodeByCourseId', userapp.userRequired, course.saveCodeByCourseId);
// 查询系统优惠码次数
routers.get('/findNumber', userapp.userRequired, course.findNumber);

// ---------------------------------试题部分-------------------------------------------------
// 根据课时id查找题库
routers.get('/showExamByClazz', userapp.userRequired, course.showExamByClazz);
// 保存试题
routers.post('/saveExamByClazz', userapp.userRequired, course.saveExamByClazz);
// 保存学生试卷
routers.post('/saveStudentExam', userapp.userRequired, course.saveStudentExam);
// 查询学生往期成绩
routers.get('/queryPreScore', userapp.userRequired, course.queryPreScore);
// 查询学生的成绩详情
routers.post('/queryStudyRecord', userapp.userRequired, course.queryStudyRecord);
// 查询其他学员成绩详情
routers.post('/queryOtherStudyRecord', userapp.userRequired, course.queryOtherStudyRecord);
//上传试题excel
routers.post('/uploadExcel', userapp.userRequired, course.uploadExcel);
//导出试题excel
routers.post('/downloadExcel', userapp.userRequired, course.downloadExcel);


/** API - 个人中心 */
// 读取个人流水
routers.get('/api/personlaundrylistAPI', account.personlaundrylistAPI);
// 提交个人提现申请
routers.post('/api/applyWithDrawAPI', account.applyWithDrawAPI);
// 读取个人账户
routers.get('/api/getmyaccount', account.getmyaccountAPI);
// 中转文件读取
routers.get('/getvideofile', userapp.userRequired, course.readVideoFile);
export default routers;
