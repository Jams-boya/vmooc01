import mongoose from 'mongoose';

export default {

  // 申请合作
  name: 'teacherApply',

  init() {
    const schema = new mongoose.Schema({
      // userid
      userId: { type: String },
      // userName
      userName: { type: String },
      // 邮箱
      email: { type: String },
      // 姓名
      name: { type: String },
      // 联系电话
      phone: { type: String },
      // 0=未联系 1=审核通过 2=审核不通过 3=禁用
      state: { type: Number, default: 0 },
      // 0=第一次进入
      isState1: { type: Number, default: 0 },
      // 1 = 第二次进入
      isState2: { type: Number, default: 0 },
      // 擅长
      skilled: [{ type: String }],
      // 自我介绍
      myself: { type: String },
      // 创建者id
      createId: { type: String },
      // 创建时间
      createAt: { type: Number, default: Date.now() },
      // 更新者id
      updateId: { type: String },
      // 更新时间
      updateAt: { type: Number, default: Date.now() },
      // 职称
      professional: { type: String },
      // 生活照
      lifePhoto: { type: String },
      // 域名
      domain: { type: String }

    });

    schema.index({ userId: 1, }, { unique: true });
    schema.index({ phone: 1, email: 1 });
    schema.index({ state: 1 });
    schema.index({ createAt: 1 })

    mongoose.model(this.name, schema, 'teacherapply');
  }
}






