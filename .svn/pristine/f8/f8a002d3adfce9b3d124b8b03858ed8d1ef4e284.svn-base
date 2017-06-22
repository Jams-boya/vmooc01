import mongoose from 'mongoose';

export default {

  // 推荐位
  name: 'Recommend',

  init() {
    const schema = new mongoose.Schema({
      // 名称(广告位)
      name: { type: String },
      // 对应模块 (pic: 焦点图， course: 课程, expert: 专家,  coursecollection: 专题)
      module: { type: String },
      // 所属页面 (home: 首页)
      page: { type: String },
      // 修改人id
      upUserId: { type: String },
      // 修改人姓名
      upUserName: { type: String },
      // 来源
      domain: { type: String },
      // 修改日期
      updateAt: { type: Number }
    });

    schema.index({ name: 1, page: 1 }, { unique: true });
    mongoose.model(this.name, schema, 'recommend');
  }

}