import mongoose from 'mongoose';

export default {

  // 
  name: 'QuestionTouch',

  init() {
    const schema = new mongoose.Schema({
      // 问题_id
      questionId: {type: String},
      // 回答_id
      answerId: {type: String},
      // touch type:  0=偷看 1=点赞
      touchType: {type: Number},
      // toucher _id
      toucherId: {type: String},
      // touch time
      createAt: {type: Number, default: Date.now()},
    });

    schema.index({questionId: 1, askerId: 1, touchType: 1});

    mongoose.model(this.name, schema, 'questionTouch');
  }
}






