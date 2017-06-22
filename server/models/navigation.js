import mongoose from 'mongoose';

export default {

  // 网站配置
  name: 'Navigation',

  init() {
    const schema = new mongoose.Schema({
      // 操作人id
      opId: { type: String },
      // 操作人
      opName: { type: String },
      // 域名
      domain: { type: String },
      // 文字链接
      iterms: [{
        // 标题
        title: { type: String },
        // 链接
        link: { type: String },
        // 指向 0=>top 1=>foot
        direct: { type: Number },
      }],
      // 二维码
      qrcode: { type: String },
      // 二维码介绍
      qrintro: { type: String },
      // logo
      logo: { type: String },
      // logo链接
      logolink: {type: String},
      // 合作到期 0=>合作中 1=>合作到期
      logicalDelete: { type: Number, default: 0 },
      // 创建时间
      createAt: { type: Number, default: Date.now() },
      // 更新时间
      updateAt: { type: Number, default: Date.now() },
    });
    mongoose.model(this.name, schema, 'navigation');
  }
}


