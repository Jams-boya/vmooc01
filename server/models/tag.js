import mongoose from 'mongoose';

export default {

  // 问题分类
  name: 'Tag',

  init() {
    const schema = new mongoose.Schema({
      // 名称
      name: {type: String},
      // 引用次数
      refCount: {type: Number, default: 0},
    });

    schema.index({name: 1}, {unique: true});

    mongoose.model(this.name, schema, 'tag');
  }
}





