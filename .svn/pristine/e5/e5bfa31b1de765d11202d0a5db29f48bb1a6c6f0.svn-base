import mongoose from 'mongoose';

export default {

  // 我的课程
  name: 'MyCourse',

  init() {
    const schema = new mongoose.Schema({
      // 用户id
      userId: { type: String },
      // 用户姓名
      userName: { type: String },
      // 昵称
      nickName: { type: String },
      // 用户头像(新增)
      userAvatar: { type: String },
      // 课程id
      courseId: { type: String },
      // 课程来源 0=我购买的 ，1=别人赠送
      courseFrom: { type: Number },
      // 接收信息(别人赠送给我)
      receiveInfo: {
        // 赠送人id
        giveId: { type: String },
        // 赠送人姓名
        giveName: { type: String },
        // 课程截止时间
        courseEndTime: { type: Number },
        // 赠送时间
        giveTime: { type: Number },
      },
      // 赠送信息(我赠送给别人)
      giveInfo: [{
        // 收取人id
        receiveId: { type: String },
        // 收取人姓名
        receiveName: { type: String },
        // 课程截止时间
        courseEndTime: { type: Number },
        // 赠送时间
        giveTime: { type: Number },
      }],
      // 我购买的
      buyInfo: {
        orderId: { type: String },
        orderSn: { type: String },
        // 当前字段值不可靠，真正查询购买数去订单表查
        buyCount: { type: Number },
        usedCount: { type: Number },
        buyAt: { type: Number },
      },
      // 起始时间
      startAt: { type: Date },
      // 到期时间
      endAt: { type: Date },

      // 播放进度
      progress: [{
        //章节号
        cidx: { type: Number },
        //课程号
        index: { type: Number },
        // 课时id
        courseId: { type: String },
        // 播放时间
        playTime: { type: String },
        // 课程总时长 (新增4.28 删除5.21)
        totalTime: { type: String },
      }],
      // 学习进度
      speedStu: {
        // 课程id
        courseId: { type: String },
        // 课程名
        courseName: { type: String },
        // 课时总数
        courseCount: { type: Number },
        // 已看的课时数
        lookedCount: { type: Number, default: 0 },
        //已观看的课程
        lookedCourses: [{
          cidx: { type: Number },
          index: { type: Number }
        }]
      },
      // 是否观看过
      new: { type: Boolean, default: true },
      // 域名
      domain: { type: String },
      // 优惠码
      promoCode: [{ type: String }],
    });
    schema.index({ userId: 1 });
    mongoose.model(this.name, schema, 'myCourse');
  }
}






