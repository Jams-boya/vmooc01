import mongoose from 'mongoose';

export default {
  // 回答
  name: 'CmsModule',
  init() {

    const schema = new mongoose.Schema({
      // 组编码
      groupCode: {type: String},
      // 组名称
      groupName: {type: String},
      // 模块编码
      moduleCode: {type: String},
      // 模块名称
      moduleName: {type: String},
      // 操作
      operations: [{
        // 编码
        code: {type: String},
        // 名称
        name: {type: String},
      }],
      // 组图标css类
      groupCss: {type: String},
      // 模块url
      moduleUrl: {type: String},
      // 显示顺序
      displayOrder: {type: String},
    });

    schema.index({groupCode: 1, groupName:1});
    schema.index({moduleCode: 1});
    schema.index({displayOrder: 1});
    
    mongoose.model(this.name, schema, 'cmsmodule');
  }
}