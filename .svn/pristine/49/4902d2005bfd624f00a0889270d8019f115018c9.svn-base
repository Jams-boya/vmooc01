import mongoose from 'mongoose';

export default {

  // 手续费等级
  name: 'CommissionLevel',

  init() {
    const schema = new mongoose.Schema({
      // 域名
      from: {type: String},
      // 类型 course qa peep
      type: {type: String},
      level: [{
        // 范围起始
        start: {type: Number},
        // 范围结束
        end: {type: Number},
        // 平台提成比例
        commission: {type: Number},
        // 讲师(回答者，课程提供者)
        expert: {type: Number},
        // 提问者
        answer: {type: Number}
      }],
      
    });
    schema.index({from: 1, type: 1}, {unique: true});
    mongoose.model(this.name, schema, 'commissionlevel');
  }
}