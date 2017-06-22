import mongoose from 'mongoose';

export default {

  // 点赞
  name: 'Like',

  init() {
    const schema = new mongoose.Schema({
      // 点赞者id
      userId: { type: String },
      // 回答id
      answerId: { type: String },
    });

    schema.index({ userId: 1 });

    mongoose.model(this.name, schema, 'like');
  }
}