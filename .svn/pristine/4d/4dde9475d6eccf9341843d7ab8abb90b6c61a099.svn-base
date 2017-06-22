import mongoose from 'mongoose';

export default {

  // 偷看
  name: 'Peeker',

  init() {
    const schema = new mongoose.Schema({
      // 回答id
      answerId: { type: String },
      // 用户id
      userId: { type: String },
      // 订单号
      orderId: { type: String },
    });

    schema.index({ userId: 1 });

    mongoose.model(this.name, schema, 'peeker');
  }
}






