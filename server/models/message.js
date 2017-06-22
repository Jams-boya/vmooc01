import mongoose from 'mongoose';

export default {

  // 消息
  name: 'Messages',

  init() {
    const schema = new mongoose.Schema({
      // 消息类型 0=系统消息, 1=课程消息, 2=企业云消息
      type: {type: String},
      // 消息内容
      content: {type: String},
      // 消息接受者id
      userId: {type: String},
      // 消息指向路径
      url: {type: String},
      // 消息状态 0=未查看, 1=已查看
      state: {type: Number, default: 0},
      // 创建时间
      createAt: {type: Date},
    });
    mongoose.model(this.name, schema, 'Messages');
  }
}