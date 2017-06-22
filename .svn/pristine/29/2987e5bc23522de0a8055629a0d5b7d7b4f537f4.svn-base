import mongoose from 'mongoose';

export default {

  // 焦点图
  name: 'FocusPicture',

  init() {
    const schema = new mongoose.Schema({
      // 平台 (lcpsp, mahoupao)
      platform: {type: String},
      pics: [{
        // 图片路径
        url: {type: String},
        // 背景颜色
        color: {type: String},
        // 点击链接
        clickUrl: {type: String}
      }]
    });
    
    schema.index({platform: 1}, {unique: true});
    mongoose.model(this.name, schema, 'focuspicture');
  }

}