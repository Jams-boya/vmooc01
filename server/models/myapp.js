/** 我的应用 */
import mongoose from 'mongoose';
export default {
  name: 'MyApp',
  init() {
    const schema = new mongoose.Schema({
      // 公司ID
      companyId: {type: String},
      // 有效时间
      expiration: {type: Number},
      // 模块图标
      moduleIcon: {type: String},
      // 模块名称
      moduleName: {type: String},
      // 模块描述
      moduleDescription: {type: String},
      // 入口地址
      moduleEntryUrl: {type: String},
      // 模块
      moduleCode: {type: String},
      // 使用方式 (0为免费， 1为试用，2为购买，3为过期)
      type: {type: Number},
      // 过期原因 (0为 试用过期， 1 为购买过期)
      dueReason: {type: Number},
      // 购买时间
      buyAt: {type: Number}
    });
    schema.index({companyId: 1, moduleCode: 1}, {unique: true});
    mongoose.model(this.name, schema, 'myapp');
  }
}
