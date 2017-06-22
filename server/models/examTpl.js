import mongoose from 'mongoose';

export default {
  // 题库模板
  name: 'ExamTpl',

  init() {
    const schema = new mongoose.Schema({
      // 课时名称
      clazzName: { type: String },
      // 创建者id
      createId: { type: String },
      // 创建者姓名
      createName: { type: String },
      // 选择题全部数据
      questions: [{
        // 题目标题
        title: { type: String },
        // 一道题目选项
        options: [{
          // 一个选项具体内容
          optDetail: { type: String },
          // 是否正确
          isTrue: { type: Boolean, default: false },
        }],
        // 题库选择题答案
        result: { type: String },
      }],
      // 创建时间
      createAt: { type: Number },
      // 更新时间
      updateAt: { type: Number },
    });
    mongoose.model(this.name, schema, 'examTpl');
  }
}