import mongoose from 'mongoose';

export default {
  // 收藏
  name: 'Enshrine',
  init() {
    const schema = new mongoose.Schema({
      //用户ID
      userID: { type: String },
      //课程ID
      courseID: { type: String },
    });
    schema.index({ userId: 1 });
    mongoose.model(this.name, schema, 'enshrine');
  }
}