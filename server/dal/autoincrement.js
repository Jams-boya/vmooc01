import {AutoIncrement, Expert} from '../models';

export default {

  /** 自增长序列 */
  buildautoincrement(module, callback) {
    AutoIncrement.findOneAndUpdate({module}, {$inc: {incrementcount: 1}}, {new: true, upsert: true}, callback);
    
  }
}