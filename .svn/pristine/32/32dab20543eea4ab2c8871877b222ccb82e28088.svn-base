import mongoose from 'mongoose';

export default {

  // 收藏
  name: 'Favorite',

  init() {
    const schema = new mongoose.Schema({
      // 收藏类型
      type: {type: String},
      // 收藏_id
      refId: {type: String},
      // 收藏者_id
      userId: {type: String},
      // 收藏者姓名
      userName: {type: String},
      // 创建时间
      createAt: {type: Number},
    });

    schema.index({type: 1, refId: 1, userId: 1}, {unique: true});
    schema.index({type: 1, refId: 1, userId: 1, createAt: 1});

    mongoose.model(this.name, schema, 'favorite');
  }
}






