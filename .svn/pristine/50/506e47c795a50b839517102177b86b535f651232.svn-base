import mongoose from 'mongoose';

export default {
  // 学员试卷
  name: 'StudentExam',

  init() {
    const schema = new mongoose.Schema({
      // 试卷examTplId == 题库_id
      examTplId: { type: String },
      // 课时名称
      clazzName: { type: String },
      // 课程id
      courseId: { type: String },
      // 学员
      studentId: { type: String },
      // 学员姓名
      studentName: { type: String },
      // 题目(10道)
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
        // 学员解答答案
        answers: { type: String },
        // 题库答案
        result: { type: String },
      }],
      // 成绩
      score: { type: Number },
      // 创建时间
      createAt: { type: Number },
      // 更新时间(删除2017.5.20)
      // updateAt: { type: Number },
    });

    mongoose.model(this.name, schema, 'studentExam');
  }
}