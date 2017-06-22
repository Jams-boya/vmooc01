import mongoose from 'mongoose';

export default {

  // 问题
  name: 'Question',

  init() {
    const schema = new mongoose.Schema({
      // 提问者_id
      askerId: {type: String},
      // 提问者姓名
      askerName: {type: String},
      // 头像路径
      askerAvatar: {type: String},
      // 被提问者_id
      requiredAnswerId: {type: String},
      // 被提问者姓名
      requiredAnswerName: {type: String},
      // 被提问者头像路径
      requiredAnswerAvatar: {type: String},
      // 课程Id
      courseId: {type: String},
      // 课程名称
      courseName: {type: String},
      // 价格
      money: {type: Number, default: 20},
      // 付款时间
      payAt: {type: Date},
      // 订单Id
      ordersId: {type: String},
      // 订单编号
      ordersCode: {type: String},
      // 问题状态 0=待支付 1=已付款待回答 2=已回答 3=已退款
      state: {type: Number, default: 0},
      // 标题
      title: {type: String},
      // 问题描述
      content: {type: String},
      // 分类
      tag: [{type: String}],
      // 回答次数
      answerCount: {type: Number, default: 0},
      // 创建时间
      createAt: {type: String, default: Date.now()},
      // 更新时间
      updateAt: {type: String, default: Date.now()},
    });

    schema.index({askerId: 1, tag: 1});
    schema.index({requiredAnswerId: 1});
    schema.index({updateAt: -1});

    mongoose.model(this.name, schema, 'question');
  }
}




