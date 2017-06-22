import mongoose from 'mongoose';

export default {

  // 枚举编码
  name: 'EnumCode',

  init() {
    const schema = new mongoose.Schema({
      // enum类型
      type: {type: String},
      // enum编号
      code: {type: String},
      // enum值
      values: [{
        name : {type: String},
      }],
    });

    schema.index({type: 1}, {unique: true});

    mongoose.model(this.name, schema, 'enumCode');
  }
}