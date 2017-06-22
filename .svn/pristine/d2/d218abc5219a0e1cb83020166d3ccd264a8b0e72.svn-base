import mongoose from 'mongoose';

export default {

  // 回答
  name: 'Answer',

  init() {
    const schema = new mongoose.Schema({
      // 问题_id
      questionId: { type: String },
      // 回答者_id
      answererId: { type: String },
      // 回答者姓名
      answererName: { type: String },
      // 回答者头像路径
      answererAvatar: { type: String },
      // 回答内容
      content: { type: String },
      // 回答_id
      atAnswerId: { type: String, default: null },
      // 回答路径(问题id路径)
      atAnswerPath: { type: String, default: null },
      // 回答时间
      createAt: { type: Date, default: Date.now() },
      // 点赞次数
      likeCount: { type: Number, default: 0 },
      // 点赞者(前5个)
      liker: [{
        id: { type: String },
        name: { type: String },
        avatar: { type: String },
      }],
      // 偷看次数
      peekCount: { type: Number, default: 0 },
      // 偷看者(前5个)
      peeker: [{
        id: { type: String },
        name: { type: String },
        avatar: { type: String },
      }],
      // 价格
      money: { type: Number },
      // 订单Id
      ordersId: { type: String },
      // 订单编号
      ordersCode: { type: String },
      // 更新时间
      updateAt: { type: Number, default: Date.now() },
      //是否偷看
      isPeek: { type: Boolean, default: false },
      // 域名
      domain: { type: String }
    });

    schema.index({ questionId: 1 });
    schema.index({ answererId: 1 });
    schema.index({ atAnswerPath: 1 });

    mongoose.model(this.name, schema, 'answer');
  }
}





