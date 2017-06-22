import mongoose from 'mongoose';

export default {

  // 合作方管理
  name: 'Partner',

  init() {
    const schema = new mongoose.Schema({
      // 合作方名称
      name: { type: String },
      // 合作方联系人
      contactName: { type: String },
      // 联系电话
      phone: { type: Number },
      // 合作开始时间
      startAt: { type: String },
      // 合作结束时间
      endAt: { type: String },
      // 域名
      domain: { type: String },
      // 权限列表
      rights: [{ type: String }],
      // 操作人id
      opId: { type: String },
      // 操作人
      opName: { type: String },
      // 删除合作方  0=>在合作 1=>已删除
      logicalDelete: { type: Number, default: 0 },
      // 创建时间
      createAt: { type: Number, default: Date.now() },
      // 更新时间
      updateAt: { type: Number, default: Date.now() },
    });
    mongoose.model(this.name, schema, 'partner');
  }
}


