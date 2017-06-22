import {CommissionLevel} from '../models';

export default {
  /** 读取提成率 */
  async loadCommission(type, value) {
    return new Promise(function (resolve, reject){
      CommissionLevel.findOne({type, start: {$gte: value}, end: {$lt: value}}, (err, comm) => {
        if (err || !comm)
          return resolve(0.4);
        return resolve(comm.commossion);
      });
    });
  }
}