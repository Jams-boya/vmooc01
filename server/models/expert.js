import mongoose from 'mongoose';

export default {

  // 专家
  name: 'Expert',

  init() {
    const schema = new mongoose.Schema({
      // 用户id
      userId: { type: String },
      // 姓名
      name: { type: String },
      // 头像路径
      avatar: { type: String },
      // 职称
      professionalTitle: { type: String },
      // 简介
      briefDescription: { type: String },
      // 详细描述
      description: { type: String },
      // 主页浏览被次数
      viewedCount: { type: Number, default: 0 },
      // 创建者_id
      createId: { type: String },
      // 创建时间
      createAt: { type: Number, default: Date.now() },
      // 更新者_id
      updateId: { type: String },
      // 更新时间
      updateAt: { type: Number, default: Date.now() },
      // 是否为推荐
      isRecommend: { type: Boolean, default: false },
      // 价格
      money: { type: Number, default: 20 },
      // 系统通知
      systemMsg: { type: Boolean, default: false },
      // 邮件通知
      emailMsg: { type: Boolean, default: false },
      // 生活照
      lifePhoto: { type: String },
      // 手机号
      phone: { type: Number },
      // 邮箱
      email: { type: String },
      // 昵称
      nickName: { type: String },
      // 擅长
      skilled: [{ type: String }],
      // 域名
      domain: { type: String }
    });

    mongoose.model(this.name, schema, 'expert');
  }
}
