import mongoose from 'mongoose';

export default {

  // 自增长序列
  name: 'AutoIncrement',

  init() {
    const schema = new mongoose.Schema({
      // 模块
      module: {type: String},

      // 序列
      incrementcount: {type: Number},

      // 初始值
      initIncrement: {type: Number}

    });

    schema.index({module: 1}, {unique: true});
    mongoose.model(this.name, schema, 'autoincrement');
  }
}